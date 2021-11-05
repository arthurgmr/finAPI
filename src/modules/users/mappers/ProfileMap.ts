import { User } from "../infra/entities/User";

export class ProfileMap {
  static toDTO({ id, name, email, created_at, updated_at }: User) {
    return {
      id,
      name,
      email,
      created_at,
      updated_at
    }
  }

  static toBalance({id, name, email, password, created_at, updated_at}: User) {
    return {
      name,
      email
    }
  }
}
