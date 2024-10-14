import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { WithdrawalPhysicalGold } from "./withdrawal-physical-gold.entity";
import { CreateWithdrawalPhysicalGoldDto, FindAllQueryDto, UpdateWithdrawalPhysicalGoldDto } from "./dto";
import { UserService } from "src/common/users";
import { BankAccountsService } from "../bank-accounts/bank-accounts.service";
import { EWithdrawalPhysicalGoldStatus } from "./withdrawal-physical-gold.enum";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";

@Injectable()
export class WithdrawalPhysicalGoldService {

    constructor(
        @InjectRepository(WithdrawalPhysicalGold) private readonly withdrawalPhysicalGoldRepository: Repository<WithdrawalPhysicalGold>,
        private readonly usersService: UserService,
        private readonly bankAccountsService: BankAccountsService
    ) { }

    async create(userId: number, createWithdrawalPhysicalGoldDto: CreateWithdrawalPhysicalGoldDto): Promise<void> {
        const user = await this.usersService.findOneByID(userId)
        const bankAccount = await this.bankAccountsService.findOneById(createWithdrawalPhysicalGoldDto.bankAccount)

        if (bankAccount.user.id !== user.id) {
            throw new NotFoundException("bank-account not found")
        }

        if (createWithdrawalPhysicalGoldDto.goldAmount >= parseFloat(user.gold)) {
            throw new BadRequestException("insufficient balance")
        }

        const isUserHasAnotherInWaitingWithdrawal = await this.withdrawalPhysicalGoldRepository.countBy({
            user: { id: user.id },
            status: EWithdrawalPhysicalGoldStatus.Pending
        })

        if (isUserHasAnotherInWaitingWithdrawal > 0) {
            throw new BadRequestException("you can't have more then 1 withdrawal requests in 'Pending' status")
        }

        await this.usersService.updateOne(user.id, {
            gold: (parseFloat(user.gold) - createWithdrawalPhysicalGoldDto.goldAmount).toFixed(4)
        })

        const withdrawal = this.withdrawalPhysicalGoldRepository.create({
            ...createWithdrawalPhysicalGoldDto,
            status: EWithdrawalPhysicalGoldStatus.Pending,
            user,
            goldAmount: createWithdrawalPhysicalGoldDto.goldAmount.toFixed(4),
            bankAccount
        })

        await this.withdrawalPhysicalGoldRepository.save(withdrawal)
    }

    async findAll(pagingDto: PagingDto, findAllQueryDto?: FindAllQueryDto): Promise<[WithdrawalPhysicalGold[], number]> {
        const where: FindOptionsWhere<WithdrawalPhysicalGold> = {
            user: {
                id: findAllQueryDto?.userId ?? undefined
            },
            status: findAllQueryDto?.status ?? undefined
        }

        return this.withdrawalPhysicalGoldRepository.findAndCount({
            where,
            take: pagingDto.limit,
            skip: pagingDto.offset,
            relations: { user: true, bankAccount: true }
        })
    }

    async findOneById(id: number): Promise<WithdrawalPhysicalGold> {
        const withdrawal = await this.withdrawalPhysicalGoldRepository.findOne({ where: { id }, relations: { user: true, bankAccount: true } })
        if (!withdrawal) throw new NotFoundException("withdrawal not found")
        return withdrawal
    }

    async updateOneById(id: number, updateWithdrawalPhysicalGoldDto: UpdateWithdrawalPhysicalGoldDto): Promise<void> {
        const withdrawal = await this.findOneById(id)

        const updatedWithdrawal = await this.withdrawalPhysicalGoldRepository.update({ id }, updateWithdrawalPhysicalGoldDto)

        if (updatedWithdrawal.affected === 0) throw new NotFoundException("withdrawal not found")

        if (
            updateWithdrawalPhysicalGoldDto.status === EWithdrawalPhysicalGoldStatus.Rejected
            &&
            (
                withdrawal.status === EWithdrawalPhysicalGoldStatus.Accepted
                ||
                withdrawal.status === EWithdrawalPhysicalGoldStatus.Pending
            )

        ) {
            await this.usersService.updateOne(withdrawal.user.id, {
                gold: (parseFloat(withdrawal.user.gold) + parseFloat(withdrawal.goldAmount)).toFixed(4)
            })
        }
        else if (
            updateWithdrawalPhysicalGoldDto.status === EWithdrawalPhysicalGoldStatus.Accepted
            &&
            withdrawal.status === EWithdrawalPhysicalGoldStatus.Rejected
        ) {
            if ((parseFloat(withdrawal.user.gold) - parseFloat(withdrawal.goldAmount)) < 0) {
                throw new BadRequestException("user balance is insufficient")
            }

            await this.usersService.updateOne(withdrawal.user.id, {
                gold: (parseFloat(withdrawal.user.gold) - parseFloat(withdrawal.goldAmount)).toFixed(4)
            })
        }
        else if (
            updateWithdrawalPhysicalGoldDto.status === EWithdrawalPhysicalGoldStatus.Pending
            &&
            (
                withdrawal.status === EWithdrawalPhysicalGoldStatus.Rejected
                ||
                withdrawal.status === EWithdrawalPhysicalGoldStatus.Accepted
            )
        ) {
            if ((parseFloat(withdrawal.user.gold) - parseFloat(withdrawal.goldAmount)) < 0) {
                throw new BadRequestException("user balance is insufficient")
            }

            await this.usersService.updateOne(withdrawal.user.id, {
                gold: (parseFloat(withdrawal.user.gold) - parseFloat(withdrawal.goldAmount)).toFixed(4)
            })
        }
    }

    async deleteOneById(id: number): Promise<void> {
        const withdrawal = await this.findOneById(id)

        const deletedWithdrawal = await this.withdrawalPhysicalGoldRepository.delete({ id })
        if (deletedWithdrawal.affected === 0) throw new NotFoundException("withdrawal not found")

        if (withdrawal.status === EWithdrawalPhysicalGoldStatus.Accepted) {
            await this.usersService.updateOne(withdrawal.user.id, {
                gold: (parseFloat(withdrawal.user.gold) + parseFloat(withdrawal.goldAmount)).toFixed(4)
            })
        }
    }

}