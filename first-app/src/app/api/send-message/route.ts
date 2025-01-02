import UserModel from "@/model/User.model";
import dbConnect from "../../../../lib/db.connect";
import { Message } from "@/model/User.model";

export async function POST (request: Request){
    await dbConnect();

    const {username,content} = await request.json();
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success:false,
                messag:"User not found"
            },{status:404 }
        )}

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                messag:"User is not accepting messages"
            },{status:403 })
        }

        const newMessage ={
            content,
            createdAt: new Date(),
        };

        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({
            success:true,
            messag:"message send successfully"
        },{status:  404 })
    } catch (error) {
        console.log("Error sending message")
        return Response.json({
            success:false,
            messag:"Internal server error"
        },{status:500 }) 
    }
}