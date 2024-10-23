import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { UserModule } from 'src/common/users';
import { S3Service } from 'src/common/lib';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { ProductCategoriesModule } from '../product-categories/product-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products]),
    NestjsFormDataModule.config({
      storage: MemoryStoredFile
    }),
    UserModule,
    ProductCategoriesModule
  ],
  providers: [S3Service, ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService]
})
export class ProductsModule { }
