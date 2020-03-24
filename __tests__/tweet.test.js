require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
describe('app routes', () => {
  beforeAll(() => {
    connect();
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  afterAll(() => {
    return mongoose.connection.close();
  });
  it('creates a new tweet', () => {
    return Tweet.create({
      handle: '@testtweet',
      text: 'test tweet'
    })
      .then(() => {
        request(app)
          .post('/api/v1/tweets')
          .then(res => {
            expect(res.body).toEqual({
              _id: expect.any(String),
              handle: '@testtweet',
              text: 'test tweet',
              __v: 0
            });
          });
      });
  });
  
  it('gets all tweets', () => {
    return Tweet.create([
      {
        handle: '@testing',
        text: 'testing'
      },
      {
        handle: '@testing',
        text: 'testing'
      },
      {
        handle: '@testing',
        text: 'testing'
      }
    ])
    .then(() => {
        request(app)
        .get('/api/v1/tweets')
        .then(res => {
            expect(res.body).toContainEqual({
              _id: expect.any(String),
              handle: expect.any(String),
              text: expect.any(String),
              __v: 0
        });
      });
  });
});

