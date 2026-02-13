import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async executeSeed() {
    await this.deleteTables();
    await this.recreateDB();
    return 'This action executes the seed process';
  }

  private async recreateDB() {
    await this.insertUsers();
    await this.insertProducts();
  }

  async deleteTables() {
    await this.productsService.deleteAllProducts();
    await this.userRepository.createQueryBuilder('user')
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const users = initialData.users;
    const insertPromises = users.map(user =>
      this.userRepository.save(this.userRepository.create(user))
    );
    await Promise.all(insertPromises);
  }

  private async insertProducts() {
    // clear db
    await this.productsService.deleteAllProducts();

    // insert new seed data
    const products = initialData.products;
    const users = await this.userRepository.find();
    const insertPromises =
      products.map(product => {
        const randomCreatorUser = users[Math.floor(Math.random() * users.length)];
        return this.productsService.create(product, randomCreatorUser as User)
      });
    await Promise.all(insertPromises);
  }




}
