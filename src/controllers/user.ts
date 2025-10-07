import { Request, Response} from "express"
import User from "../models/userModel"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function login(req:Request, res:Response){
    try{
        const { username, password } = req.body
        if(!username || !password){
            return res.status(400).json({
                "ok":false,
                "message":"invalid username or email"
            })
        }

        const userExist = await User.findOne({ username})

        const passwordMatch = await bcrypt.compare(password, userExist?.password as string)
        if(!passwordMatch || !userExist){
            return res.status(401).json({
                "ok":false,
                "message":"invalid password or username"
            })
        }

        const accessToken = await new SignJWT({ id: userExist.id}).setExpirationTime('7d').setProtectedHeader({"alg":"H256"}).sign(secret)

        res.cookie("accessToken", accessToken, {
            maxAge:60 * 60 * 60 * 24,
            sameSite:"none",
            secure:true,
            signed:true,
            httpOnly:true
        })

        return res.status(200).json({
            "ok":false,
            "message":"user login",
            "data":{
                userExist,
                accessToken
            }    
        })

    }catch(error){
        return res.status(500).json({
            "ok":false,
            "message":"internal server error",
            "error":error
        })
    }
}


export async function signup(req:Request, res:Response){
    try{
        const { username, password } = req.body

        if(!username || !password){
            return res.status(400).json({
                "ok":false,
                "message":"invalid username or email"
            })
        }

        const userExist = await User.findOne({ username})
        if(userExist){
            return res.status(409).json({
                "ok":false,
                "message":"user already exist",
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            username,
            password:passwordHash,
        })

        await user.save()

        const accessToken = await new SignJWT({ id: user.id}).setExpirationTime('7d').setProtectedHeader({"alg":"H256"}).sign(secret)

        res.cookie("accessToken", accessToken, {
            maxAge:60 * 60 * 60 * 24,
            sameSite:"none",
            secure:true,
            signed:true,
            httpOnly:true
        })

        return res.status(200).json({
            "ok":false,
            "message":"user signup",
            "data":{
                user,
                accessToken
            }    
        })

    }catch(error){
        return res.status(500).json({
            "ok":false,
            "message":"internal server error",
            "error":error
        })
    }
}