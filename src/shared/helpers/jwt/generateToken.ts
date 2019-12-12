import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export function generateToken(id:number){

    const token = jwt.sign({ id: id }, process.env.JWT_SECRET!, {
        expiresIn: '3600000' // 1 hours
    })
    return token
}