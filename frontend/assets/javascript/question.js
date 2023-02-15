//---Initializing variables

const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const questionnaireID = urlParam.get('questionnaireID');
const session = urlParam.get('session');
const questionURL = `https://api.intelliq.site/intelliq_api/questionnaire/${questionnaireID}`;
const question = document.getElementById("question");
let qdata;
const answer = new Map();

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
    console.log(qdata);
    const currentQuestion = qdata.questions[0].qID;
    const qmap = new Map();
    for (let index = 0; index < qdata.questions.length; index++) {
        qmap.set(`${qdata.questions[index].qID}`,index);
    }
    console.log(qmap);
    iterate(currentQuestion);

    

    function getAnswer(qid){
        console.log("Giving Answer for:",qid);
        let id = qmap.get(qid);
        let selected;
        let nextqID;
        const myform = document.getElementById('myform');
        myform.addEventListener('submit',function(e){
            e.preventDefault();
            const selectedOptions = document.getElementsByName('questionID');
            console.log(selectedOptions);
            for(var radio of selectedOptions){
                if(radio.checked){
                    console.log("radio id=",radio.id);
                    selected=radio.value;
                    answer.set(qid,selected);
                    console.log("Selected Value:",selected);
                    console.log("the question id current:",id);
                    nextqID=qdata.questions[id].options[radio.id].nextqID;
                    console.log("Next question ID that will be rendered:",nextqID);
                    iterate(nextqID);
                    break;
                }
            }
        })
    }

    function iterate(qid){
        let id = qmap.get(qid);
        console.log("Rendering:",qid);
        question.innerText = qdata.questions[id].qtext;
        const showoptions = document.getElementById("option-container");
        showoptions.innerHTML="";
        for (let index = 0; index < qdata.questions[id].options.length; index++) {
            showoptions.innerHTML += `
            <input type="radio" name="questionID" id="${index}" value="${qdata.questions[id].options[index].optID}">
            <label for="${index}">${qdata.questions[id].options[index].opttxt}</label><br>
            `
        }
        console.log("Requesting Answer for:",qid);
        getAnswer(qid);
    }
    
    function nextQuestion(qid){
        iterate(qmap.get(qid));
    }
}



/*getNewQuestion
->Get asnwer
->Store answer
->Give next question based on nextqid
->If nextqid == null stop
*/

