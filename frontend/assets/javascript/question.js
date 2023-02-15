//---Initializing variables

const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const questionnaireID = urlParam.get('questionnaireID');
const session = urlParam.get('session');
const questionURL = `https://api.intelliq.site/intelliq_api/questionnaire/${questionnaireID}`;
const question = document.getElementById("question");
let qdata;
const answer = new Map();

//--- Add loader
const loader = document.querySelector(".loader");
const loaded = document.querySelector("#loaded");
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
    loader.style.display="none"
    loaded.style.display="flex"
    init()
}
//---Starting Questionnaire

function init(){
    console.log(qdata);
    const currentQuestion = qdata.questions[0].qID;
    let selected =null;
    let nextqID =null;
    const qmap = new Map();
    for (let index = 0; index < qdata.questions.length; index++) {
        qmap.set(`${qdata.questions[index].qID}`,index);
    }
    //console.log(qmap);
    enableBtn;
    iterate(currentQuestion);

//--- Adding Event Listener for sumbiting
    const myform = document.getElementById('myform');
    myform.addEventListener('submit',function(e){
        e.preventDefault();
        //console.log("Sumbited",selected);
        console.log(answer);
        //console.log("Next question:",nextqID);
        iterate(nextqID);
    });
//--- Function to enable Button after checking an answer
    function enableBtn(){
        const qopt = document.querySelectorAll('[name="questionID"]');
        qopt.forEach(radio=> radio.addEventListener('change',() => {
            document.getElementById('sbt').removeAttribute("disabled");
            console.log("enabled button");
        }));
    }


    function getAnswer(qid){
        //console.log("Giving Answer for:",qid);
        //console.log("Map result:",questid);
        let selectedOptions=null;
        selectedOptions = document.getElementsByName('questionID');
        //console.log(selectedOptions);
        for(var radio of selectedOptions){
            radio.addEventListener('input',function(event){
                event.preventDefault();
                document.getElementById('sbt').removeAttribute("disabled");
                console.log(event.target.getAttribute("nextqid"));
                selected=event.target.value;
                nextqID=event.target.getAttribute("nextqid");
                //console.log(event.target);
                //console.log("New current value=",selected);
                //console.log("Next qID=",nextqID);
            })
        }
    }

    function iterate(qid){
        let id = qmap.get(qid);
        document.getElementById('sbt').setAttribute("disabled","disabled");
        //console.log("Rendering:",qid);
        question.innerText = qdata.questions[id].qtext;
        const showoptions = document.getElementById("option-container");
        showoptions.innerHTML="";
        if(qdata.questions[id].required=='TRUE'){
            //console.log(qdata.questions[id].options.length==1);
            if(qdata.questions[id].options.length ==1 && qdata.questions[id].options[0].opttxt=='<open string>'){
                showoptions.innerHTML += `
                <input type="text" nextqid="${qdata.questions[id].options[0].nextqID}">
                `
            }else{
                for (let index = 0; index < qdata.questions[id].options.length; index++) {
                    showoptions.innerHTML += `
                    <input type="radio" nextqid="${qdata.questions[id].options[index].nextqID}" id="${index}" name="questionID" value="${qdata.questions[id].options[index].optID}">
                    <label for="${index}">${qdata.questions[id].options[index].opttxt}</label><br>
                    `
                }
            }
            getAnswer(qid);
        }else{}
    }
    
}



/*getNewQuestion
->Get asnwer
->Store answer
->Give next question based on nextqid
->If nextqid == null stop
*/

