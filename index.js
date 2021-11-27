const express = require('express');
const Datastore = require('nedb');
const puppeteer = require('puppeteer');
const Twit = require("twit");
require("dotenv").config();


const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

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
            database.find({ chosenQuestion: data.chosenQuestion }, function (err, docs) {
                for (var i=count-1; i>count-4; i--){
                    console.log(docs[i].answer);
                    publTweet(docs[i].answer);
                }
            });
            var roboAnswer = scraper(data.chosenQuestion);
            roboAnswer.then(function(result) {
                var finalRoboAnswer = result.split(".");
                console.log(finalRoboAnswer[0]);
                publTweet(finalRoboAnswer[0]);
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

function publTweet(tweet) {

    turingBot.post(

        'statuses/update',
        {status: tweet},
        function(err, data, response) {

            if (err) {

                console.log("ERRO: " + err);
                return false;
            }

            console.log("Sucess");

        }
    )
}

async function scraper(chosenQuestion) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://6b.eleuther.ai')

    await page.focus('.prompt-textarea')
    if (chosenQuestion==="Why are we self-conscious?") await page.keyboard.type("We are self conscious because")
    if (chosenQuestion==="Do we have free will?") await page.keyboard.type("We have free will")
    if (chosenQuestion==="What is the future of humanity?") await page.keyboard.type("The future of humanity is")
    if (chosenQuestion==="What are feelings?") await page.keyboard.type("Feelings are")

    await page.click('.button-primary')

    await page.waitForTimeout(30000).then(() => console.log('Waited a second!'));
    const name = await page.$eval('.result-text', el => el.innerText)
    await browser.close()
    return name;
}