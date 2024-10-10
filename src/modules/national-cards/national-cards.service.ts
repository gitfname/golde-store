import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { FindOptionsWhere, Repository } from "typeorm"
import { NationalCard } from "./national-cards.entity"
import { CreateNationalCardDto, FindAllQueryDto, UpdateNationalCardDto } from "./dto"
import { UserService } from "src/common/users"
import { ENationalCardStatus } from "./national-cards.enum"
import { PagingDto } from "src/common/nestjs-typeorm-query/paging"
import { S3Service } from "src/common/lib"
import getFileExtension from "src/helpers/getFileExtension"

@Injectable()
export class NationalCardService {

    constructor(
        @InjectRepository(NationalCard) private readonly nationalCardsRepository: Repository<NationalCard>,
        private readonly usersService: UserService,
        private readonly s3Service: S3Service
    ) { }

    async create(userId: number, createNationalCardDto: CreateNationalCardDto): Promise<void> {
        const user = await this.usersService.findOneByID(userId)

        const currentUserRecords = await this.nationalCardsRepository.findBy({
            user: {
                id: user.id
            }
        })

        const hasAnPendingRequest = currentUserRecords.findIndex(card => card.status === ENationalCardStatus.Pending)

        if (hasAnPendingRequest !== -1) {
            throw new BadRequestException("you have to wait until an admin accepts you're previous request")
        }

        const hasAnAccepted = currentUserRecords.findIndex(card => card.status === ENationalCardStatus.Accepted)

        if (hasAnAccepted !== -1) {
            throw new BadRequestException("you can only have one card")
        }

        // upload the images to s3 storage
        const frontImageKey = crypto.randomUUID() + "." + getFileExtension(createNationalCardDto.frontImage.originalName)
        try {
            await this.s3Service.uploadFile(
                createNationalCardDto.frontImage,
                "poor-bucket",
                frontImageKey
            )
        } catch (error) {
            console.log("----------- Failed to upload frontImage ------------")
            console.log(error)
            console.log()
            throw new InternalServerErrorException("failed to upload frontImage")
        }

        const backImageKey = crypto.randomUUID() + "." + getFileExtension(createNationalCardDto.backImage.originalName)
        try {
            await this.s3Service.uploadFile(
                createNationalCardDto.backImage,
                "poor-bucket",
                backImageKey
            )
        } catch (error) {
            console.log("----------- Failed to upload backImage ------------")
            console.log(error)
            console.log()
            throw new InternalServerErrorException("failed to upload backImage")
        }

        const nationalCard = this.nationalCardsRepository.create({
            frontImage: frontImageKey,
            backImage: backImageKey,
            user
        })

        nationalCard.status = ENationalCardStatus.Pending

        await this.nationalCardsRepository.save(nationalCard)
    }

    async findAll(
        pagingDto: PagingDto,
        findAllQueryDto: FindAllQueryDto
    ): Promise<NationalCard[]> {
        const where: FindOptionsWhere<NationalCard> = {
            user: {
                id: typeof findAllQueryDto?.userId === "number" ? findAllQueryDto.userId : undefined
            },
            status: findAllQueryDto?.status ?? undefined
        }

        return this.nationalCardsRepository.find({
            where,
            take: pagingDto.limit,
            skip: pagingDto.offset,
            relations: {
                user: true
            }
        })
    }

    async findOneById(id: number): Promise<NationalCard> {
        const nationalCard = await this.nationalCardsRepository.findOneBy({ id })
        if (!nationalCard) throw new NotFoundException("card not found")
        return nationalCard
    }

    async findOneByUserId(userId: number): Promise<NationalCard> {
        const nationalCard = await this.nationalCardsRepository.findOne({ where: { user: { id: userId } }, relations: { user: true } })
        if (!nationalCard) throw new NotFoundException("card not found")
        return nationalCard
    }

    async updateOneById(id: number, updateNationalCardDto: UpdateNationalCardDto): Promise<void> {
        const updated = await this.nationalCardsRepository.update({ id }, updateNationalCardDto)
        if (updated.affected === 0) throw new NotFoundException("card not found")
    }

    async removeOneById(id: number): Promise<void> {
        const deleted = await this.nationalCardsRepository.delete({ id })
        if (deleted.affected === 0) throw new NotFoundException("card not found")
    }

}