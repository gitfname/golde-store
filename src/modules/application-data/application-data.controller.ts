import { Controller, Post, Get, Body, UseGuards } from "@nestjs/common"
import { ApplicationDataService } from "./application-data.service";
import { CreateApplicationDataDto } from "./dto";
import { AuthGuard, RoleGuard } from "src/common/guards";
import { Roles } from "src/common/rbac/roles.decorator";
import { ERoles } from "src/common/rbac/user-roles.enum";
import { ApplicationDataSerializer } from "./serializer/application-data.serializer";
import { plainToInstance } from "class-transformer";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("application-data")
@ApiTags("Application Data")
export class ApplicationDataController {

    constructor(
        private readonly applicationDataService: ApplicationDataService
    ) { }

    @Post()
    @Roles(ERoles.SuperAdmin, ERoles.Admin)
    @UseGuards(AuthGuard, RoleGuard)
    @ApiOperation({ summary: "upsert application data" })
    @ApiBearerAuth()
    async upsert(@Body() createApplicationDataDto: CreateApplicationDataDto): Promise<void> {
        await this.applicationDataService.upsert(createApplicationDataDto)
    }

    @Get()
    @ApiOperation({ summary: "get application data" })
    @ApiOkResponse({ status: "2XX", type: ApplicationDataSerializer })
    async findApplicationData(): Promise<ApplicationDataSerializer> {
        return plainToInstance(
            ApplicationDataSerializer,
            await this.applicationDataService.findApplicationData()
        )
    }

}