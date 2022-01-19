const express = require('express');
const Datastore = require('nedb');
const puppeteer = require('puppeteer');
const Twit = require("twit");
const p5 = require('node-p5');
const fs = require('fs');
require("dotenv").config();

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
var log_stderr = process.stderr;

console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
    log_stderr.write(util.format(d) + '\n');
};

var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err + "at line " + err.stack);
    log_file_err.write(util.format('Caught exception: '+err + "at line " + err.stack) + '\n');
});

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

var mainTweetId = 0;
var question;
var answers =[];
var testId = 'Test' + " [Q" + makeid(3) + "]";
var finalRoboAnswer
let p5Instance;

console.log(answers);

var scraperTest = scraper("Just testing");
scraperTest.then(function (result){
    console.log(result);
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
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
        function (err, data, response) {

            if (err) {

                console.log("ERRO: " + err);
                return false;
            }

            mainTweetId = data.id_str;
            console.log(mainTweetId);

        }
    )
}

function publTweet(tweet, id) {

    turingBot.post(
        'statuses/update',
        {status: tweet, in_reply_to_status_id: id},
        function (err, data, response) {

            if (err) {

                console.log("ERRO: " + err);
                return false;
            }

        }
    )
}

function publTweetPhoto(){
    var b64content = fs.readFileSync('myCanvas.png', {encoding: 'base64'})

    // first we must post the media to Twitter
    turingBot.post('media/upload', {media_data: b64content}, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        var mediaIdStr = data.media_id_string
        var meta_params = {media_id: mediaIdStr}

        turingBot.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                // now we can reference the media and post a tweet (media will attach to the tweet)
                var params = {status: testId, media_ids: [mediaIdStr]}

                turingBot.post('statuses/update', params, function (err, data, response) {
                    publTweet(answerMessages[getRandomInt(0,9)] + '"' + finalRoboAnswer[0] + '"', data.id_str);
                    console.log(data)
                })
            }
        })
    })
}

