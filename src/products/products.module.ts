import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
  exports: [ProductsService],
})
export class ProductsModule { }
