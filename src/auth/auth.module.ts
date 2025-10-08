import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: '7d' },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
