import { NextFunction, Request, Response } from "express";

export const apiErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err['status'] = "ERROR"
    res.status(err.statusCode).send(err);
};