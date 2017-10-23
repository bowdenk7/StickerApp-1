const bodyParser = require('body-parser');
const express = require('express');

const router = new express.Router();
router.use(bodyParser.json());

router.get('/', function stickerRouteBrowse(req, res) {
    //console.log('Render values: ', renderData);
    
    const renderData = { pageTitle: 'Browse', entry: 'browse', cookedSentiment: getSentimentAnalysis() };
    res.render('index', renderData);
});

function getSentimentAnalysis() {
    // Demo code below
    // query to pull tweets + sentiment from graph
    let rawSentiment = [
        {
            text: 'I love #hotel360!!!',
            score: 9
        },
        {
            text: '#hotel360 is the worst!',
            score: 2
        }
    ];

    // we need to add an emotion to each tweet so we know which icon to use on client
    let cookedSentiment = [];
    for (let tweet of rawSentiment) {
        if (tweet.score > 7) {
            tweet.emotion = 'happy';
        } else {
            tweet.emotion = 'sad';
        }
        cookedSentiment.push(tweet);
    }
    return cookedSentiment;
}

const db = require('../db');
router.get('/api/items', function stickerRouteApiBrowse(req, res) {
    let tags;
    if (req.query.tags) {
        tags = req.query.tags.split(',');
    }

    db.getStickers(tags).then((items) => {
        console.info('%d stickers found', items.length);
        if (tags) {
            console.log('Tags used in filter: ', tags);
        }

        res.send({ items });
    }, () => {
        res.send({ items: [] });
    });
});

module.exports = router;