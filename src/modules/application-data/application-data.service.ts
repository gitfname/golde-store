import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ApplicationData } from "./application-data.entity"
import { CreateApplicationDataDto } from "./dto"

@Injectable()
export class ApplicationDataService {

    constructor(
        @InjectRepository(ApplicationData) private readonly applicationDataRepository: Repository<ApplicationData>
    ) { }

    async upsert(createApplicationDataDto: CreateApplicationDataDto): Promise<ApplicationData> {
        const applicationData = await this.findApplicationData()

        applicationData.rialToGoldConversionRate = createApplicationDataDto.rialToGoldConversionRate

        await this.applicationDataRepository.save(applicationData)

        return applicationData
    }

    async findApplicationData(): Promise<ApplicationData> {
        const applicationData = (await this.applicationDataRepository.find())?.[0]

        if (!applicationData) {
            const createdApplicationData = this.applicationDataRepository.create({ rialToGoldConversionRate: 500_000 })
            await this.applicationDataRepository.save(createdApplicationData)
            return createdApplicationData
        }

        return applicationData
    }

}