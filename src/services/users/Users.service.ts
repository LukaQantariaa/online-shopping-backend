import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import * as HttpStatus from "http-status-codes";

import {UsersRepository} from '../../repository/users/Users.repository';
import { User } from '../../models/user/user.model'
import TYPES from '../../types/types';
import { IRegisterUser, ILoginUser } from '../../interfaces/user/user.interface'
import { generateToken } from '../../shared/helpers/jwt/generateToken'


export interface UsersService {
    getUsers():  Promise<User[]>;
    registerUser(user: IRegisterUser): Promise<User>;
    loginUser(user: ILoginUser): Promise<{token: string}>
    getUser(id: number): Promise<User> 
    updateUser(data: {}, id: number): Promise<string>
    deleteUser(id: number): Promise<any>
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
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        return users;
    }

    public async registerUser(user: IRegisterUser): Promise<User> {

        // Check if user already exists with this username
        const username = await this.UsersRepository.findOne({is_active: true, username: user.username}).then((user) => {
            return user
        });
        if(username) {
            throw({value: `username: ${user.username} already exists!`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        }

        // Check if user already exists with this email
        const email = await this.UsersRepository.findOne({is_active: true, email: user.email}).then((user) => {
            return user
        });
        if(email) {
            throw({ value: `email: ${user.email} already exists!`, statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        }

        // register User
        const registerUser:User = await this.UsersRepository.createOne(user).then((user: User) => {
            return user
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        return registerUser
    }

    public async loginUser(user: ILoginUser): Promise<{token: string}> {
        // check if username & password is correct 
        const correct = await this.UsersRepository.findOne({username: user.username, password: user.password, is_active: true}).then((user) => {
            if(user === null) {
                throw({ value: "Username or Password isn't correct", statusCode: HttpStatus.BAD_REQUEST})
            } else { return user }
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        console.log(correct)

        // generate token
        const token = await generateToken(correct.id)

        // return token
        return { token: token }
    }

    public async getUser(id: number): Promise<User> {
        let user: User = await this.UsersRepository.findOneInc({is_active: true, id: id}).then((user) => {
            return user
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        });

        // If user not found
        if(user === null) { 
            user = await this.UsersRepository.findOne({is_active: true, id: id}).then((user) => {
                return user
            }).catch((err) => {
                throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
            });
        }
        
        if(user === null) {
            throw({value: "User not found", statusCode: HttpStatus.NOT_FOUND})
        }

        return user
    }

    public async updateUser(data: {}, id: number): Promise<string> {
        // check if user exists in DB
        const exists = await this.UsersRepository.findOne({is_active: true, id: id}).then((user) => {
            return user
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        if(exists === null) {
            throw({value: "User not found", statusCode: HttpStatus.NOT_FOUND})
        }

        // update
        const updatedUser = await this.UsersRepository.updateOne(data, id)
        
        if(updatedUser[0] === 1) {
            return "User successfully updated"
        } else {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        }

    }

    public async deleteUser(id: number): Promise<any> {
        // check if user exists in DB
        const exists = await this.UsersRepository.findOne({is_active: true, id: id}).then((user) => {
            return user
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        if(exists === null) {
            throw({value: "User not found", statusCode: HttpStatus.NOT_FOUND})
        }

        // update
        const deletedUser = await this.UsersRepository.deleteOne(id)
        
        if(deletedUser[0] === 1) {
            return "User successfully deleted!"
        } else {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        }

    }

}