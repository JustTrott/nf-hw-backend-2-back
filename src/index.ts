import "dotenv/config";
import express from "express";
import connectDB from "./db";
import globalRouter from "./global-router";
import { logger } from "./logger";
import { Server } from "socket.io";
import { createServer } from "node:http";
import ChatService from "./chats/chat-service";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

connectDB();

const chatService = new ChatService();

let onlineUsers: string[] = [];

app.use(logger);
app.use(cors());
app.use(express.json());
app.use("/api/v1/", globalRouter);

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

io.on("connection", (socket) => {
	socket.on("JOIN_CHAT", ({ chatId, username }) => {
		console.log(`User ${username} joined the chat`);
		socket.join(username);
		socket.join(chatId);
		onlineUsers.push(username);
		io.to(chatId).except(username).emit("RECIPIENT_ONLINE");
		for (const user of onlineUsers) {
			io.to(chatId).except(user).emit("RECIPIENT_ONLINE");
		}
	});

	socket.on("SEND_MESSAGE", async ({ chatId, sender, message }) => {
		const date = new Date().toISOString();
		io.to(chatId).except(sender).emit("MESSAGE", { message, date });
		try {
			const savedMessage = await chatService.addMessage(
				chatId,
				sender,
				message
			);
			if (!savedMessage) {
				socket.emit("MESSAGE_ERROR", "Failed to save message"); // Notify client of error
				return;
			}
			// Broadcast the saved message to all clients in the chat room (including the sender)
			// io.to(chatId).emit("MESSAGE", savedMessage.messages[savedMessage.messages.length - 1]);
		} catch (error) {
			console.error("Error saving message:", error);
			socket.emit("MESSAGE_ERROR", "An error occurred"); // Notify client of error
		}
	});

	socket.on("TYPING", ({ chatId, sender }) => {
		socket.to(chatId).except(sender).emit("TYPING");
	});

	socket.on("disconnecting", () => {
		const rooms = Array.from(socket.rooms);
		rooms.forEach((room) => {
			onlineUsers = onlineUsers.filter((user) => user !== room);
			io.to(room).except(socket.id).emit("RECIPIENT_OFFLINE");
		});
	});
});

server.listen(PORT, () => {
	console.log(`Server runs at http://localhost:${PORT}`);
});
