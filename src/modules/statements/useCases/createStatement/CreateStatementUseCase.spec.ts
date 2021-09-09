import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

let user: User;

describe("Create Statement", () => {

    beforeEach(async () => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)

        user = await createUserUseCase.execute({
          name: "User test",
          email: "test@finapi.com",
          password: "12345"
        });
    });

    it("Should be able to create a new statement of deposit", async () => {

        const statementOperationDeposit = await createStatementUseCase.execute({
            user_id: user.id,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Test Deposit",
        });

        expect(statementOperationDeposit).toHaveProperty("id");
    });

    it("Should be able to create a new statement of withdraw", async () => {

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Test Deposit",
      });

      const statementOperationWithdraw = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 50,
        description: "Test Withdraw",
      });

      expect(statementOperationWithdraw).toHaveProperty("id");

    });

    it("Should not be able to create a new statement of withdraw with insufficient funds", async () => {

      expect(async () => {
        await createStatementUseCase.execute({
          user_id: user.id,
          type: OperationType.DEPOSIT,
          amount: 100,
          description: "Test Deposit",
        });

        await createStatementUseCase.execute({
          user_id: user.id,
          type: OperationType.WITHDRAW,
          amount: 150,
          description: "Test Withdraw with insufficient funds",
        });
      }).rejects.toBeInstanceOf(AppError);

    });

    it("Should not be able to create a new statement operation with invalid user", async () => {

      expect(async () => {
        await createStatementUseCase.execute({
          user_id: "invalidUserId",
          type: OperationType.DEPOSIT,
          amount: 100,
          description: "Test Deposit",
        });
      }).rejects.toBeInstanceOf(AppError);
    });
});
