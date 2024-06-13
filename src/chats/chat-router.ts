import { Router } from "express";
import ChatController from "./chat-controller";
import ChatService from "./chat-service";

const chatRouter = Router();

const chatService = new ChatService();
const chatController = new ChatController(chatService);

chatRouter.get("/chats", chatController.getChats);
chatRouter.post("/message", chatController.addMessage);

export default chatRouter;
