import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto, FindAllQueryDto, UpdateProductDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';
import { And, Or, FindOptionsWhere, Repository, MoreThanOrEqual, LessThanOrEqual, Equal, Like } from 'typeorm';
import { S3Service } from 'src/common/lib';
import getFileExtension from 'src/helpers/getFileExtension';
import { PagingDto } from 'src/common/nestjs-typeorm-query/paging';
import { TypeOrmQueryService } from "@ptc-org/nestjs-query-typeorm"

@Injectable()
export class ProductsService extends TypeOrmQueryService<Products> {

  constructor(
    @InjectRepository(Products) private readonly productsRepository: Repository<Products>,
    private readonly s3Service: S3Service
  ) {
    super(productsRepository)
  }

  async create(createProductDto: CreateProductDto): Promise<void> {
    const thumbnailImageKey = crypto.randomUUID() + "." + getFileExtension(createProductDto.thumbnailImage.originalName)
    const coverImageKey = crypto.randomUUID() + "." + getFileExtension(createProductDto.coverImage.originalName)

    // upload the thumbnail image tp s3 storage
    try {
      await this.s3Service.uploadFile(createProductDto.thumbnailImage, "poor-bucket", "products/thumbnail-images/" + thumbnailImageKey)
    } catch (error) {
      console.log("failed to upload the thumbnail image")
      console.log(error)
      throw new InternalServerErrorException("failed to upload the thumbnail image")
    }

    // upload the cover image tp s3 storage
    try {
      await this.s3Service.uploadFile(createProductDto.coverImage, "poor-bucket", "products/cover-images/" + coverImageKey)
    } catch (error) {
      console.log("failed to upload the cover image")
      console.log(error)
      throw new InternalServerErrorException("failed to upload the cover image")
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      amountOfGoldUsed: createProductDto.amountOfGoldUsed.toFixed(4),
      thumbnailImage: thumbnailImageKey,
      coverImage: coverImageKey
    })

    await this.productsRepository.save(product)
  }

  async findAll(pagingDto: PagingDto, findAllQueryDto?: FindAllQueryDto): Promise<[Products[], number]> {
    const where: FindOptionsWhere<Products> = {
      title: typeof findAllQueryDto?.title !== "undefined"
        ? Like("%" + findAllQueryDto.title + "%")
        : undefined,

      fee: typeof findAllQueryDto?.minFee !== "undefined" && typeof findAllQueryDto?.maxFee !== "undefined"
        ? And(MoreThanOrEqual(findAllQueryDto.minFee), LessThanOrEqual(findAllQueryDto.maxPrice))
        :
        typeof findAllQueryDto?.minFee !== "undefined"
          ?
          MoreThanOrEqual(findAllQueryDto.minFee)
          :
          typeof findAllQueryDto?.maxFee !== "undefined"
            ?
            LessThanOrEqual(findAllQueryDto.maxFee) : undefined,

      amountOfGoldUsed: typeof findAllQueryDto?.minUsedGoldGrams !== "undefined" && typeof findAllQueryDto?.maxUsedGoldGrams !== "undefined"
        ? And(MoreThanOrEqual(findAllQueryDto.minUsedGoldGrams), LessThanOrEqual(findAllQueryDto.maxUsedGoldGrams))
        :
        typeof findAllQueryDto?.minUsedGoldGrams !== "undefined"
          ?
          MoreThanOrEqual(findAllQueryDto.minUsedGoldGrams)
          :
          typeof findAllQueryDto?.maxUsedGoldGrams !== "undefined"
            ?
            LessThanOrEqual(findAllQueryDto.maxUsedGoldGrams) : undefined,

      isActive: typeof findAllQueryDto?.isActive === "boolean"
        ? Equal(findAllQueryDto.isActive)
        : undefined,

      isAvailable: typeof findAllQueryDto?.isAvailable === "boolean"
        ? Equal(findAllQueryDto.isAvailable)
        : undefined
    }

    return this.productsRepository.findAndCount({
      where,
      take: pagingDto.limit,
      skip: pagingDto.offset
    })
  }

  async findOne(id: number): Promise<Products> {
    const product = await this.productsRepository.findOneBy({ id })
    if (!product) throw new NotFoundException("product not found")
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<void> {
    const oldProduct = await this.findOne(id)

    if (updateProductDto.coverImage || updateProductDto.thumbnailImage) {
      const newThumbnailImageKey = updateProductDto.thumbnailImage ? crypto.randomUUID() + "." + getFileExtension(updateProductDto.thumbnailImage.originalName) : undefined
      const newCoverImageKey = updateProductDto.coverImage ? crypto.randomUUID() + "." + getFileExtension(updateProductDto.coverImage.originalName) : undefined

      // delete thumbnail image
      if (typeof newThumbnailImageKey !== "undefined") {
        try {
          await this.s3Service.deleteFile("poor-bucket", "products/thumbnail-images/" + oldProduct.thumbnailImage)
        } catch (error) {
          console.error("failed to update the thumbnailImage")
          console.log(error)
          throw new InternalServerErrorException("failed to update thumbnailImage")
        }
      }

      // delete cover image
      if (typeof newCoverImageKey !== "undefined") {
        try {
          await this.s3Service.deleteFile("poor-bucket", "products/cover-images/" + oldProduct.coverImage)
        } catch (error) {
          console.error("failed to update the coverImage")
          console.log(error)
          throw new InternalServerErrorException("failed to update coverImage")
        }
      }


      // upload the thumbnail image tp s3 storage
      if (typeof newThumbnailImageKey !== "undefined") {
        try {
          await this.s3Service.uploadFile(updateProductDto.thumbnailImage, "poor-bucket", "products/thumbnail-images/" + newThumbnailImageKey)
        } catch (error) {
          console.log("failed to upload the thumbnail image")
          console.log(error)
          throw new InternalServerErrorException("failed to upload the thumbnail image")
        }
      }

      // upload the cover image tp s3 storage
      if (typeof newCoverImageKey !== "undefined") {
        try {
          await this.s3Service.uploadFile(updateProductDto.coverImage, "poor-bucket", "products/cover-images/" + newCoverImageKey)
        } catch (error) {
          console.log("failed to upload the cover image")
          console.log(error)
          throw new InternalServerErrorException("failed to upload the cover image")
        }
      }

      const updatedProduct = await this.productsRepository.update({ id }, {
        ...updateProductDto,
        thumbnailImage: newThumbnailImageKey,
        coverImage: newCoverImageKey
      })

      if (updatedProduct.affected === 0) throw new NotFoundException("failed to update product")
    }
    else {
      const { coverImage, thumbnailImage, ...restUpdateProductDto } = updateProductDto
      const updatedProduct = await this.productsRepository.update({ id }, restUpdateProductDto)
      if (updatedProduct.affected === 0) throw new NotFoundException("product not found")
    }
  }

  async remove(id: number): Promise<void> {
    const deletedProduct = await this.productsRepository.delete({ id })
    if (deletedProduct.affected === 0) throw new NotFoundException("product not found")
  }
}
