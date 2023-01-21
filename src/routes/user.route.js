//importamos nuestro controlador
import userCtrol from "../controllers/user.controller.js";

export const userRoutes = (fastify, opts, done) => {
  fastify.post("/register", userCtrol.register);
  fastify.post("/login", userCtrol.login);

  done();
};
