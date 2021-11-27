var questions = ["Do we have free will?", "What is the future of humanity?", "Why are we self-conscious?", "What are feelings?"];

var questionElement = document.getElementById("question");
var chosenQuestion = questions[getRandomInt(0,3)];
questionElement.textContent= chosenQuestion;

var form=document.forms["form"];

async function saveAnswer(){
    console.log("Sucesso");
    var answer = form['answer'].value;
    const data = { chosenQuestion, answer };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', options);
    const json = await response.json();
    console.log(json);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

