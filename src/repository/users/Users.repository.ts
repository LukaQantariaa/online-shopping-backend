import {injectable} from 'inversify';

import { User } from '../../models/user/user.model'
import { ILoginUser } from '../../interfaces/user/user.interface'


export interface UsersRepository {
    findAll(where?: {}): Promise<User[]>;
    findOne(where?: {}): Promise<User>;
    createOne(user: ILoginUser): Promise<User>;
}

@injectable()
export class UsersRepositoryImp implements UsersRepository {
    public findAll(where = {}): Promise<User[]> {
        return User.findAll({where: where});
    }

    public findOne(where = {}): Promise<User> {
        return User.findOne({where: where});
    }

    public createOne(user: ILoginUser): Promise<User> {
        return User.create(user)
    }

}