import * as express from 'express';
import {injectable, inject} from 'inversify';
import TYPES from '../../types/types';
import {UsersService} from '../../services/users/Users.service';
import {RegistrableController} from '../Registerable.controller';

@injectable()
export class UsersController implements RegistrableController {
    private UsersService: UsersService;

    constructor(@inject(TYPES.UsersService) UsersService: UsersService) {
        this.UsersService = UsersService;
    }

    public register(app: express.Application): void {
        // GET all users
        app.route('/users')
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
    }
}