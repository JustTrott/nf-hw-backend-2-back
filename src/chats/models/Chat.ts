import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
	participants: string[];
	messages: {
		sender: string;
		message: string;
		date: Date;
	}[];
}

const ChatSchema: Schema = new Schema({
	participants: { type: [String], required: true },
	messages: [
		{
			sender: { type: String, required: true },
			message: { type: String, required: true },
			date: { type: Date, required: true },
		},
	],
});

export default mongoose.model<IChat>("Chat", ChatSchema);
