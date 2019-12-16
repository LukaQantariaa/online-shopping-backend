import {injectable} from 'inversify';

import { Product } from '../../models/product/product'
import { User } from '../../models/user/user.model';
import { SubCategory } from '../../models/sub-category/sub-category';


export interface ProductsRepository {
    findAll(where?: {}): Promise<Product[]>;
}

@injectable()
export class ProductsRepositoryImp implements ProductsRepository {
    public findAll(where = {}): Promise<Product[]> {
        return Product.findAll({where: where, include: [{model: User},{model: SubCategory}]})
    }

}