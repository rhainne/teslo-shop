import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ProductImage } from "./index";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: '123e4567-e89b-12d3-a456-426614174000',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The title of the product',
    example: 'T-Shirt Common',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 19.99,
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A comfortable and stylish t-shirt made from high-quality cotton.',
    default: null,
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    description: 'The slug of the product, used for SEO-friendly URLs',
    example: 't_shirt_common',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    description: 'The stock quantity of the product',
    example: 100,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    description: 'The sizes available for the product',
    example: ['S', 'M', 'L', 'XL'],
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    description: 'The gender category for the product',
    example: 'unisex',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    description: 'The tags associated with the product',
    example: ['t-shirt', 'cotton', 'comfortable'],
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User;

  @BeforeInsert()
  @BeforeUpdate()
  checkSlug() {
    if (!this.slug)
      this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
