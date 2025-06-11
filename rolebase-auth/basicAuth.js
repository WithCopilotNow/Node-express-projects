export function userAuth(req, res, next){
    console.log(req.user)
    if(!req.user) return res.sendStatus(401);
    next();
}