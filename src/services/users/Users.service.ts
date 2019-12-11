import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import {UsersRepository} from '../../repository/users/Users.repository';
import { User } from '../../models/user/user.model'
import TYPES from '../../types/types';

import { IRegisterUser } from '../../interfaces/user/user.interface'


export interface UsersService {
    getUsers():  Promise<User[]>;
    registerUser(user: IRegisterUser): any;
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

    public async registerUser(user: IRegisterUser) {

        // Check if user already exists with this username
        const exists = await this.UsersRepository.findOne({is_active: true, username: user.username}).then((user) => {
            return user
        });
        if(exists) {
            throw({type: "USER_SERVICE_ERROR", value: `username: ${user.username} already exists!`, statusCode: 400})
        }

        // register User
        const registerUser:User = await this.UsersRepository.createOne(user).then((user: User) => {
            return user
        }).catch((err) => {
            throw({type: "USER_SERVICE_ERROR", value: err, statusCode: 400})
        })
        
        return registerUser
    }

}