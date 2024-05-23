import { NextFunction, Request, Response } from "express";
export default function hideMenuMiddleware(req: Request, res: Response, next: NextFunction) {
    res.locals.hideMenu = true
    next()
}