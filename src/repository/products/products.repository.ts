import {injectable} from 'inversify';

import { Product } from '../../models/product/product'
import { User } from '../../models/user/user.model';
import { SubCategory } from '../../models/sub-category/sub-category';
import { Category } from '../../models/category/category.model';


export interface ProductsRepository {
    findAll(where?: {}): Promise<Product[]>;
}

@injectable()
export class ProductsRepositoryImp implements ProductsRepository {
    public findAll(where = {}): Promise<Product[]> {
        return Product.findAll({where: where, include: [{model: User},{model: SubCategory, include: [{model: Category}]}]})
    }

}