import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { NationalCard } from "./national-cards.entity";
import { UserModule, UserService } from "src/common/users";
import { S3Service } from "src/common/lib";
import { NationalCardService } from "./national-cards.service";
import { NationalCardsController } from "./national-cards.controller";
import { NestjsFormDataModule, MemoryStoredFile } from "nestjs-form-data"

@Module({
    imports: [
        TypeOrmModule.forFeature([NationalCard]),
        UserModule,
        NestjsFormDataModule.config({
            storage: MemoryStoredFile
        }),
    ],
    providers: [S3Service, NationalCardService],
    controllers: [NationalCardsController],
    exports: [NationalCardService]
})
export class NationalCardsModule { }