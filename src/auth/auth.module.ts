import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY_HERE', // In production, use env vars!
      signOptions: {
        expiresIn: 3600, // Token expires in 1 hour
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [PassportModule, AuthService], // Export so other modules can protect routes
})
export class AuthModule {}