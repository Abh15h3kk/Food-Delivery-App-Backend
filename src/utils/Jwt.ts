import * as Bcrypt from 'bcrypt'
import { getEnvironmentVariables } from '../environments/environment';
import * as jwt from 'jsonwebtoken'

export class Jwt {
    static jwtSign(payload, expiresIn: string = '7d'){
        return jwt.sign(payload,
        getEnvironmentVariables().jwt_secret_key,
        { expiresIn: expiresIn})
    }

    static jwtVerify(token:string): Promise<any>{
        return new Promise((resolve,reject) => {
            jwt.verify(token, getEnvironmentVariables().jwt_secret_key,(err,decoded) => {
                if(err) reject(err)
                else if(!decoded) reject(new Error('User is not authorized'))
                else resolve(decoded) //true, only two option here either error or true
            })
        })
    }
}