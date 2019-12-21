import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import * as HttpStatus from "http-status-codes";

import { CategoriesRepository } from '../../repository/categories/categories.repository'
import { Category } from '../../models/category/category.model'
import { ICategory } from '../../interfaces/category/category.interface'
import TYPES from '../../types/types'


export interface CategoriesService {
    getCategories():  Promise<Category[]>;
    createCategory(category: ICategory): Promise<Category>;
    deleteCategory(id: number): Promise<string>
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
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        return Categories;
    }

    public async createCategory(category: ICategory): Promise<Category> {
        // Check if Category already exists with this name
        const categoryName: any = await this.CategoriesRepository.findOne({ name: category.name }).then((categoryName) => {
            return categoryName
        });
        if(categoryName) {
            throw({value: `name: ${category.name} already exists!`, statusCode: HttpStatus.BAD_REQUEST})
        }

        // Create sub-category
        const CreatedCategory:Category = await this.CategoriesRepository.createOne(category).then((category: Category) => {
            return category
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        return CreatedCategory
    }

    public async deleteCategory(id: number): Promise<string> {
        // check if Category exists in DB
        const exists = await this.CategoriesRepository.findOne({is_active: true, id: id}).then((c) => {
            return c
        }).catch((err) => {
            throw({type: "CATEGORY_SERVICE_ERROR", value: err, statusCode: 400})
        })

        if(exists === null) {
            throw({value: "Category not found", statusCode: HttpStatus.NOT_FOUND})
        }

        // update
        const deleteCategory = await this.CategoriesRepository.deleteOne(id)
        
        if(deleteCategory[0] === 1) {
            return "Category successfully deleted!"
        } else {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        }
    }
}

