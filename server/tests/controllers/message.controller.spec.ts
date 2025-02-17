import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../../app';
import * as util from '../../services/message.service';

const saveMessageSpy = jest.spyOn(util, 'saveMessage');
const getMessagesSpy = jest.spyOn(util, 'getMessages');

describe('POST /addMessage', () => {
  it('should add a new message', async () => {
    const validId = new mongoose.Types.ObjectId();
    const message = {
      _id: validId,
      msg: 'Hello',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    saveMessageSpy.mockResolvedValue(message);

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: message._id.toString(),
      msg: message.msg,
      msgFrom: message.msgFrom,
      msgDateTime: message.msgDateTime.toISOString(),
    });
  });

  it('should return bad request error if messageToAdd is missing', async () => {
    const response = await supertest(app).post('/messaging/addMessage').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  it('should return 500 if saveMessage service returns an error', async () => {
    const message = {
      msg: 'Sup',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    saveMessageSpy.mockResolvedValue({
      error: 'Error when saving message: Invalid message: missing required fields',
    });

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(500);
  });

  it('should return 400 for empty message text', async () => {
    const message = {
      msg: '',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });

  it('should return 400 for missing msgFrom', async () => {
    const message = {
      msg: 'Balls',
      msgFrom: '',
      msgDateTime: new Date('2024-06-04'),
    };

    const response = await supertest(app)
      .post('/messaging/addMessage')
      .send({ messageToAdd: message });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid message body');
  });
});

describe('GET /getMessages', () => {
  it('should return all messages', async () => {
    const message1 = {
      msg: 'Wazzaaa',
      msgFrom: 'User1',
      msgDateTime: new Date('2024-06-04'),
    };

    const message2 = {
      msg: 'Sup cuh',
      msgFrom: 'User2',
      msgDateTime: new Date('2024-06-05'),
    };

    getMessagesSpy.mockResolvedValue([message1, message2]);

    const response = await supertest(app).get('/messaging/getMessages');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        msg: message1.msg,
        msgFrom: message1.msgFrom,
        msgDateTime: message1.msgDateTime.toISOString(),
      },
      {
        msg: message2.msg,
        msgFrom: message2.msgFrom,
        msgDateTime: message2.msgDateTime.toISOString(),
      },
    ]);
  });

  it('should handle empty message list', async () => {
    getMessagesSpy.mockResolvedValue([]);

    const response = await supertest(app).get('/messaging/getMessages');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return 500 if getMessages service throws an error', async () => {
    getMessagesSpy.mockRejectedValue(new Error('Database error'));

    const response = await supertest(app).get('/messaging/getMessages');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when fetching messages: Database error');
  });
});
