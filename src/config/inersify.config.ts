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

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(UsersController);
container.bind<RegistrableController>(TYPES.Controller).to(ProductsController);
container.bind<UsersService>(TYPES.UsersService).to(UsersServiceImp);
container.bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepositoryImp);

export default container;