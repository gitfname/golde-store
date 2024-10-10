import { Injectable } from "@nestjs/common/decorators/core";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactions } from "./transactions.entity";
import { UserService } from "src/common/users";
import { BankAccountsService } from "../bank-accounts/bank-accounts.service";
import { CreateTransactionDto, FindAllQueryDto, UpdateTransactionDto } from "./dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ETransactionStatus, ETransactionType } from "./transactions.enum";
import { User } from "src/common/users/user.entity";
import { MemoryStoredFile } from "nestjs-form-data"
import { S3Service } from "src/common/lib";
import getFileExtension from "src/helpers/getFileExtension";
import { PagingDto } from "src/common/nestjs-typeorm-query/paging";
import { goldToRial, moneyToGoldGrams } from "src/helpers";

@Injectable()
export class TransactionsService {

    constructor(
        @InjectRepository(Transactions) private readonly transactionsRepository: Repository<Transactions>,
        private readonly usersService: UserService,
        private readonly bankAccountsService: BankAccountsService,
        private readonly S3Service: S3Service
    ) { }

    async create(userId: number, createTransactionDto: CreateTransactionDto): Promise<void> {
        const user = await this.usersService.findOneByID(userId)

        if (!user.isDetailsAccepted) {
            throw new BadRequestException("user profile is not verified yet")
        }

        // transaction type : charge wallet
        if (createTransactionDto.transactionType === ETransactionType.ChargeWallet) {
            await this.createChargeWallet(user, createTransactionDto.bankAccount, createTransactionDto.transactionImage)
        }
        // transaction type : rial to gold
        else if (createTransactionDto.transactionType === ETransactionType.RialToGold) {
            await this.convertRialToGold(user, createTransactionDto.amount)
        }
        else if (createTransactionDto.transactionType === ETransactionType.GoldToRial) {
            await this.convertGoldToRial(user, createTransactionDto.goldAmount)
        }
        else {
            throw new BadRequestException("not yet implemented type")
        }
    }

    async createChargeWallet(user: User, bankAccountId: number, transactionImage: MemoryStoredFile) {
        const bankAccount = await this.bankAccountsService.findOneById(bankAccountId)
        const transactionImageKey = crypto.randomUUID() + "." + getFileExtension(transactionImage.originalName)

        if (bankAccount.user.id !== user.id) {
            throw new NotFoundException("bank-account not found")
        }

        const isUserHasPendingChargeWalletRecord = await this.transactionsRepository.countBy({
            user: {
                id: user.id
            },
            status: ETransactionStatus.Pending
        })

        if (isUserHasPendingChargeWalletRecord !== 0) {
            throw new BadRequestException("you have to wait until your previous pending request to be accepted or rejected")
        }

        try {
            await this.S3Service.uploadFile(transactionImage, "poor-bucket", "transactions/charge-wallet/" + transactionImageKey)
        } catch (error) {
            console.log("----------- failed to upload 'transactionImage' -----------")
            console.log(error)
            console.log("END ----------- failed to upload 'transactionImage' ----------- END")
        }

        const transaction = this.transactionsRepository.create({
            transactionType: ETransactionType.ChargeWallet,
            status: ETransactionStatus.Pending,
            user,
            bankAccount,
            transactionImage: transactionImageKey
        })

        await this.transactionsRepository.save(transaction)
    }

    async convertRialToGold(user: User, rialAmount: number) {
        const isUserHasPendingChargeWalletRecord = await this.transactionsRepository.countBy({
            user: {
                id: user.id
            },
            status: ETransactionStatus.Pending
        })

        if (isUserHasPendingChargeWalletRecord !== 0) {
            throw new BadRequestException("you have to wait until your previous pending request to be accepted or rejected")
        }

        if (user.rial < rialAmount) {
            throw new BadRequestException("your rial-wallet is not enough to be converted to gold, please charge your wallet or decrease the rial amount you want to convert to gold")
        }

        const transaction = this.transactionsRepository.create({
            transactionType: ETransactionType.RialToGold,
            status: ETransactionStatus.Accepted,
            user,
            amount: rialAmount
        })

        await this.transactionsRepository.save(transaction)

        await this.usersService.updateOne(user.id, {
            rial: user.rial - rialAmount,
            gold: (parseFloat(user.gold) + parseFloat(moneyToGoldGrams(rialAmount, 1000_000).toFixed(4))).toFixed(4)
        })
    }

