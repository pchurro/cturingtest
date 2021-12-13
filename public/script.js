var questions = ["What is the meaning of life?", "What is the future of humanity?", "Why are we self-conscious?", "What are feelings?", "What’s the difference between living and existing?", "What is the universal language?", "How do we measure our lives?", "How do you perceive yourself?"];
var responses = ["The meaning of life is", "The future of humanity is", "We are self-conscious because", "Feelings are", "The difference between living and existing is", "The universal language is", "We measure our lives by", "I perceive myself as"]
var questionElement = document.getElementById("question");
var inputElement = document.getElementById("response");

var randQ= getRandomInt(0,8);
var chosenQuestion = questions[randQ];
var chosenResponse = responses[randQ];
questionElement.textContent= chosenQuestion;
inputElement.value=chosenResponse;



var form=document.forms["form"];

async function saveAnswer(){
    console.log("Sucesso");
    var answer = form['answer'].value;

    const data = { chosenQuestion, chosenResponse, answer };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    const response = await fetch('/api', options);
    const json = await response.json();
    alert( sucessMessages[getRandomInt(0,7)] );
    window.location.reload();
    console.log(json);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let sucessMessages = ["Okay, weirdo!", "Your (strange) answer was registed sucessfully", "Really? Okay, I guess...", "I wouldn't really put it that way, but fine.", "If you really say so...", "I really don't agree with you, but thank you!", "What???"]
