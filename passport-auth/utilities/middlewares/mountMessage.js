export function mountMessages(req, res, next){
    res.locals.messages = req.flash("error");
    next();
}