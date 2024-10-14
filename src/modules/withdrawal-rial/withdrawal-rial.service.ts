
import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { WithdrawalRial } from "./withdrawal-rial.entity";
import { CreateWithdrawalRialDto, FindAllQueryDto, UpdateWithdrawalRialDto } from "./dto";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { UserService } from "src/common/users";
import { BankAccountsService } from "../bank-accounts/bank-accounts.service";
import { EWithdrawalRialStatus } from "./withdrawal-rial.enum";

@Injectable()
export class WithdrawalRialService {

    constructor(
        @InjectRepository(WithdrawalRial) private readonly withdrawalRialRepository: Repository<WithdrawalRial>,
        private readonly usersService: UserService,
        private readonly bankAccountsService: BankAccountsService
    ) { }

    async create(userId: number, createWithdrawalRialDto: CreateWithdrawalRialDto): Promise<void> {
        const user = await this.usersService.findOneByID(userId)

        if (!user.isDetailsAccepted) {
            throw new BadRequestException("user details is not accepted yet")
        }

        if (user.rial < createWithdrawalRialDto.withdrawalAmount) {
            throw new BadRequestException("insufficient balance")
        }

        const bankAccount = await this.bankAccountsService.findOneById(createWithdrawalRialDto.bankAccount)

        if (bankAccount.user.id !== user.id) {
            throw new NotFoundException("bank-account not found")
        }

        const withdrawalRial = this.withdrawalRialRepository.create({
            withdrawalAmount: createWithdrawalRialDto.withdrawalAmount,
            status: EWithdrawalRialStatus.Pending,
            user,
            bankAccount
        })

        try {
            await this.withdrawalRialRepository.save(withdrawalRial)
        } catch (error) {
            throw new InternalServerErrorException("something went wrong while saving withdrawal-rial transaction")
        }

        try {
            await this.usersService.updateOne(userId, {
                rial: user.rial - createWithdrawalRialDto.withdrawalAmount
            })
        } catch (error) {
            await this.withdrawalRialRepository.delete(withdrawalRial)
            throw new InternalServerErrorException("something went wrong while decreasing user rial amount")
        }
    }

    async findAll(pagingDto: PagingDto, findAllQueryDto?: FindAllQueryDto): Promise<[WithdrawalRial[], number]> {
        const where: FindOptionsWhere<WithdrawalRial> = {
            user: {
                id: findAllQueryDto?.userId ?? undefined
            },
            status: findAllQueryDto?.status ?? undefined
        }

        return await this.withdrawalRialRepository.findAndCount({
            where,
            skip: pagingDto.offset,
            take: pagingDto.limit,
            relations: { user: true, bankAccount: true }
        })
    }

    async findOne(id: number): Promise<WithdrawalRial> {
        const withdrawalRial = await this.withdrawalRialRepository.findOne({ where: { id }, relations: { user: true, bankAccount: true } })
        if (!withdrawalRial) throw new NotFoundException("NOT_FOUND")
        return withdrawalRial
    }

    async update(id: number, updateWithdrawalRialDto: UpdateWithdrawalRialDto): Promise<void> {
        const transaction = await this.findOne(id)

        const withdrawalRial = await this.withdrawalRialRepository.update(id, updateWithdrawalRialDto)
        if (withdrawalRial.affected === 0) throw new BadRequestException("FAILED_TO_UPDATE")

        if (
            updateWithdrawalRialDto.status === EWithdrawalRialStatus.Rejected
            &&
            (
                transaction.status === EWithdrawalRialStatus.Pending
                ||
                transaction.status === EWithdrawalRialStatus.Accepted
            )
        ) {
            await this.usersService.updateOne(transaction.user.id, {
                rial: transaction.user.rial + transaction.withdrawalAmount
            })
        }
        else if (
            updateWithdrawalRialDto.status === EWithdrawalRialStatus.Pending
            &&
            (
                transaction.status === EWithdrawalRialStatus.Rejected
                ||
                transaction.status === EWithdrawalRialStatus.Accepted
            )
        ) {
            await this.usersService.updateOne(transaction.user.id, {
                rial: transaction.user.rial - transaction.withdrawalAmount
            })
        }
        else if (
            updateWithdrawalRialDto.status === EWithdrawalRialStatus.Accepted
            &&
            transaction.status === EWithdrawalRialStatus.Rejected
        ) {
            await this.usersService.updateOne(transaction.user.id, {
                rial: transaction.user.rial - transaction.withdrawalAmount
            })
        }
    }

    async delete(id: number): Promise<void> {
        const transaction = await this.findOne(id)

        if (transaction.status === EWithdrawalRialStatus.Pending) {
            await this.usersService.updateOne(transaction.user.id, {
                rial: transaction.user.rial + transaction.withdrawalAmount
            })
        }

        const withdrawalRial = await this.withdrawalRialRepository.delete(id)

        if (withdrawalRial.affected === 0) {
            if (transaction.status === EWithdrawalRialStatus.Pending) {
                await this.usersService.updateOne(transaction.user.id, {
                    rial: transaction.user.rial - transaction.withdrawalAmount
                })
            }

            throw new BadRequestException("FAILED_TO_DELETE")
        }
    }

}