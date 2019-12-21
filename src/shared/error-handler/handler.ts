import { NextFunction, Request, Response } from "express";

export const apiErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err['status'] = "error"
    res.status(err.statusCode).json(err).send();
};