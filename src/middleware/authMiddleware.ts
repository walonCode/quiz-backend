import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose"
import { config } from "../config/config";


const secret = new TextEncoder().encode(config.JWT_SECRET)

export async function authMiddleware(req:Request, res:Response, next:NextFunction){
    try{
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]

        if(!token){
            return res.status(401).json({
                "ok":false,
                "message":"user not authenticated"
            })
        }

        const { payload } = await jwtVerify(token,secret)
        if(!payload){
            return res.status(500).json({
                "ok":false,
                "message":"user is not authenticated",
            })
        }

        req.user = {
            id:payload.id as string,
            // role:payload.id as string
        }

        next()
    }catch(err){
        return res.status(500).json({
            "ok":false,
            "message":"internal server error",
        })
    }
}