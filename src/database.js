import mongoose from "mongoose";


// const uri = "mongodb://127.0.0.1:27017/dbejemplo";
const uri = "mongodb+srv://mesaj:320237@cluster0.ku1tmmq.mongodb.net/backend4"


mongoose.set('strictQuery', false);


// const uri = "mongodb+srv://prueba:prueba@cluster0.ptdypkd.mongodb.net/backend4";

export const connectDb = async () => {

    try {

        const db = await mongoose.connect(uri);
        console.log("base de datos conectada " , db.connection.name);
        
    } catch (error) {
        console.log(`error al conectarse a la base de datos ${error.message}`);
    }


};