import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "el title es obligatorio"],
    },
    title: {
      type: String,
      required: [true, "el title es obligatorio"],
    },
    description: {
      type: String,
      required: [true, "La description es obligatoria"],
    },
    contact: {
      type: String,
      required: [true, "el title es obligatorio"],
    },

    imgUrl: {
      type: String,
      default: null,
      required: [ "La imagen es obligatoria"],
    },


    // nameImage: String,

    public_id: String,
    
    //Relacion/referencia hacia la coleccion o tabla user , ya con esto tenemos la referencia

    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

// postSchema.methods.setImg = function setImg(filename){
//   const url= `http://localhost:4000/public/`
//   this.imgUrl = url + filename;
//   this.nameImage=filename;
// }

postSchema.methods.setImg = function setImg({secure_url,public_id}) {
  
  this.imgUrl = secure_url;
  this.public_id = public_id;
};

export const postModel = model("post", postSchema);
