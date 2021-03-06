/**
 * Tipado para crear los esquemas en MongoDB
 */
import { Document } from "mongoose";

export interface IBienvenidas extends Document {
	guildID: string;
	channelID: string;
	imageURL: string;
}

export interface IRecordatorios extends Document {
	channelID: string;
	userID: string;
	message: string;
	time: number;
}

export interface IAfk extends Document {
	userID: string;
	reason: string;
	time: number;
}
