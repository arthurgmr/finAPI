import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

let user: User;

describe("Get Statement Operation", () => {

    beforeEach(async () => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);

        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory);

        getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementsRepositoryInMemory);

        user = await createUserUseCase.execute({
          name: "User test",
          email: "test@finapi.com",
          password: "12345"
        });
    });

    it("Should be able to show a statement operation", async () => {

      const statementOperation = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "Test Deposit1",
      });

      const getStatementOperation = await getStatementOperationUseCase.execute({user_id: user.id, statement_id: statementOperation.id});

      expect(getStatementOperation).toHaveProperty("id");
      expect(getStatementOperation).toEqual(statementOperation);
    });

    it("Should not be able to show a statement operation whit invalid user", async () => {

      expect(async () => {
        const statementOperation = await createStatementUseCase.execute({
          user_id: user.id,
          type: OperationType.DEPOSIT,
          amount: 100,
          description: "Test Deposit1",
        });

        await getStatementOperationUseCase.execute({user_id: "invalidUserId", statement_id: statementOperation.id});

      }).rejects.toBeInstanceOf(AppError);

    });

    it("Should not be able to show a statement operation whit invalid id", async () => {

      expect(async () => {
        await createStatementUseCase.execute({
          user_id: user.id,
          type: OperationType.DEPOSIT,
          amount: 100,
          description: "Test Deposit1",
        });

        await getStatementOperationUseCase.execute({user_id: user.id, statement_id: "InvalidStatementOperationId"});

      }).rejects.toBeInstanceOf(AppError);

    });
});
