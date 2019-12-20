import {injectable} from 'inversify';

import { User } from '../../models/user/user.model'
import { IRegisterUser } from '../../interfaces/user/user.interface'
import { Product } from '../../models/product/product';


export interface UsersRepository {
    findAll(where?: {}): Promise<User[]>;
    findOneInc(where?: {}): Promise<User>;
    findOne(where?: {}): Promise<User>;
    createOne(user: IRegisterUser): Promise<User>;
    updateOne(data: {email?: string, password?: string}, id: number): Promise<Array<any>>;
    deleteOne(id: number): Promise<Array<any>>
}

@injectable()
export class UsersRepositoryImp implements UsersRepository {
    public findAll(where = {}): Promise<User[]> {
        return User.findAll({where: where});
    }

    public findOneInc(where = {}): Promise<User> {
        return User.findOne({where: where, include: [{model: Product, where: {is_active: true}}]});
    }

    public findOne(where?: {}): Promise<User> {
        return User.findOne({where: where});
    }

    public createOne(user: IRegisterUser): Promise<User> {
        return User.create(user)
    }

    public updateOne(data: {email?: string, password?: string}, id: number): Promise<Array<any>> {
        return User.update(data, {where: {id: id}})
    }

    public deleteOne(id: number): Promise<Array<any>> {
        return User.update({is_active: false}, {where: {id: id}})
    }

}