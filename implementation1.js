const express = require('express');
const redis = require('redis');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const axios = require('axios');
const { response } = require('express');

const app = express();
const router = express.Router();
const apiUrl = 'http://localhost:8000/';

app.use(bodyParser.json());
app.use(router);

router.get('/', (req, res) => {
  res.send(`Hi!`);
});

const checkValid = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

router.get(
  '/publish/:topic',
  [body('message').isString(), checkValid],
  (req, res) => {
    const topic = req.params.topic;
    const message = req.body.message;
    const client = redis.createClient();
    // go through all clients and send the http message
    // we are assuming there are clients sitting here
    client.smembers(topic, (err, reply) => {
      reply.forEach(async (url) => {
        return await axios
          .post(url, { message: message })
          .then((res) => console.log(res.data))
          .catch((error) => console.log(`Error talking with subscribers`));
      });
    });
    res.send(`Published event for ${topic}`);
  }
);

router.get(
  '/subscribe/:topic',
  [body('url').isString(), checkValid],
  (req, res) => {
    const topic = req.params.topic;
    const url = req.body.url;

    const client = redis.createClient();
    client.sadd(topic, url); // add to set with key as channel
    res.send(`Subscribed ${url} to channel: ${topic}`);
  }
);

app.listen(8000, () => {
  console.log(`Server is listening on ${apiUrl}`);
});
