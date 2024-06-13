import { Request, Response } from "express";
import ChatService from "./chat-service";

class ChatController {
	private chatService: ChatService;

	constructor(chatService: ChatService) {
		this.chatService = chatService;
	}

	addMessage = async (req: Request, res: Response): Promise<void> => {
		try {
			const { message, sender, chatId } = req.body;
			await this.chatService.addMessage(chatId, sender, message);
			res.status(201).json({ message: "Message sent" });
		} catch (error: any) {
			res.status(500).send({ error: error.message });
		}
	};

	getChats = async (req: Request, res: Response): Promise<void> => {
		try {
			const chats = await this.chatService.getChats();
			res.status(200).json(chats);
		} catch (error: any) {
			res.status(500).send({ error: error.message });
		}
	};
}

export default ChatController;
