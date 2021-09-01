import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;


describe("Show Profile User", () => {
    beforeEach(() => {
        userRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
    });

    it("Should be able to show profile user", async () => {
        const user = await createUserUseCase.execute({
            name: "User test",
            email: "test@finapi.com",
            password: "12345"
        });

        const profile = await showUserProfileUseCase.execute(user.id);

        expect(profile).toHaveProperty("id");
    });

    it("Should not be able to show profile with incorrect user id", () => {
        expect(async () => {
            await showUserProfileUseCase.execute("testUserIdIncorrect");
        }).rejects.toBeInstanceOf(AppError);
    });
});