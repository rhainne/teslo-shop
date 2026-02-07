import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService
  ) { }

  async executeSeed() {
    await this.recreateDB();
    return 'This action executes the seed process';
  }

  private async recreateDB() {
    // clear db
    await this.productsService.deleteAllProducts();

    // insert new seed data
    const products = initialData.products;
    const insertPromises =
      products.map(product =>
        this.productsService.create(product)
      );
    await Promise.all(insertPromises);
  }


}
