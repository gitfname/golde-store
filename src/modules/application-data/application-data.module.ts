import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationData } from "./application-data.entity";
import { UserModule } from "src/common/users";
import { ApplicationDataService } from "./application-data.service";
import { ApplicationDataController } from "./application-data.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([ApplicationData]),
        UserModule
    ],
    providers: [ApplicationDataService],
    controllers: [ApplicationDataController],
    exports: [ApplicationDataService]
})
export class ApplicationDataModule { }