import {injectable} from 'inversify';

import { Category } from '../../models/category/category.model'


export interface CategoriesRepository {
    findAll(where?: {}): Promise<any>;
}

@injectable()
export class CategoriesRepositoryImp implements CategoriesRepository {
    public async findAll(where = {}): Promise<any> {
        return Category.findAll({where: where})
    }
}