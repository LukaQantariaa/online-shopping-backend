import * as express from 'express';
import {injectable, inject} from 'inversify';

import TYPES from '../../types/types';
import {UsersService} from '../../services/users/Users.service';
import {RegistrableController} from '../Registerable.controller';
import { userRegisterSchema, userLoginSchema } from '../../validators/user/user'

@injectable()
export class UsersController implements RegistrableController {
    private UsersService: UsersService;

    constructor(@inject(TYPES.UsersService) UsersService: UsersService) {
        this.UsersService = UsersService;
    }

    public register(app: express.Application): void {
        app.route('/users')
        // GET all users
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const users = await this.UsersService.getUsers().catch(err => {
                        throw({type: "Users_Controller_ERROR", value: err, statusCode: 400})
                    });
                    res.send(users)
                } catch(err) {
                    next(err)
                }
            })
        // Register user
            .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    // request params
                    const user = {
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        is_active: true
                    }

                    // validate
                    const validate = userRegisterSchema.validate(user)
                    if(validate.error) {
                        const err = validate.error.details[0].message; 
                        throw({type: "USER_CONTROLLER_ERROR", value: err, statusCode: 400})
                    }

                    // register user
                    const registerUser = await this.UsersService.registerUser(user)
                    res.send(registerUser)
                } catch(err) {
                    next(err)
                }
            })
        app.route('/users/login')
            .post(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    // request params
                    const user = {
                        username: req.body.username,
                        password: req.body.password,
                        is_active: true
                    }

                    //validate 
                    const validate = userLoginSchema.validate(user)
                    if(validate.error) {
                        const err = validate.error.details[0].message; 
                        throw({type: "USER_CONTROLLER_ERROR", value: err, statusCode: 400})
                    }

                    //Login user
                    const token = await this.UsersService.loginUser(user);
                    res.send(token)
                } catch(err) {
                    next(err)
                }
            })

    }
}