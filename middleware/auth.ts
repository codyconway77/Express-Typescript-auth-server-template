import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, RequestHandler, Response } from 'express';
dotenv.config();
const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret

interface IUserRequest extends Request {
    user: any
}

export default (req: IUserRequest, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token found, access denied.' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ msg: 'token is not valid.' });
    }
}