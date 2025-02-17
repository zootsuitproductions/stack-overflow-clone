import MessageModel from '../../models/messages.model';
import { getMessages, saveMessage } from '../../services/message.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

const message1 = {
  msg: 'Hello',
  msgFrom: 'User1',
  msgDateTime: new Date('2024-06-04'),
};

const message2 = {
  msg: 'Hi',
  msgFrom: 'User2',
  msgDateTime: new Date('2024-06-05'),
};

describe('Message model', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('saveMessage', () => {
    beforeEach(() => {
      mockingoose.resetAll();
    });

    it('should return the saved message', async () => {
      mockingoose(MessageModel).toReturn(message1, 'create');

      const savedMessage = await saveMessage(message1);

      expect(savedMessage).toMatchObject(message1);
    });

    it('should return error when message is missing required fields', async () => {
      const invalidMessage = {
        msg: '',
        msgFrom: 'User1',
        msgDateTime: new Date('2024-06-04'),
      };

      const result = await saveMessage(invalidMessage);

      expect(result).toEqual({
        error: 'Error when saving message: Invalid message: missing required fields',
      });
    });
  });

  describe('getMessages', () => {
    it('should return all messages, sorted by date', async () => {
      mockingoose(MessageModel).toReturn([message2, message1], 'find');

      const messages = await getMessages();
      expect(messages).toMatchObject([message1, message2]);
    });

    it('should return empty array when database operation fails', async () => {
      mockingoose(MessageModel).toReturn(new Error('Database error'), 'find');

      const messages = await getMessages();

      expect(messages).toEqual([]);
    });
  });
});
