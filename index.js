const express = require('express');
const Datastore = require('nedb');
const puppeteer = require('puppeteer');
const Twit = require("twit");
const p5 = require('node-p5');
require("dotenv").config();


const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

var mainTweetId = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
    runAnswers(data);
});

function runAnswers(data){
    database.count({ chosenQuestion: data.chosenQuestion }, function (err, count) {
        if(Number.isInteger(count/3)){

            publMainTweet(data.chosenQuestion);

            var roboAnswer = scraper(data.chosenResponse);
            roboAnswer.then(function(result) {
                database.find({ chosenQuestion: data.chosenQuestion }, function (err, docs) {
                    for (var i=count-1; i>count-4; i--){
                        console.log(docs[i].answer);
                        publTweet(docs[i].answer,mainTweetId);
                    }
                });
                var finalRoboAnswer = result.split(".");
                console.log(finalRoboAnswer[0]);
                publTweet(finalRoboAnswer[0],mainTweetId);
            })
        }
    });

}


const turingBot = new Twit({

    consumer_key: process.env.CONSUMER_KEY,

    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,

    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

function publMainTweet(tweet) {

    turingBot.post(

        'statuses/update',
        {status: tweet + " [Q" + makeid(3) + "]"},
        function(err, data, response) {

            if (err) {

                console.log("ERRO: " + err);
                return false;
            }

            mainTweetId=data.id_str;
            console.log(mainTweetId);

        }
    )
}

function publTweet(tweet,id) {

    turingBot.post(

        'statuses/update',
        {status: tweet, in_reply_to_status_id:id},
        function(err, data, response) {

            if (err) {

                console.log("ERRO: " + err);
                return false;
            }

        }
    )
}

async function scraper(chosenResponse) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://6b.eleuther.ai')

    await page.focus('.prompt-textarea')
    await page.keyboard.type(chosenResponse)

    await page.click('.button-primary')

    await page.waitForTimeout(30000).then(() => console.log('Waited a second!'));
    const name = await page.$eval('.result-text', el => el.innerText)
    await browser.close()
    return name;
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

let font;
font = p5.loadFont('font.ttf');

let resourcesToPreload = {
    fundo: p5.loadImage('papel.jpg')
}

let stringTest='The future of humanity is in the balance, but a group of five young adults has been born with a rare and deadly genetic mutation that gives them the power to help us save the planet';


function sketch(p, preloaded) {
    let fundo = preloaded.fundo;
    p.setup = () => {
        let canvas = p.createCanvas(675, 900);
        setTimeout(() => {
            p.saveCanvas(canvas, 'myCanvas', 'png').then(filename => {
                console.log(`saved the canvas as ${filename}`);
            });
        }, 100);
    }
    p.draw = () => {
        p.background(50);
        p.image(fundo,0,0);

        p.push();
        p.rotate(p.radians(getRandomInt(-3,3)));
        p.textFont(font);
        p.textSize(24);
        p.text('test [QU3E]', 500, 100);
        p.pop();

        p.push();
        p.rotate(p.radians(getRandomInt(-3,3)));
        p.textFont(font);
        p.textSize(60);
        p.text('What is the future of humanity?', 150, 150,450,300);
        p.pop();

        p.push();
        p.rotate(p.radians(getRandomInt(-3,3)));
        p.textFont(font);
        p.textSize(28 - 1000/stringTest.length);
        p.text(stringTest, 120, 350,500,300);
        p.pop();

        p.push();
        p.rotate(p.radians(getRandomInt(-3,3)));
        p.textFont(font);
        p.textSize(28 - 1000/stringTest.length);
        p.text('The future of humanity is a slow and painful death', 120, 475,500,300);
        p.pop();

        p.push();
        p.rotate(p.radians(getRandomInt(-3,3)));
        p.textFont(font);
        p.textSize(28 - 1000/stringTest.length);
        p.text('The future of humanity is a possibility which we can\'t predict', 120, 600,500,300);
        p.pop();

        p.push();
        p.rotate(p.radians(getRandomInt(-3,3)));
        p.textFont(font);
        p.textSize(28 - 1000/stringTest.length);
        p.text('The future of humanity is a peaceful utopia', 120, 725,500,300);
        p.pop();


    }
}

let p5Instance = p5.createSketch(sketch, resourcesToPreload);