import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "../../../../lib/db.connect";
import UserModel from "@/model/User.model";
// @ts-ignore
import bcrypt from "bcryptjs"

export async function POST(request:Request){
    await dbConnect();
    try { 
        const {email,username,password}=await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: 'Username already exists'
            },{
                status: 409
            })
        }
        const existingUserByEmail = await UserModel.findOne({email: email});
        console.log(existingUserByEmail)

        const verifyCode = Math.floor(100000+Math.random()*900000).toString();
        if(existingUserByEmail){
           if(existingUserByEmail.isVerified){
            return Response.json({
                success: false,
                message: 'This Email already exists'
            },{
                status: 409
            })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
           }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)
            const user = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode:verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage:true,
                messages:[]
            });
            await user.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email,username, verifyCode);
        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status:500})
        }

        // finally send the

        return Response.json({
            success: true,
            message: 'User registered successfully.please verify your email'
        },{status:201})
    } catch (error) {
        console.log('Error registering user',error);
        return Response.json({
            success: false,
            message: 'Error registering user'
        },{
            status: 500
        })
    }
}