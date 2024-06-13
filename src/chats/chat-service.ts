import Chat, { IChat } from "./models/Chat";
import User, { IUser } from "./models/User";

class ChatService {
	async getChatById(id: string): Promise<IChat | null> {
		return await Chat.findById(id).exec();
	}

	async getChats(): Promise<IChat[]> {
		return await Chat.find().exec();
	}

	async addMessage(
		chatId: string,
		sender: string,
		message: string
	): Promise<IChat | null> {
		const chat = await this.getChatById(chatId);
		if (!chat) {
			return null;
		}
		if (chat.participants.indexOf(sender) === -1) {
			return null;
		}
		chat.messages.push({ sender, message, date: new Date() });
		return await chat.save();
	}

	async getUsers(): Promise<IUser[]> {
		return await User.find().exec();
	}

	async getMessages(
		chatId: string
	): Promise<{ sender: string; message: string; date: Date }[]> {
		const chat = await this.getChatById(chatId);
		if (!chat) {
			return [];
		}
		return chat.messages;
	}
}

export default ChatService;
