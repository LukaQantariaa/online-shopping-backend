import 'reflect-metadata';
import {injectable, inject} from 'inversify';
import * as HttpStatus from "http-status-codes";

import { SubCategoriesRepository } from '../../repository/sub-categories/sub-categories.repository'
import { CategoriesRepository } from '../../repository/categories/categories.repository'
import { SubCategory } from '../../models/sub-category/sub-category';
import { Category } from '../../models/category/category.model'
import { ISubCategory } from '../../interfaces/sub-category/sub-category.interface'
import TYPES from '../../types/types'


export interface SubCategoriesService {
    getSubCategories():  Promise<SubCategory[]>;
    createSubCategory(Subcategory: ISubCategory): Promise<SubCategory>;
    deleteSubCategory(id: number): Promise<string>;
    getSubCategory(id: number): Promise<SubCategory>;
}

@injectable()
export class SubCategoriesServiceImp implements SubCategoriesService {

    private SubCategoriesRepository: SubCategoriesRepository;
    private CategoriesRepository: CategoriesRepository

    constructor(@inject(TYPES.SubCategoriesRepository) SubCategoriesRepository: SubCategoriesRepository, @inject(TYPES.CategoriesRepository) CategoriesRepository: CategoriesRepository) {
        this.SubCategoriesRepository = SubCategoriesRepository;
        this.CategoriesRepository = CategoriesRepository;
    }

    public async getSubCategories(): Promise<SubCategory[]> {
        const SubCategories: SubCategory[] = await this.SubCategoriesRepository.findAll().then((sub) => {
            return sub
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        return SubCategories;
    }

    public async createSubCategory(Subcategory: ISubCategory): Promise<SubCategory> {
        // Check if Sub-Category already exists with this name
        const SubcategoryName: SubCategory = await this.SubCategoriesRepository.findOne({ name: Subcategory.name }).then((name) => {
            return name
        });
        
        if(SubcategoryName) {
            throw({value: `Subcategory: ${Subcategory.name} already exists!`, statusCode: HttpStatus.BAD_REQUEST})
        }

        // Check if Category exists with this id.
        const category: Category = await this.CategoriesRepository.findOne({id: Subcategory.CategoryId}).then((c) => {
            return c
        });
        if(!category) {
            throw({value: `Not found Category on id= ${Subcategory.CategoryId}!`, statusCode: HttpStatus.BAD_REQUEST})
        }

        // Create Sub-category
        const CreatedSubCategory:SubCategory = await this.SubCategoriesRepository.createOne(Subcategory).then((created: SubCategory) => {
            return created
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        return CreatedSubCategory
    }

    public async deleteSubCategory(id: number): Promise<string> {
        // check if Sub-Category exists in DB
        const exists = await this.SubCategoriesRepository.findOne({is_active: true, id: id}).then((c) => {
            return c
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        if(exists === null) {
            throw({value: "Subcategory not found", statusCode: HttpStatus.NOT_FOUND})
        }

        // update
        const deleteSubCategory = await this.SubCategoriesRepository.deleteOne(id)
        
        if(deleteSubCategory[0] === 1) {
            return "SubCategory successfully deleted!"
        } else {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        }
    }

    public async getSubCategory(id: number): Promise<SubCategory> {
        // check if Sub-Category exists in DB
        let SubCategory: SubCategory = await this.SubCategoriesRepository.findOneInc({is_active: true, id: id}).then((c) => {
            return c
        }).catch((err) => {
            throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
        })

        if(SubCategory === null) {
            SubCategory = await this.SubCategoriesRepository.findOne({is_active: true, id: id}).then((c) => {
                return c
            }).catch((err) => {
                throw({value: "Database Error", statusCode: HttpStatus.INTERNAL_SERVER_ERROR})
            })
        }

        if(SubCategory === null) {
            throw({value: "Subcategory not found", statusCode: HttpStatus.NOT_FOUND})
        }

        return SubCategory

    }

}

