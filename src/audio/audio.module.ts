import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioResolver } from './audio.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '../config/config.module';

@Module({
   imports: [ConfigModule],
  providers: [AudioResolver, AudioService,PrismaService],
})
export class AudioModule {}
