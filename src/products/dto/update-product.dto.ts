import { PartialType } from '@nestjs/swagger'; // Change to use PartialType from @nestjs/swagger for better Swagger documentation
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) { }
