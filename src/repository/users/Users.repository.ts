import {injectable} from 'inversify';

import { User } from '../../models/user/user.model'


export interface UsersRepository {
    findAll(): Promise<User[]>;
}

@injectable()
export class UsersRepositoryImp implements UsersRepository {
    public findAll(): Promise<User[]> {
        return User.findAll({where: {is_active: true}})
    }
}