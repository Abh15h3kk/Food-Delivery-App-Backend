export class UserController {
    
    static login(req,res) {
        const data = [{name: 'abhishek'}]
        res.status(200).send(data)
    }
}