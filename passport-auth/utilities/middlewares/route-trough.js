export function routeThrough(req, res, next){
    if(req.isAuthenticated() && (req.path === "/login" || req.path === "/register")){
        return res.redirect("/");
    }
    if(!req.isAuthenticated() && req.path != "/login" && req.path != "/register"){
        return res.redirect("/login");
    }
    next();
}