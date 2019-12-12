import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import {UsersRepository} from '../../repository/users/Users.repository';
import { User } from '../../models/user/user.model'
import TYPES from '../../types/types';
import { IRegisterUser, ILoginUser } from '../../interfaces/user/user.interface'
import { generateToken } from '../../shared/helpers/jwt/generateToken'


export interface UsersService {
    getUsers():  Promise<User[]>;
    registerUser(user: IRegisterUser): Promise<User>;
    loginUser(user: ILoginUser): Promise<{token: string}>
}

@injectable()
export class UsersServiceImp implements UsersService {

    private UsersRepository: UsersRepository

    constructor(@inject(TYPES.UsersRepository) UsersRepository: UsersRepository) {
        this.UsersRepository = UsersRepository;
    }

    public async getUsers(): Promise<User[]> {

        const users: User[] = await this.UsersRepository.findAll().then((users) => {
            return users
        }).catch((err) => {
            throw({type: "USER_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return users;
    }

    public async registerUser(user: IRegisterUser): Promise<User> {

        // Check if user already exists with this username
        const username = await this.UsersRepository.findOne({is_active: true, username: user.username}).then((user) => {
            return user
        });
        if(username) {
            throw({type: "USER_SERVICE_ERROR", value: `username: ${user.username} already exists!`, statusCode: 400})
        }

        // Check if user already exists with this email
        const email = await this.UsersRepository.findOne({is_active: true, email: user.email}).then((user) => {
            return user
        });
        if(email) {
            throw({type: "USER_SERVICE_ERROR", value: `email: ${user.email} already exists!`, statusCode: 400})
        }

        // register User
        const registerUser:User = await this.UsersRepository.createOne(user).then((user: User) => {
            return user
        }).catch((err) => {
            throw({type: "USER_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return registerUser
    }

    public async loginUser(user: ILoginUser): Promise<{token: string}> {
        // check if username & password is correct
        const correct = await this.UsersRepository.findOne({username: user.username, password: user.password, is_active: true}).then((user) => {
            if(user === null) {
                throw('Username or password is not correct')
            } else { return user }
        }).catch((err) => {
            throw({type: "USER_SERVICE_ERROR", value: err, statusCode: 400})
        })

        console.log(correct)

        // generate token
        const token = await generateToken(correct.id)

        // return token
        return { token: token }
    }

}