import dbConnect from "../../../../lib/db.connect";
import UserModel from "@/model/User.model";
import {z} from "zod"
import { usernameValidation } from "@/schema/singnUpSchema";

export async function POST(request: Request){
    try {
        await dbConnect();
        const {username,code} = await request.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "USername not found"
            },
            {status: 400}
            )
        }

        const isCodeValid = user?.verifyCode  === code ;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
             return Response.json({
                success: true,
                message: "Username verified successfully"
            },{status: 200})
        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Code has expired please signup again to get a new one"
            },{status: 400})
        }else{
            return Response.json({
                success: false,
                message: "Invalid code"
            },{status: 400})
        }

    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Error verifying username"
        },
        {status: 500}
    )
    }
}