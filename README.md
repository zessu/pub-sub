## Requirements

This is a nodejs project

You will need to have redis and nodejs on your computer.
Once you clone the project, run the following commands

1. `npm install`
2. `npm run impl1` or `npm run impl2` depending on the implementation you want to try out

## Implementation

Found some ambiguity in the listed problem. I decided to solve this by building out the two possibilities that I saw.

1. Implementation 1

    I decided to interpret the urls provided when subscribing to topics as actual clients expecting some kind of TCP connection using a websocket.

    So I keep a set of all clients for a certain topic and notify them using HTTP on their specified endpoints when a topic is published.


2. Implementation 2

    This is simple and straight forward. We publish topics. I use redis to manage the pub/sub


    When we receive a subscription through the api, we create a new subscriber and we ask it to listen for a topic then print through http://localhost:8000/event. Every time we publish a message, we get an output equal to the number of subscribers listening to that topic
