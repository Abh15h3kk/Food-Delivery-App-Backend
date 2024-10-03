import User from "../models/user";


export class UserController {
    
    static signup(req,res,next) {

        const email = req.body.email;
        const password = req.body.password;

        const user = new User({
            email: email,
            password: password
        });

        user.save().then((user) => {
            res.send(user)
        }).catch((e) => {
            console.error('Error saving user:', e);
            next(e)
        })
    }
}