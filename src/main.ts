import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Add this line — enables multipart file uploads for GraphQL
  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 1 }));

  await app.listen(3000);
  console.log(`🚀 Server running at http://localhost:3000/graphql`);
}
bootstrap();
