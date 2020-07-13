const express = require('express');
const redis = require('redis');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const axios = require('axios');
const { response } = require('express');

const app = express();
const router = express.Router();
const apiUrl = 'http://localhost:8000/';
const apiUrl2 = 'http://localhost:8000/event';

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

const checkUrl = (req, res, next) => {};

router.get(
  '/publish/:topic',
  [body('message').isString(), checkValid],
  (req, res) => {
    const topic = req.params.topic;
    const message = req.body.message;
    const publisher = redis.createClient();
    publisher.publish(topic, JSON.stringify(message));
    res.send(`Published event for ${topic}`);
  }
);

router.get(
  '/subscribe/:topic',
  [body('url').isString(), checkValid],
  (req, res) => {
    const topic = req.params.topic;
    const url = req.body.url;

    const publisher = redis.createClient();
    publisher.subscribe(topic);
    publisher.on('message', (channel, message) => {
      return axios
        .post(apiUrl2, { message: message })
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error));
    });
    res.send(`Subscribed to ${topic}`);
  }
);

router.post('/event', [body('message').isString(), checkValid], (req, res) => {
  const message = req.body.message;
  res.json(`${message}`);
});

app.listen(8000, () => {
  console.log(`Server is listening on ${apiUrl}`);
});
