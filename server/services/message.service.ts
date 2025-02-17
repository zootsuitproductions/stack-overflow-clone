import MessageModel from '../models/messages.model';
import { Message, MessageResponse } from '../types/types';

/**
 * Saves a new message to the database.
 *
 * @param {Message} message - The message to save
 *
 * @returns {Promise<MessageResponse>} - The saved message or an error message
 */
export const saveMessage = async (message: Message): Promise<MessageResponse> => {
  try {
    if (!message.msg || !message.msgFrom || !message.msgDateTime) {
      throw new Error('Invalid message: missing required fields');
    }
    const result = await MessageModel.create(message);
    return result;
  } catch (error) {
    return { error: `Error when saving message: ${(error as Error).message}` };
  }
};

/**
 * Retrieves all messages from the database, sorted by date in ascending order.
 *
 * @returns {Promise<Message[]>} - An array of messages. If an error occurs, an empty array is returned.
 */
export const getMessages = async (): Promise<Message[]> => {
  try {
    const messages = await MessageModel.find().sort({ msgDateTime: -1 });
    return messages.reverse();
  } catch (error) {
    return [];
  }
};
