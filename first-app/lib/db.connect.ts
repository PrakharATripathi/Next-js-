import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?: Number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already database is connected")
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "" );

        connection.isConnected =  db.connections[0].readyState;
        console.log(db)
        console.log("DB Connected successfully");
    } catch (error){
        console.log("database connection error")
        process.exit(1)
    }
}

export default dbConnect;
