import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";


@injectable()
class CreateTransferUseCase {
  constructor (
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ sender_id, recipient_id, amount, description }: ICreateTransferDTO) {
    // check sender_id
    const userSender = await this.usersRepository.findById(sender_id)

    if (!userSender) {
      throw new CreateTransferError.UserNotFound();
    }

    // check recipient_id
    const userRecipient = await this.usersRepository.findById(recipient_id)

    if (!userRecipient) {
      throw new CreateTransferError.UserDestNotFound();
    }

    // check funds of sender
    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    }

    // transfer
    const transferOperation = await this.statementsRepository.createTransfer({
      sender_id,
      recipient_id,
      amount,
      description
    });

    return transferOperation;


  }

}

export { CreateTransferUseCase }
