import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    });

    it("Should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "User test",
            email: "test@finapi.com",
            password: "12345"
        });

        expect(user).toHaveProperty("id");
    });

    it("Should not be able to create a new user with same email", () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "User test",
                email: "test@finapi.com",
                password: "12345"
            });

            await createUserUseCase.execute({
                name: "User test",
                email: "test@finapi.com",
                password: "12345"
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});