    async convertGoldToRial(user: User, goldAmount: number) {
        const isUserHasPendingChargeWalletRecord = await this.transactionsRepository.countBy({
            user: {
                id: user.id
            },
            status: ETransactionStatus.Pending
        })

        if (isUserHasPendingChargeWalletRecord !== 0) {
            throw new BadRequestException("you have to wait until your previous pending request to be accepted or rejected")
        }

        if (parseFloat(user.gold) < goldAmount) {
            throw new BadRequestException("your gold-wallet is not enough to be converted to rial, please charge your wallet or decrease the gold amount you want to convert to rial")
        }

        const transaction = this.transactionsRepository.create({
            transactionType: ETransactionType.GoldToRial,
            status: ETransactionStatus.Accepted,
            user,
            goldAmount: goldAmount.toFixed(4)
        })

        await this.transactionsRepository.save(transaction)

        await this.usersService.updateOne(user.id, {
            rial: user.rial + goldToRial({
                goldAmount,
                goldToRialRate: 1000_000
            }).finalRialAmount,
            gold: (parseFloat(user.gold) - goldAmount).toFixed(4)
        })
    }

    async findAll(pagingDto: PagingDto, findAllQueryDto?: FindAllQueryDto): Promise<Transactions[]> {
        const where: FindOptionsWhere<Transactions> = {
            user: {
                id: findAllQueryDto?.userId ?? undefined
            },
            status: findAllQueryDto?.status ?? undefined
        }

        return this.transactionsRepository.find({
            where,
            take: pagingDto.limit,
            skip: pagingDto.offset,
            relations: {
                user: true,
                bankAccount: true
            }
        })
    }

    async findOneById(id: number): Promise<Transactions> {
        const transaction = await this.transactionsRepository.findOneBy({ id })
        if (!transaction) throw new NotFoundException("transaction not found")
        return transaction
    }

    async updateOneById(id: number, updateTransactionDto: UpdateTransactionDto): Promise<void> {
        const transaction = await this.transactionsRepository.findOne({
            where: { id },
            relations: { user: true }
        })

        if (transaction.transactionType === ETransactionType.ChargeWallet) {
            if (typeof updateTransactionDto.increaseRialAmount !== "number") {
                throw new BadRequestException("increaseRial must be an number")
            }
        }

        const updatedTransaction = await this.transactionsRepository.update({ id }, updateTransactionDto)
        if (updatedTransaction.affected === 0) throw new NotFoundException("failed to update transaction")

        if (transaction.transactionType === ETransactionType.ChargeWallet) {
            if (updateTransactionDto.status === ETransactionStatus.Accepted) {

                if (updateTransactionDto.status === ETransactionStatus.Accepted) {

                    await this.usersService.updateOne(transaction.user.id, {
                        rial: transaction.user.rial + updateTransactionDto.increaseRialAmount
                    })

                }

            }
            else if (updateTransactionDto.status === ETransactionStatus.Rejected && transaction.status === ETransactionStatus.Accepted) {
                await this.usersService.updateOne(transaction.user.id, {
                    rial: transaction.user.rial - updateTransactionDto.increaseRialAmount
                })
            }
        }
        else if (transaction.transactionType === ETransactionType.RialToGold) {

            if (updateTransactionDto.status === ETransactionStatus.Rejected) {
                await this.usersService.updateOne(transaction.user.id, {
                    rial: transaction.user.rial + transaction.amount,
                    gold: (parseFloat(transaction.user.gold) - parseFloat(moneyToGoldGrams(transaction.amount, 1000_000).toFixed(4))).toFixed(4)
                })
            }
            else if (updateTransactionDto.status === ETransactionStatus.Accepted && transaction.status === ETransactionStatus.Rejected) {
                await this.usersService.updateOne(transaction.user.id, {
                    rial: transaction.user.rial - transaction.amount,
                    gold: (parseFloat(transaction.user.gold) + parseFloat(moneyToGoldGrams(transaction.amount, 1000_000).toFixed(4))).toFixed(4)
                })
            }
        }
        else if (transaction.transactionType === ETransactionType.GoldToRial) {
            
            if (updateTransactionDto.status === ETransactionStatus.Rejected && transaction.status === ETransactionStatus.Accepted) {
                await this.usersService.updateOne(transaction.user.id, {
                    rial: transaction.user.rial - goldToRial({
                        goldAmount: parseFloat(transaction.goldAmount),
                        goldToRialRate: 1000_000
                    }).finalRialAmount,
                    gold: (parseFloat(transaction.user.gold) + parseFloat(transaction.goldAmount)).toFixed(4)
                })
            }
            else if (transaction.status === ETransactionStatus.Rejected && updateTransactionDto.status === ETransactionStatus.Accepted) {
                await this.usersService.updateOne(transaction.user.id, {
                    rial: transaction.user.rial + goldToRial({
                        goldAmount: parseFloat(transaction.goldAmount),
                        goldToRialRate: 1000_000
                    }).finalRialAmount,
                    gold: (parseFloat(transaction.user.gold) - parseFloat(transaction.goldAmount)).toFixed(4)
                })
            }

        }
    }

    async deleteOneById(id: number): Promise<void> {
        const deletedTransaction = await this.transactionsRepository.delete({ id })
        if (deletedTransaction.affected === 0) throw new NotFoundException("transaction not found")
    }

}