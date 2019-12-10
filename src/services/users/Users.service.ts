import {injectable, inject} from 'inversify';
import 'reflect-metadata';
import {UsersRepository} from '../../repository/users/Users.repository';
import TYPES from '../../types/types';


export interface UsersService {
    getUsers():  Promise<Array<{name: string; surname: string}>>
}

@injectable()
export class UsersServiceImp implements UsersService {

    private UsersRepository: UsersRepository

    constructor(@inject(TYPES.UsersRepository) UsersRepository: UsersRepository) {
        this.UsersRepository = UsersRepository;
    }

    public async getUsers(): Promise<Array<{name: string; surname: string}>> {
        const response = await this.UsersRepository.findAll().then((users) => {
            return users
        }).catch((err) => {
            throw({type: "Users_Controler_ERR", value: err, statusCode: 400})
        })

        return response
        // return response
    }

}