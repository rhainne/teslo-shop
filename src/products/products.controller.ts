import {
  Controller, Get, Post, Body, Patch,
  Param, Delete, Query, ParseUUIDPipe,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRole } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/auth/entities/user.entity';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Product } from './entities';


@Controller('products')
@ApiBearerAuth()
@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
    type: Product,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiQuery({
    name: 'term',
    description: 'The term to search for. Can be a UUID title or slug.',
    example: 'scribble_t_logo_onesie',
  })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRole.superUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
