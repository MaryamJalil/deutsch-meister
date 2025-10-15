import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import type { Express } from 'express';
import { AudioService } from './audio.service';

@Resolver()
export class AudioResolver {
  constructor(private readonly audioService: AudioService) {}

  // Accept a Promise<FileUpload> and await it (required by graphql-upload)
  @Mutation(() => String)
  async uploadAudio(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: Promise<FileUpload>,
    @Args('lessonId', { type: () => Int, nullable: true }) lessonId?: number,
  ): Promise<string> {
    const upload = await file;
    const buffer = await fileToBuffer(upload);

    // Create a minimal Multer-like object with the fields AudioService expects
    const multerLike: Pick<
      Express.Multer.File,
      'buffer' | 'originalname' | 'mimetype'
    > = {
      buffer,
      originalname: upload.filename,
      mimetype: upload.mimetype,
    };

    const audio = await this.audioService.uploadAudio(
      multerLike as unknown as Express.Multer.File,
      lessonId,
    );

    return audio.url;
  }

  @Query(() => String)
  async getAudioUrl(@Args('id') id: string): Promise<string> {
    return this.audioService.getAudioUrl(id);
  }
}

// Convert an incoming GraphQL upload stream to a Buffer
async function fileToBuffer(upload: FileUpload): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = upload.createReadStream();

    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}