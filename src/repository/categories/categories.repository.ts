import {injectable} from 'inversify';

import { Category } from '../../models/category/category.model'
import { ICategory } from '../../interfaces/category/category.interface'


export interface CategoriesRepository {
    findAll(where?: {}): Promise<Category[]>;
    findOne(where?: {}): Promise<any>;
    createOne(category: ICategory): Promise<Category>;
}

@injectable()
export class CategoriesRepositoryImp implements CategoriesRepository {

    public async findAll(where = {}): Promise<any> {
        return Category.findAll({where: where})
    }

    public async findOne(where = {}): Promise<any> {
        return Category.findOne({where: where});
    }

    public async createOne(category: ICategory): Promise<Category> {
        return Category.create(category)
    }
}