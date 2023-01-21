import postCtrol from "../controllers/post.controller.js";
import { upload } from "../middleware/imgUpload.js";
// import { check } from "express-validator";
// import { validFields } from "../middleware/ValidFields.js";
import { verifyToken } from "../middleware/auth.js";

export const postRoutes = (fastify, opts, done) => {
  fastify.get("/", { preHandler: [verifyToken] }, postCtrol.listar);
  fastify.get(
    "/userpost",
    { preHandler: [verifyToken] },
    postCtrol.listarPostLogin
  );

  fastify.post(
    "/",
    {
      // schema: {
      //   body: {
      //     type: "object",
      //     required: ["title", "description"],
      //     properties: {
      //       title: {
      //         type: "string",
      //         minLength: 1,
      //         maxLength: 20,
      //       },
      //       description: {
      //         type: "string",
      //         minLength: 1,
      //         maxLength: 50,
      //       },
      //     },
      //   },
      // },
      preHandler: [verifyToken, upload.single("img")],
    },

    postCtrol.add
  );

  fastify.get("/:id", { preHandler: [verifyToken,] }, postCtrol.listarById);
  fastify.delete("/:id", { preHandler: [verifyToken] }, postCtrol.delete);
  fastify.put(
    "/:id",
    { preHandler: [verifyToken, upload.single("img")] },
    postCtrol.update
  );

  done();
};
