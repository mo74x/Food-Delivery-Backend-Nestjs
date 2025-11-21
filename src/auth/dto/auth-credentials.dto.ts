import { IsString, MinLength, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    email: string;

    @IsString()
    @MinLength(8,{message:'Password must be at least 8 characters long'})
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
