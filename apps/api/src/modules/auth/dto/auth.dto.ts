import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ROLES, type Role } from '@swiftdrop/contracts';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jane@example.com' }) @IsEmail() @MaxLength(254) email: string;
  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
  @ApiProperty() @IsString() @Length(2, 100) name: string;
  @ApiPropertyOptional() @IsOptional() @Matches(/^\+?[0-9]{9,15}$/) phone?: string;
}

export class LoginDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MaxLength(128) password: string;
}

export class SessionUserDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty({ enum: ROLES }) role: Role;
}

/** Tokens are set as httpOnly cookies — never returned in the body. */
export class AuthResponseDto {
  @ApiProperty({ type: SessionUserDto }) user: SessionUserDto;
  @ApiProperty({ example: '/customer' }) home: string;
}
