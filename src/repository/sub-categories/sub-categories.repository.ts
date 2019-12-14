import {injectable} from 'inversify';

import { SubCategory } from '../../models/sub-category/sub-category'


export interface SubCategoriesRepository {
    findAll(where?: {}): Promise<SubCategory[]>;
}

@injectable()
export class SubCategoriesRepositoryImp implements SubCategoriesRepository {

    public async findAll(where = {}): Promise<SubCategory[]> {
        return SubCategory.findAll({where: where})
    }

}