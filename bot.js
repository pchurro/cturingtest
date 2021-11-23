var Twit = require("twit");

require("dotenv").config();

const turingBot = new Twit({

    consumer_key: process.env.CONSUMER_KEY,

    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,

    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

function publTweet() {

    var postTweet = "O Professor Tiago é o maior";
    turingBot.post(

        'statuses/update',
        {status: postTweet},
        function(err, data, response) {

            if (err) {

                console.log("ERRO: " + err);
                return false;
            }

            console.log("Sucess");

        }
    )
}

publTweet();