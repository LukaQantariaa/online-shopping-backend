import {injectable} from 'inversify';

import { Category } from '../../models/category/category.model'
import { ICategory } from '../../interfaces/category/category.interface'
import { SubCategory } from '../../models/sub-category/sub-category';


export interface CategoriesRepository {
    findAll(where?: {}): Promise<Category[]>;
    findOne(where?: {}): Promise<any>;
    createOne(category: ICategory): Promise<Category>;
    deleteOne(id: number): Promise<Array<any>>
}

@injectable()
export class CategoriesRepositoryImp implements CategoriesRepository {

    public async findAll(where = {}): Promise<Category[]> {
        return Category.findAll({where: where, include: [{model: SubCategory, where: {is_active: true}}]})
    }

    public async findOne(where = {}): Promise<any> {
        return Category.findOne({where: where, include: [{model: SubCategory, where: {is_active: true}}]});
    }

    public async createOne(category: ICategory): Promise<Category> {
        return Category.create(category)
    }

    public deleteOne(id: number): Promise<Array<any>> {
        return Category.update({is_active: false}, {where: {id: id}})
    }
}