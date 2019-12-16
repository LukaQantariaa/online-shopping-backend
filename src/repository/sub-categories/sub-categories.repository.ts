import {injectable} from 'inversify';

import { SubCategory } from '../../models/sub-category/sub-category'
import { ISubCategory } from '../../interfaces/sub-category/sub-category.interface'
import { Category } from '../../models/category/category.model'
import { Product } from '../../models/product/product';


export interface SubCategoriesRepository {
    findAll(where?: {}): Promise<SubCategory[]>;
    findOne(where?: {}): Promise<any>;
    createOne(Subcategory: ISubCategory): Promise<SubCategory>;
    deleteOne(id: number): Promise<Array<any>>
}

@injectable()
export class SubCategoriesRepositoryImp implements SubCategoriesRepository {

    public async findAll(where = {}): Promise<SubCategory[]> {
        return SubCategory.findAll({where: where, include: [{model: Category},{model: Product}]})
    }

    public async findOne(where = {}): Promise<any> {
        return SubCategory.findOne({where: where});
    }

    public async createOne(Subcategory: ISubCategory): Promise<SubCategory> {
        return SubCategory.create(Subcategory)
    }

    public deleteOne(id: number): Promise<Array<any>> {
        return SubCategory.update({is_active: false}, {where: {id: id}})
    }

    

}