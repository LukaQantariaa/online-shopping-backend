import * as jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { UsersServiceImp, UsersService } from '../../../services/users/Users.service'
import { UsersRepository, UsersRepositoryImp } from '../../../repository/users/Users.repository'

import dotenv from 'dotenv'

const userRepository: UsersRepository = new UsersRepositoryImp()
const userService: UsersService = new UsersServiceImp(userRepository)

export async function verifyToken(req:Request, res: Response, next: NextFunction) {
    if( req.header('access-token') ) {
        var token: any = req.header('access-token');
    } else {
        res.status(404).send("token does not exist");
        return 0
    }

    try {
        const verifiedToken: any = await jwt.verify(token, process.env.JWT_SECRET!);
        console.log(verifiedToken)
        const user = await userService.getUser(verifiedToken.id)
        req.body.userId = verifiedToken.id
        next()
    } catch(err) {
        res.status(400).send("Invalid Token");
    }
}