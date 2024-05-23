import { NextFunction, Request, Response } from "express";
export default function ShowMenuMiddleware(req: Request, res: Response, next: NextFunction) {
    res.locals.hideMenu = false
    next()
}