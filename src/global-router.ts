import { Router } from "express";
import chatRouter from "./chats/chat-router";
// other routers can be imported here

const globalRouter = Router();

globalRouter.use(chatRouter);

// other routers can be added here

export default globalRouter;
