import "reflect-metadata";
import {Container} from 'inversify';
import TYPES from '../types/types';

// Registrable Controller
import {RegistrableController} from '../controllers/Registerable.controller';

// Users
import {UsersController} from '../controllers/users/Users.controller';
import { UsersService, UsersServiceImp } from '../services/users/Users.service'
import { UsersRepository, UsersRepositoryImp } from '../repository/users/Users.repository'

// Products
import { ProductsController } from '../controllers/products/Products.controller'

// Categories
import { CategoriesController } from '../controllers/categories/categories.controller'
import { CategoriesService, CategoriesServiceImp } from '../services/categories/categories.service'
import { CategoriesRepository, CategoriesRepositoryImp } from '../repository/categories/categories.repository'

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(UsersController);
container.bind<UsersService>(TYPES.UsersService).to(UsersServiceImp);
container.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepositoryImp);
// - - -
container.bind<RegistrableController>(TYPES.Controller).to(CategoriesController);
container.bind<CategoriesService>(TYPES.CategoriesService).to(CategoriesServiceImp);
container.bind<CategoriesRepository>(TYPES.CategoriesRepository).to(CategoriesRepositoryImp);
// - - -
container.bind<RegistrableController>(TYPES.Controller).to(ProductsController);



export default container;