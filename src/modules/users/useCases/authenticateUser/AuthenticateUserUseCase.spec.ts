import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;


describe("Authenticate User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    });

    it("Should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "User test",
            email: "test@finapi.com",
            password: "12345"
        }
        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });
        
        expect(result).toHaveProperty("token")
    });

    it("Should not be able to authenticate an user with incorrect email", () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: "User test",
                email: "test@finapi.com",
                password: "12345"
            }
            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: "emailnotregistered@finapi.com",
                password: user.password,
            });

        }).rejects.toBeInstanceOf(AppError);
    });

    it("Should not be able to authenticate an user with incorrect password", () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                name: "User test",
                email: "test@finapi.com",
                password: "12345"
            }
            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "incorrectPassword",
            });

        }).rejects.toBeInstanceOf(AppError);
    });
});