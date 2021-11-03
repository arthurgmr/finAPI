import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferUseCase } from './CreateTransferUseCase';


class CreateTransferController {

  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { recipient_id } = request.params;
    const { amount, description } = request.body;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const transferOperation = await createTransfer.execute({
      sender_id,
      recipient_id,
      amount,
      description
    });

    return response.status(201).json(transferOperation);
  }

}

export { CreateTransferController }
