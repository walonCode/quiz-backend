
import { Request } from 'express';

declare module 'express' {
    interface Request {
        user?: {
            id: string;        // User ID for controllers
        };
    }
}