import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { BankAccounts } from "./bank-accounts.entity";
import { UserService } from "src/common/users";
import { CreateBankAccountDto, UpdateBankAccountDto } from "./dto";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { FindAllQueryDto } from "../national-cards/dto";

@Injectable()
export class BankAccountsService {

    constructor(
        @InjectRepository(BankAccounts) private readonly bankAccountsRepository: Repository<BankAccounts>,
        private readonly usersService: UserService
    ) { }

    async create(userId: number, createBankAccountDto: CreateBankAccountDto): Promise<void> {
        const user = await this.usersService.findOneByID(userId)

        if (!user.isDetailsAccepted) {
            throw new BadRequestException("user details is not accepted yet")
        }

        const bankAccount = this.bankAccountsRepository.create({
            ...createBankAccountDto,
            user
        })

        await this.bankAccountsRepository.save(bankAccount)
    }

    async findAll(pagingDto: PagingDto, findAllQueryDto: FindAllQueryDto): Promise<BankAccounts[]> {
        const where: FindOptionsWhere<BankAccounts> = {
            user: {
                id: findAllQueryDto?.userId ?? undefined
            }
        }
        return this.bankAccountsRepository.find({
            where,
            take: pagingDto.limit,
            skip: pagingDto.offset
        })
    }

    async findOneById(id: number): Promise<BankAccounts> {
        const bankAccount = await this.bankAccountsRepository.findOne({
            where: { id },
            relations: {
                user: true
            }
        })
        if (!bankAccount) throw new NotFoundException("bank-account not found")
        return bankAccount
    }

    async updateOneById(id: number, updateBankAccountDto: UpdateBankAccountDto): Promise<void> {
        const updated = await this.bankAccountsRepository.update({ id }, updateBankAccountDto)
        if (updated.affected === 0) throw new NotFoundException("bank-account not found")
    }

    async deleteOneById(id: number): Promise<void> {
        const deleted = await this.bankAccountsRepository.delete({ id })
        if (deleted.affected === 0) throw new NotFoundException("bank-account not found")
    }

}