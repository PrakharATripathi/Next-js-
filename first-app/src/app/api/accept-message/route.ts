import {getServerSession} from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "../../../../lib/db.connect";
import UserModel from "@/model/User.model";
import {User} from "next-auth";
import { userAgentFromString } from "next/server";

export async function POST(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json(
            {
               success:false,
               message:"Not Authenticated"
            },
          {status: 401}
        )
    }

    const userId = user?._id;
    const {acceptMessage} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessage:acceptMessage},{new:true});
        if(!updatedUser) {
            return Response.json(
                {
                    success:false,
                    message:"Failed to update user status to accept messages"
                },
                {status: 404}
            );
        }else{
            return Response.json(
                {
                    success:true,
                    message:"User status updated successfully",
                    data:updatedUser
                },
                {status: 200}
            );
        }
    } catch (error) {
        console.log("failed to update user statue to accept messages")
        return Response.json(
            {
                success:false,
                message:"Failed to update user status to accept messages"
            },
            {status: 500}
        );
    }
}

export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;

    if(!session || !session.user){
        return Response.json(
            {
               success:false,
               message:"Not Authenticated"
            },
          {status: 401}
        )
    }

    const userId = user?._id;

    try {
        const user = await UserModel.findById(userId);
        if(!user) {
            return Response.json(
                {
                    success:false,
                    message:"user not found"
                },
                {status: 404}
            );
        }else{
            return Response.json(
                {
                    success:true,
                    isAcceptingMessage:user.isAcceptingMessage
                },
                {status: 200}
            );
        }
    } catch (error) {
        console.log("failed to update user statue to accept messages")
        return Response.json(
            {
                success:false,
                message:"Failed to fetch user"
            },
            {status: 500}
        );
    }
}