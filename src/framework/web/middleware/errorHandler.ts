import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

interface Err extends Error{
    statusCode?: number;
}

export const errorHandler = (err: Err, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Something went wrong!',
        errorDetail: process.env.NODE_ENV === 'development' ? err : {},
    });
};
