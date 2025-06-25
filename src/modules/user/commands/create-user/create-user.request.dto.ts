import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../../domain/user.types';
import { IsValidName } from '@tests/utils/validators';
import { Transform } from 'class-transformer';
import { CapitalizeName } from '@tests/utils/transformers';

export class CreateUserRequestDto {
  @ApiPropertyOptional({
    example: 'john@gmail.com',
    description: 'User email address (optional if phone is provided)',
  })
  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @IsValidName()
  @Transform(CapitalizeName())
  readonly firstName: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @IsValidName()
  @Transform(CapitalizeName())
  readonly lastName: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(64)
  readonly password: string;

  @ApiProperty({
    example: UserRoles.customer,
    enum: UserRoles,
    description: 'User role',
  })
  @IsEnum(UserRoles)
  readonly role: UserRoles;
}