async function scraper(chosenResponse) {
    console.log("Scraper initializing");
    const browser = await puppeteer.launch({args: ['--no-sandbox','--disable-setuid-sandbox']});
    console.log("Scraper launched");
    const page = await browser.newPage()
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    await page.goto('https://6b.eleuther.ai')

    await page.focus('.prompt-textarea')
    await page.keyboard.type(chosenResponse)

    await page.click('.button-primary')

    await page.waitForTimeout(30000).then(() => console.log('Waited a second!'));
    const name = await page.$eval('.result-text', el => el.innerText)
    await browser.close()
    console.log("name");
    return name;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

let font;
font = p5.loadFont('font.ttf');

let messages = ["Subject #1 was strange...", "Subject #2 was strange...", "Subject #3 was strange...", "Subject #4 was strange...", "The lack of criativity!", "Intresting", "(???)", "WTF!?", "Suspicious...", "Weird choice of words", "AHAHAHHAHAHA", "Really?", "Good point!", "No idea what this means", "This one didn't go well...", "Exciting!"]
let answerMessages = ["I'm pretty sure it was the 'guy' that said ", "I can't believe no one thought of ", "Surprisingly, the robot really said ", "No one would say that a human really said ", "Wow! That's incredible: ", "I couldn't help but laught at this one: ", "Seriously? Who would say this? ", "This one is incredibly profound: ", "Such a beautiful answer: "]

function sketch(p, preloaded) {

    let fundos = ["p5/fundo-03.png","p5/fundo-04.png","p5/fundo-05.png","p5/fundo-06.png","p5/fundo-07.png","p5/fundo-08.png","p5/fundo-09.png"]
    let doodles = ["p5/doodle1.png", "p5/doodle2.png", "p5/doodle3.png", "p5/doodle4.png", "p5/doodle5.png", "p5/doodle6.png", "p5/doodle7.png", "p5/doodle8.png", "p5/doodle9.png", "p5/doodle10.png", "p5/doodle11.png", "p5/doodle12.png", "p5/doodle13.png"]
    p.setup = () => {
        let canvas = p.createCanvas(675, 900);
        p.loadImage(fundos[getRandomInt(0, 7)]).then(img => {
            setTimeout(() => {
                p.image(img, 0, 0, 675,900)
            }, 2000);
        })


        if (Math.random() > 0.8) {
            p.loadImage(doodles[getRandomInt(0, 13)]).then(img => {
                setTimeout(() => {
                    p.image(img, [getRandomInt(50, 400)], 75, 85, 81);
                }, 3000);
            })
        }

        if (Math.random() > 0.8) {
            p.loadImage(doodles[getRandomInt(0, 13)]).then(img => {
                setTimeout(() => {
                    p.image(img, [getRandomInt(50, 400)], 775, 85, 81);
                }, 3000);
            })
        }

        setTimeout(() => {
            //IDENTIFICAÇÃO
            p.push();
            p.rotate(p.radians(getRandomInt(-1, 1)));
            p.textFont(font);
            p.textSize(24);
            p.text(testId, 500, 100);
            p.pop();

            //TÍTULO
            p.push();
            p.rotate(p.radians(getRandomInt(-4, 4)));
            p.textFont(font);
            p.textSize(60);
            p.textLeading(60);
            p.text(question, 150, 175, 450, 300);
            p.pop();

            //MENSAGEM ALEATORIA #1
            if (Math.random() > 0.75) {
                p.push();
                p.rotate(p.radians(getRandomInt(-1, 1)));
                p.textFont(font);
                p.textSize(24);
                p.text(messages[getRandomInt(0, 13)], getRandomInt(400, 500), 150,150);
                p.pop();
            }

            shuffle(answers);
            console.log("Answers in sketch: " + answers);

            //RESPOSTA #1
            p.push();
            p.rotate(p.radians(getRandomInt(-3, 3)));
            p.textFont(font);
            p.textSize(64);
            p.text(".", 100, 375);
            p.textSize(36 - answers[0].length / 15);
            p.text(answers[0], 120, 350, 500, 300);
            p.pop();

            //MENSAGEM ALEATORIA #2
            if (Math.random() > 0.75) {
                p.push();
                p.rotate(p.radians(getRandomInt(-1, 1)));
                p.textFont(font);
                p.textSize(18);
                p.text(messages[getRandomInt(0, 13)], getRandomInt(400, 500), 550);
                p.pop();
            }

            //RESPOSTA #2
            p.push();
            p.rotate(p.radians(getRandomInt(-3, 3)));
            p.textFont(font);
            p.textSize(64);
            p.text(".", 100, 500);
            p.textSize(36 - answers[1].length / 15);
            p.text(answers[1], 120, 475, 500, 300);
            p.pop();

            //MENSAGEM ALETÓRIA #3
            if (Math.random() > 0.75) {
                p.push();
                p.rotate(p.radians(getRandomInt(-1, 1)));
                p.textFont(font);
                p.textSize(18);
                p.text(messages[getRandomInt(0, 13)], getRandomInt(400, 500), 700);
                p.pop();
            }

            //RESPOSTA #3
            p.push();
            p.rotate(p.radians(getRandomInt(-3, 3)));
            p.textFont(font);
            p.textSize(64);
            p.text(".", 100, 625);
            p.textSize(36 - answers[2].length / 15);
            p.text(answers[2], 120, 600, 500, 300);
            p.pop();

            //MENSAGEM ALEATÓRIA #4
            if (Math.random() > 0.75) {
                p.push();
                p.rotate(p.radians(getRandomInt(-1, 1)));
                p.textFont(font);
                p.textSize(18);
                p.text(messages[getRandomInt(0, 13)], getRandomInt(400, 500), 800);
                p.pop();
            }

            //RESPOSTA #4
            p.push();
            p.rotate(p.radians(getRandomInt(-3, 3)));
            p.textFont(font);
            p.textSize(64);
            p.text(".", 100, 750);
            p.textSize(36 - answers[3].length / 15);
            p.text(answers[3], 120, 725, 500, 300);
            p.pop();
        }, 10000);

        setTimeout(() => {
            p.saveCanvas(canvas, 'myCanvas', 'png').then(filename => {
                console.log(`saved the canvas as ${filename}`);
            });
        }, 15000);
    }

    p.draw = () => {


    }
}

app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
    console.log(data);
    runAnswers(data);
});

function runAnswers(data) {
    database.count({chosenQuestion: data.chosenQuestion}, function (err, count) {
        if (Number.isInteger(count / 3)) {
            console.log("Process initiated!");

            //publMainTweet(data.chosenQuestion);
            testId = 'Test' + " [Q" + makeid(3) + "]";
            question = data.chosenQuestion;

            var roboAnswer = scraper(data.chosenResponse);
            roboAnswer.then(function (result) {
                database.find({chosenQuestion: data.chosenQuestion}, function (err, docs) {
                    answers[0] = docs[count - 1].answer;
                    answers[1] = docs[count - 2].answer;
                    answers[2] = docs[count - 3].answer;
                });
                finalRoboAnswer = result.split(".");
                // publTweet(finalRoboAnswer[0],mainTweetId);
                answers[3] = finalRoboAnswer[0];
                console.log(answers[3]);


            })

            setTimeout(() => {
                p5Instance = p5.createSketch(sketch);
            }, 60000);

            setTimeout(() => {
                publTweetPhoto();
            }, 90000);

        }

    });




}


