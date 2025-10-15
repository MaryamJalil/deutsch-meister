import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as path from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '../../generated/prisma';
@Injectable()
export class AudioService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly logger = new Logger(AudioService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.region = this.config.get<string>('AWS_REGION') ?? '';
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID') ?? '';
    const secretAccessKey =
      this.config.get<string>('AWS_SECRET_ACCESS_KEY') ?? '';
    this.bucket = this.config.get<string>('AWS_S3_BUCKET') ?? '';

    if (!this.region || !accessKeyId || !secretAccessKey || !this.bucket) {
      throw new Error(
        'Missing AWS configuration (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET)',
      );
    }

    this.s3 = new S3Client({
      region: this.region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  /**
   * Upload an audio file to S3 and create an Audio record.
   * Matches prisma/schema.prisma Audio model:
   * id (cuid), filename, s3Key (unique), url, createdAt, lessonId?
   */
  async uploadAudio(
    file: Express.Multer.File,
    lessonId?: number,
  ): Promise<Prisma.AudioGetPayload<{}>> {
    if (!file?.buffer || file.buffer.length === 0) {
      throw new Error('Invalid file buffer');
    }

    const safeName =
      file.originalname?.replace(/[^\w.\-]/g, '_') || 'upload.bin';
    const key = `audio/${Date.now()}-${path.basename(safeName)}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || 'application/octet-stream',
        ContentLength: file.buffer.length,
      }),
    );

    // Public object URL (if bucket/object is public). For private buckets, prefer getAudioUrl().
    const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    return this.prisma.audio.create({
      data: {
        filename: file.originalname || safeName,
        s3Key: key,
        url,
        lessonId: lessonId ?? null,
      },
    });
  }

  /**
   * Return a presigned GET URL using stored s3Key.
   * Falls back to stored url if you decide to use that directly.
   */
  async getAudioUrl(id: string): Promise<string> {
    const audio = await this.prisma.audio.findUnique({ where: { id } });
    if (!audio) {
      throw new NotFoundException('Audio not found');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: audio.s3Key,
    });

    // 1 hour expiry
    return getSignedUrl(this.s3, command, { expiresIn: 3600 });
  }
}
