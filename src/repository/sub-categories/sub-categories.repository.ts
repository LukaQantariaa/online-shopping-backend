import {injectable} from 'inversify';

import { SubCategory } from '../../models/sub-category/sub-category'


export interface SubCategoriesRepository {
    findAll(where?: {}): Promise<SubCategory[]>;
    findOne(where?: {}): Promise<any>;
    createOne(Subcategory: any): Promise<SubCategory>;
}

@injectable()
export class SubCategoriesRepositoryImp implements SubCategoriesRepository {

    public async findAll(where = {}): Promise<SubCategory[]> {
        return SubCategory.findAll({where: where})
    }

    public async findOne(where = {}): Promise<any> {
        return SubCategory.findOne({where: where});
    }

    public async createOne(Subcategory: any): Promise<SubCategory> {
        return SubCategory.create(Subcategory)
    }

    

}