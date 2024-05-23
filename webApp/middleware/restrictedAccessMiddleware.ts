import { NextFunction, Request, Response } from "express";

export function restrictedAccessMiddleware(req: Request, res: Response, next: NextFunction): any {
    if (req.session.user?.role !== "ADMIN") {
        return res.redirect("back")
    }
    next();
};