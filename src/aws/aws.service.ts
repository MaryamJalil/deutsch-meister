// import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { DatabaseService } from 'src/database/database.service';

// @Injectable()
// export class AwsService {
//   constructor(
//     private prisma: DatabaseService,
//     private config: ConfigService,
//   ) {}

//   bucketName = this.config.getOrThrow('AWS_BUCKET_NAME');

//   region = this.config.getOrThrow('AWS_S3_REGION');

//   s3Client = new S3({
//     region: this.region,
//     credentials: {
//       accessKeyId: this.config.getOrThrow('AWS_ACCESS_KEY_ID'),
//       secretAccessKey: this.config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
//     },
//   });

//   async uploadProfilePhoto(userId: string, fileName: string, file: Buffer) {
//     const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
//     try {
//       await this.s3Client.send(
//         new PutObjectCommand({
//           Bucket: this.bucketName,
//           Key: fileName,
//           Body: file,
//           ACL: 'public-read',
//         }),
//       );

//       await this.prisma.user.update({
//         where: { id: userId },
//         data: {
//           avatar: fileUrl,
//         },
//       });

//       return { message: 'User profile avatar updated' };
//     } catch (error) {
//       console.log(error);
//       throw new Error('Error uploading file');
//     }
//   }
// }