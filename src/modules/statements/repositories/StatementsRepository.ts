import { getRepository, Repository } from "typeorm";

import { OperationType, Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async createTransfer({ sender_id, recipient_id, amount, description }: ICreateTransferDTO): Promise<Statement[]> {
    const senderTransferOp = this.repository.create({
      user_id: sender_id,
      recipient_id,
      amount,
      description,
      type: OperationType.TRANSFER
    });

    const recipientTransferOp = this.repository.create({
      user_id: recipient_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER
    });

    await this.repository.save(senderTransferOp);
    await this.repository.save(recipientTransferOp);

    return [senderTransferOp, recipientTransferOp]
  }


  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id },
      relations: ["recipient", "sender"]
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id },
      relations: ["recipient", "sender"]
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.sender_id) {
        return acc + Number(operation.amount);
      } else {
        return acc - Number(operation.amount);
      }
    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }


}
