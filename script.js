var questions = ["Do we have free will?", "What is the future of humanity?", "Why are we self-conscious?", "What are feelings?"];

var questionElement = document.getElementById("question");

questionElement.textContent=questions[getRandomInt(0,3)];

var form=document.forms["form"];

function saveAnswer(){
    console.log("Sucesso");
    //NODEJS guardar para ficheiro
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

