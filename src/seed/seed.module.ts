import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ProductsModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }
