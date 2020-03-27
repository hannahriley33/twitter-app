require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const Comment = require('../lib/models/Comment');

describe('comment routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a comment', () => {
    return request(app)
      .post('/api/v1/comments')
      .send({
        tweetId: new mongoose.Types.ObjectId(),
        handle: 'my comment',
        text: 'this is a great comment'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: expect.any(String),
          handle: 'my comment',
          text: 'this is a great comment',
          __v: 0
        });
      });
  });

  it('gets a commment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'my comment',
      text: 'this is a great comment'
    });

    const comment = await Comment
      .create({
        tweetId: tweet._id,
        handle: 'tweetAllDay',
        text: 'all i do is tweet'
      });

    return request(app)
      .get(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: {
            ...tweet.toJSON(),
            _id: tweet.id
          },
          handle: 'tweetAllDay',
          text: 'all i do is tweet',
          __v: 0
        });
      });
  });

  it('updates a comment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'tweetweetweet',
      text: '140 characters'
    });

    const comment = await Comment
      .create({
        tweetId: tweet._id,
        handle: 'commenterssss',
        text: 'this comment has been updated'
      });

    return request(app)
      .patch(`/api/v1/comments/${comment._id}`)
      .send({ text: 'this comment has been updated' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: tweet.id,
          handle: 'commenterssss',
          text: 'this comment has been updated',
          __v: 0
        });
      });
  });

  it('deletes a comment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'ew',
      text: 'deletemycomment'
    });

    const comment = await Comment
      .create({
        tweetId: tweet._id,
        handle: 'deleteme',
        text: 'ewewew'
      });

    return request(app)
      .delete(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: tweet.id,
          handle: 'deleteme',
          text: 'ewewew',
          __v: 0
        });
      });
  });

});
