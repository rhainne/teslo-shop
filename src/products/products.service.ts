import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product, ProductImage } from './entities';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as idUUID } from 'uuid';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  private defaultLimit: number;

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit', 7);
  }

  async create(
    createProductDto: CreateProductDto,
    user: User
  ) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productsRepository.create({
        ...productDetails,
        images: images
          .map(image => this.productImagesRepository
            .create({ url: image })),
        user, // Associate the product with the user who created it
      });
      await this.productsRepository.save(product);

      return { ...product, images };

    } catch (error) {
      this.handleException(error, 'create product method');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const products = await this.productsRepository.find({
        take: paginationDto.limit || this.defaultLimit,
        skip: paginationDto.offset || 0,
        relations: {
          images: true,
        },
      });

      return products.map(({ images, ...allAttributes }) => ({
        ...allAttributes,
        images: images!.map(image => image.url),
      }));

    } catch (error) {
      this.handleException(error, 'findAll method');
    }
  }

  async findOne(term: string) {
    let product: Product | null = null;

    if (idUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder('prod'); // 'prod' is alias for the Product entity, used to reference it in the query
      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages') // field where the relation is defined, alias for the joined table
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Product with search term "${term}" not found`);

    return product;
  }


  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map(image => image.url),
    };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user,
  ) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productsRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id "${id}" not found`);

    // Create query runner to manage transactions
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images && images.length > 0) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image =>
          this.productImagesRepository.create({ url: image })
        );
      }

      product.user = user; // Update the user who made the change

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleException(error, 'update product method');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);

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

  // this method is used in the seed service to clear the products table before seeding new data
  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product');
    try {
      return await query
        .delete()
        .where({})
        .execute();

      // return await this.dataSource.query(`TRUNCATE TABLE "products" RESTART IDENTITY CASCADE;`);

    } catch (error) {
      this.handleException(error, 'delete all products method');
    }
  }
}
