import * as express from 'express';
import {injectable, inject} from 'inversify';

import TYPES from '../../types/types';
import {UsersService} from '../../services/users/Users.service';
import {RegistrableController} from '../Registerable.controller';
import { userRegisterSchema, userLoginSchema, userUpdateSchema } from '../../validators/user/user'

import { verifyToken } from '../../shared/helpers/jwt/verifyToken'

import { User } from '../../models/user/user.model'

@injectable()
export class UsersController implements RegistrableController {
    private UsersService: UsersService;

    constructor(@inject(TYPES.UsersService) UsersService: UsersService) {
        this.UsersService = UsersService;
    }

    public register(app: express.Application): void {
        app.route('/users')
            // GET all users
            .get(verifyToken, async(req: express.Request, res: express.Response, next: express.NextFunction) => {
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
        // Login user
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

        app.route('/users/:id')
            .get(async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    // take id
                    const id: number = parseInt(req.params.id)

                    // find by id
                    const user = await this.UsersService.getUser(id)
                    res.send(user)
                } catch(err) {
                    next(err)
                }
            })
            // update user
            .put( verifyToken ,async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    // take request params
                    let updateData: any = {};
                    const propertyes  = ['email', 'password'];
                    propertyes.forEach((property: string) => {
                        if( req.body[property] ) {
                            updateData[property] = req.body[property]
                        }
                    });

                    if(!updateData) {
                        throw({type: "USER_CONTROLLER_ERROR", value: "data is empty", statusCode: 400})
                    }

                    // validate
                    const validate = userUpdateSchema.validate(updateData)
                    if(validate.error) {
                        const err = validate.error.details[0].message; 
                        throw({type: "USER_CONTROLLER_ERROR", value: err, statusCode: 400})
                    }

                    if(req.params.id != req.body.userId) {
                        throw({type: "USER_CONTROLLER_ERROR", value: 'Access Denied!', statusCode: 400})
                    }

                    // update
                    const updatedUser: string = await this.UsersService.updateUser(updateData, req.body.userId)
                    res.send(updatedUser)
                } catch(err) {
                    next(err)
                }
            })
            // delete user
            .delete( verifyToken ,async(req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const id = parseInt(req.params.id)
                    if( id !== req.body.userId ) {
                        throw({type: "USER_CONTROLLER_ERROR", value: 'Access Denied!', statusCode: 400})
                    }
                    const deletedUser = await this.UsersService.deleteUser(req.body.userId)
                    res.send(deletedUser)
                } catch(err) {
                    next(err)
                }
            });

    }
}