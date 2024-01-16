
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ default: false })
  published: boolean = false;
}
