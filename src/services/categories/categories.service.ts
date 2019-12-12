import 'reflect-metadata';
import {injectable, inject} from 'inversify';

import { CategoriesRepository } from '../../repository/categories/categories.repository'
import { Category } from '../../models/category/category.model'
import TYPES from '../../types/types'


export interface CategoriesService {
    getCategories():  Promise<Category[]>;
}

@injectable()
export class CategoriesServiceImp implements CategoriesService {

    private CategoriesRepository: CategoriesRepository

    constructor(@inject(TYPES.CategoriesRepository) CategoriesRepository: CategoriesRepository) {
        this.CategoriesRepository = CategoriesRepository;
    }

    public async getCategories(): Promise<Category[]> {
        const Categories: Category[] = await this.CategoriesRepository.findAll().then((Categories) => {
            return Categories
        }).catch((err) => {
            throw({type: "CATEGORY_SERVICE_ERROR", value: err, statusCode: 400})
        })

        return Categories;
    }
}

