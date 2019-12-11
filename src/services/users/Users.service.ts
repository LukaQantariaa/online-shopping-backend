import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import {UsersRepository} from '../../repository/users/Users.repository';
import { User } from '../../models/user/user.model'
import TYPES from '../../types/types';


export interface UsersService {
    getUsers():  Promise<User[]>
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
            throw({type: "Users_Controler_ERR", value: err, statusCode: 400})
        })

        return users
    }

}