import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { email, password, role } = authCredentialsDto;

        // 1. Generate a "salt" and hash the password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            email,
            password_hash: hashedPassword, // Store the HASH, not the password
            role,
        });

        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.code === '23505') { // Postgres error code for Duplicate Key
                throw new ConflictException('Email already exists');
            } else {
                throw error;
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    
    // 2. Retrieve user (explicitly selecting password_hash because we hid it in Entity)
    const user = await this.userRepository.findOne({ 
        where: { email },
        select: ['id', 'email', 'password_hash', 'role'] 
    });

    // 3. Check password
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // 4. Generate Token
      const payload = { email, sub: user.id, role: user.role };
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}