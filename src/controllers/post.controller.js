import {
    eliminarImagenCloudinary,
    subirImagenACloudinary,
  } from "../helpers/cloudinary.actions.js";
  import { deleteImg } from "../helpers/deleteimg.js";
  import { response } from "../helpers/response.js";
  import { postModel } from "../models/post.model.js";
  
  const postCtrl = {};
  
  postCtrl.listar = async (req, reply) => {
    try {
      // const posts = await postModel
      //   .find()
      //   .populate("user", { password: 0 })
      //   .sort("-createdAt");
      const posts = await postModel
        .find()
        .populate({path:"user",select:"-password"})
        .sort("-createdAt");
  
      response(reply, 200, true, posts, "lista de posts");
    } catch (error) {
      response(reply, 500, false, "", error.message);
    }
  };
  
  postCtrl.listarPostLogin = async (req, reply) => {
    try {
      const posts = await postModel
        .find({ user: req.userId })
        .populate("user", { password: 0 })
        .sort("-createdAt");
      response(reply, 200, true, posts, "lista de posts del usuario logueado");
    } catch (error) {
      response(reply, 500, false, "", error.message);
    }
  };
  
  postCtrl.listOne = async (req, reply) => {
    try {
      const { id } = req.params;
      const post = await postModel.findById(id);
      if (!post) {
        return response(reply, 404, false, "", "registro no encontrado");
      }
      response(reply, 200, true, post, "post encontrado");
    } catch (error) {
      response(reply, 500, false, "", error.message);
    }
  };
  
  postCtrl.add = async (req, reply) => {
    try {
      const {name, title, description, contact } = req.body;
      const newPost = new postModel({
        name,
        title,
        description,
        contact,
        user: req.userId,
      });
  
      // req.file && newPost.setImg(req.file.filename);
  
      if (req.file) {
        const { secure_url, public_id } = await subirImagenACloudinary(req.file);
        newPost.setImg({ secure_url, public_id });
      }
  
      await postModel.create(newPost);
      response(reply, 201, true, newPost, "post creado");
    } catch (error) {
      response(reply, 500, false, "", error.message);
    }
  };
  
  postCtrl.delete = async (req, reply) => {
    try {
      const { id } = req.params;
      const post = await postModel.findById(id);
      if (!post) {
        return response(reply, 404, false, "", "registro no encontrado");
      }
      // post.nameImage && deleteImg(post.nameImage);
  
      if (post.public_id) {
        await eliminarImagenCloudinary(post.public_id);
      }
  
      await post.deleteOne();
  
      response(reply, 200, true, "", "post eliminado");
    } catch (error) {
      response(reply, 500, false, "", error.message);
    }
  };
  
  postCtrl.update = async (req, reply) => {
    try {
      const { id } = req.params;
      const post = await postModel.findById(id);
      if (!post) {
        return response(reply, 404, false, "", "registro no encontrado");
      }
  
      if (req.file) {
        // post.nameImage && deleteImg(post.nameImage);
        // post.setImg(req.file.filename);
        if (post.public_id) {
          await eliminarImagenCloudinary(post.public_id);
        }
  
        const { secure_url, public_id } = await subirImagenACloudinary(req.file);
        post.setImg({ secure_url, public_id });
        await post.save();
      }
      await post.updateOne(req.body);
  
      response(reply, 200, true, "", "post actualizado");
    } catch (error) {
      response(reply, 500, false, "", error.message);
    }
  };
  
  export default postCtrl;