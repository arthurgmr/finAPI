import { ProfileMap } from "../../users/mappers/ProfileMap";
import { Statement } from "../entities/Statement";

export class StatementMap {
  static toDTO({
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
  }: Statement) {
    return {
      id,
      sender_id,
      sender: sender ? ProfileMap.toBalance(sender): null,
      recipient_id,
      recipient: recipient ? ProfileMap.toBalance(recipient): null,
      amount,
      description,
      type,
      created_at,
      updated_at
    }
  }
}
