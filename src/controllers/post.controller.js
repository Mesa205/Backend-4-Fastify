import { eliminarImagenCloudinary, subirImagenACloudinary } from "../helpers/cloudinary.actions.js";
import { deleteImg } from "../helpers/deleteimg.js";
import { response } from "../helpers/Response.js"
import { postModel } from "../models/post.model.js"

const postCtrol = {}

postCtrol.listar = async(req,reply)=>{
    try {
        console.log(req.userId)             
        //El populate es para que nos muestre la relacion es decir , que a la hora de nostros listar los post , nos salga la info del usuario que creo el                                               
        const posts=await postModel.find().populate({path:"user",select:"-password"}).sort({createdAt:-1})  //El .sort({createdAt:-1}) nos sirve para organizar nuestros post de forma del mas actual al mas viejito
        response(reply,200,true,posts,"Lista de posts")
    } catch (error) {
        response(reply,500,false,"",error.message)
    }
} ;

//Controlador para obtener solo los posts del usuario logueado
postCtrol.listarPostLogin = async(req,reply)=>{
    try {
        console.log(req.userId)             
        //El populate es para que nos muestre la relacion es decir , que a la hora de nostros listar los post , nos salga la info del usuario que creo el                                               
        const posts=await postModel.find({user:req.userId}).populate("user",{password:0}).sort({createdAt:-1})  //El .sort({createdAt:-1}) nos sirve para organizar nuestros post de forma del mas actual al mas viejito
        response(reply,200,true,posts,"Lista de posts del user logueado")
    } catch (error) {
        response(reply,500,false,"",error.message)
    }
} ;

postCtrol.listarById = async (req,reply) => {
    try {

        const {id} = req.params;

        const post = await postModel.findById(id)

        if(!post){
            return response(reply,404,false,"","Post no encontrado")
        }


        response(reply,200,true,post,"Post encontrado")
        

    } catch (error) {
        response(reply,500,false,"",error.message)
    }
}




postCtrol.add=async(req,reply)=>{
    try {


        const {title,description} = req.body
        const newPost= new postModel ({
            title,
            description,
            user:req.userId
        });



        if(req.file){
         const {secure_url,public_id}  = await subirImagenACloudinary(req.file)
         newPost.setImg({secure_url,public_id});
        }
            
        
        await postModel.create(newPost);
        response(reply,201,true,newPost,"Post creado correctamente ");
        
    } catch (error) {
        response(reply,500,false,"",error.message)
    }
};


postCtrol.delete = async (req,reply) => {
    try {


        const {id} = req.params;

        const post = await postModel.findById(id)


        if(!post){
            return response(reply,404,false,"","Post no encontrado ")}

        
        if(post.public_id){
            await eliminarImagenCloudinary(post.public_id)
        }

        await post.deleteOne();

        response(reply,200,true,"","Post eliminado correctamente")

    } catch (error) {
        response(reply,500,false,"",error.message)
    }
}


postCtrol.update = async (req,reply) => {
    try {

        const {id} = req.params;

        const post = await postModel.findById(id)


        if(!post){
            return response(reply,404,false,"","Post no encontrado")}

       

        if(req.file){

            if(post.public_id){
                await eliminarImagenCloudinary(post.public_id)
            }
            const {secure_url,public_id}  = await subirImagenACloudinary(req.file)
            post.setImg({secure_url,public_id});
            await post.save()
        }


        await post.updateOne(req.body);

        response(reply,200,true,"","Post actualizado ")

    } catch (error) {
        response(reply,500,false,"",error.message)
    }
}



export default postCtrol;