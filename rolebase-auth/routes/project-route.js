import express from "express";
import { projects, ROLE } from "../database/db.js";

export const projectRoute = express.Router();

projectRoute.get("/", (req, res) => {
    return res.json(scopeProjects(req.user, projects));
})

projectRoute.get("/:projectId", setProject, canGetProject, (req, res) => {
    return res.json(req.project);
})

function setProject(req, res, next){
    const projectId = parseInt(req.params.projectId);
    req.project = projects.find((project) => project.id === projectId);

    if(req.project === null){
        res.sendStatus(404);
        return res.send("project not found");
    }
    next();
}

function canGetProject(req, res, next){
    if(!canViewProject(req.user, req.project)){
        return res.sendStatus(403);
    }
    next();
}

function canViewProject(user, project){
    return (
        user.role === ROLE.ADMIN || 
        user.id === project.id
    )
}

function scopeProjects(user, projects){
    if(user.role === ROLE.ADMIN) return projects;
    return projects.filter((project) => project.userId === user.id);
}

