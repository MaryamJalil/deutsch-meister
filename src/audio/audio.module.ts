import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioResolver } from './audio.resolver';

@Module({
  providers: [AudioResolver, AudioService],
})
export class AudioModule {}
