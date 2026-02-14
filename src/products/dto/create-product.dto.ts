import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray, IsIn, IsNumber, IsOptional,
  IsPositive, IsString, MinLength
} from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    description: 'The title of the product',
    example: 'T-Shirt Common',
    uniqueItems: true,
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 21.99,
    nullable: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A comfortable and stylish t-shirt made from high-quality cotton.',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The slug of the product, used for SEO-friendly URLs',
    example: 't_shirt_common',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
    nullable: true,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'The sizes available for the product',
    example: ['S', 'M', 'L', 'XL'],
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'The tags associated with the product',
    example: ['t-shirt', 'cotton', 'comfortable'],
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    description: 'The images of the product',
    example: ['http://example.com/image1.jpg', 'http://example.com/image2.jpg'],
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'The gender category for the product',
    example: 'unisex',
    enum: ['men', 'women', 'kid', 'unisex'],
    nullable: false,
  })
  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

}
