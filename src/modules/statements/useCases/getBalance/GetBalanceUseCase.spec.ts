import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/infra/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

let getBalanceUseCase: GetBalanceUseCase;

let user: User;

describe("Get User Balance", () => {

    beforeEach(async () => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory);

        getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, userRepositoryInMemory);

        user = await createUserUseCase.execute({
          name: "User test",
          email: "test@finapi.com",
          password: "12345"
        });
    });

    it("Should be able to show a user balance", async () => {

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Test Deposit1",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 300,
        description: "Test Deposit2",
      });

      await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 200,
        description: "Test Withdraw1",
      });

      const getBalance = await getBalanceUseCase.execute({ user_id: user.id });

      expect(getBalance).toHaveProperty("balance");
      expect(getBalance.balance).toEqual(200);
    });

    it("Should not be able to show a balance whit invalid user", async () => {

      expect(async () => {
        await createStatementUseCase.execute({
          user_id: user.id,
          type: OperationType.DEPOSIT,
          amount: 100,
          description: "Test Deposit1",
        });

        await createStatementUseCase.execute({
          user_id: user.id,
          type: OperationType.DEPOSIT,
          amount: 300,
          description: "Test Deposit2",
        });

        await getBalanceUseCase.execute({ user_id: "invalidUserId" });
      }).rejects.toBeInstanceOf(AppError);

    });
});
