import { ProfileMap } from "../../users/mappers/ProfileMap";
import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      sender_id,
      sender,
      recipient_id,
      recipient,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        amount: Number(amount),
        sender_id,
        sender: sender ? ProfileMap.toBalance(sender): null,
        recipient_id,
        recipient: recipient ? ProfileMap.toBalance(recipient): null,
        description,
        type,
        created_at,
        updated_at
      }
    ));

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
