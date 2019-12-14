import 'reflect-metadata';
import {injectable, inject} from 'inversify';

import { SubCategoriesRepository } from '../../repository/sub-categories/sub-categories.repository'
import { SubCategory } from '../../models/sub-category/sub-category'
import TYPES from '../../types/types'


export interface SubCategoriesService {
    getSubCategories():  Promise<SubCategory[]>;
}

@injectable()
export class SubCategoriesServiceImp implements SubCategoriesService {

    private SubCategoriesRepository: SubCategoriesRepository

    constructor(@inject(TYPES.SubCategoriesRepository) SubCategoriesRepository: SubCategoriesRepository) {
        this.SubCategoriesRepository = SubCategoriesRepository;
    }

    public async getSubCategories(): Promise<SubCategory[]> {
        const SubCategories: SubCategory[] = await this.SubCategoriesRepository.findAll().then((sub) => {
            return sub
        }).catch((err) => {
            throw({type: "SUB-CATEGORY_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return SubCategories;
    }

}

