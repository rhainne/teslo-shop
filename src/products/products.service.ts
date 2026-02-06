import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  private defaultLimit: number;

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit', 7);
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);

      return product;

    } catch (error) {
      this.handleException(error, 'create product method');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      return await this.productsRepository.find({
        take: paginationDto.limit || this.defaultLimit,
        skip: paginationDto.offset || 0,
      });
    } catch (error) {
      this.handleException(error, 'findAll method');
    }
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found`);

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.delete(id);

    return { message: `Product with id ${id} has been removed` };
  }

  private handleException(error: any, message: string) {
    if (error.code === '23505') {
      this.logger.warn(`Duplicate entry: ${error.detail}`);
      throw new BadRequestException(`Duplicate entry: ${error.detail}`);
    }
    this.logger.error(message, error.stack);

    throw new InternalServerErrorException(`Unexpected error:Failed to ${message}`);
  }
}
