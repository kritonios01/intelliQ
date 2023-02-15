//---Initializing variables

const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const questionnaireID = urlParam.get('questionnaireID');
const session = urlParam.get('session');
const questionURL = `https://api.intelliq.site/intelliq_api/questionnaire/${questionnaireID}`;
const question = document.getElementById("question");
let qdata;

//---GET all the data we want from Endpoints----

getquestions(questionURL);

async function getquestions(url){
    const res = await fetch(url);
    const data = await res.json();
    qdata = data;
    getoptions();
}
async function getoptions(){
    for(let index = 0;index < qdata.questions.length;index++){
        const res = await fetch(`https://api.intelliq.site/intelliq_api/question/${questionnaireID}/${qdata.questions[index].qID}`);
        const data = await res.json();
        qdata.questions[index].options = data.options;
    }
    init()
}
//---Starting Questionnaire

function init(){
    let qcounter =0;
    iterate(3);
}
function iterate(id){
    question.innerText=qdata.questions[id].qtext;
    const showoptions = document.getElementById("option-container");
    for (let index = 0; index < qdata.questions[id].options.length; index++) {
        showoptions.innerHTML += `
        <input type="radio" name="questionID" id="${index}" value="${qdata.questions[id].options[index].optID}">
        <label for="${index}">${qdata.questions[id].options[index].opttxt}</label><br>
        `
    }
}
let selected;
let nextqID;
const myform = document.getElementById('myform');
myform.addEventListener('submit',function(e){
    e.preventDefault();
    const selectedOptions = document.getElementsByName('questionID');
    console.log(selectedOptions);
    for(var radio of selectedOptions){
        if(radio.checked){
            selected=radio.value;
            nextqID=qdata.questions[3].options[radio.id].nextqID;
            console.log(selected);
            console.log(nextqID);
            break;
        }
    }
})
/*getNewQuestion
->Get asnwer
->Store answer
->Give next question based on nextqid
->If nextqid == null stop
*/
function getNewQuestion(id){
    const myform = document.getElementById('myform');
myform.addEventListener('submit',function(e){
    e.preventDefault();
    const selectedOptions = document.getElementsByName('questionID');
    console.log(selectedOptions);
    for(var radio of selectedOptions){
        if(radio.checked){
            selected=radio.value;
            nextqID=qdata.questions[3].options[radio.id].nextqID;
            console.log(selected);
            console.log(nextqID);
            break;
        }
    }
})
}
