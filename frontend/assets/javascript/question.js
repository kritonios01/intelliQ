//---Initializing variables

const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const questionnaireID = urlParam.get('questionnaireID');
const session = urlParam.get('session');
const questionURL = `https://api.intelliq.site/intelliq_api/questionnaire/${questionnaireID}`;
const question = document.getElementById("question");
const resultButton = document.getElementById('result');
let qdata;
const answer = new Map();
const optiontext = new Map();



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
    let currentqID = qdata.questions[0].qID;
    let currentOID= null;
    let selected =null;
    let nextqID =null;
    const qmap = new Map();
    for (let index = 0; index < qdata.questions.length; index++) {
        qmap.set(`${qdata.questions[index].qID}`,index);
    }


//--- Buttons Configuration

    const clr= document.getElementById('clr');
    clr.addEventListener('click', () =>{
        document.getElementById('sbt').setAttribute("disabled","disabled");
    });

//--- Adding Event Listener for sumbiting
    const myform = document.getElementById('myform');
    myform.addEventListener('submit',function(e){
        e.preventDefault();
        let id = qmap.get(currentqID);
        answer.set(currentqID,selected);
        for (let index = 0; index < qdata.questions[id].options.length; index++) {
            if(qdata.questions[id].options[index].opttxt=='<open string>'){
                optiontext.set(selected,selected);
            }
        }
        if(nextqID=='null'){
            showResults();
        }else{
            iterate(nextqID);
        }
    });

//--- Show Results Function
    function showResults(){
        console.log(optiontext);
        console.log(answer);
        const resultdiv=document.getElementById('questionnaire');
        resultdiv.innerHTML = `<ul id="results"></ul>`
        const mylist = document.getElementById('results');
        const iter=answer.entries();
        let ivalue=iter.next();
        while(!ivalue.done){
            const id = qmap.get(ivalue.value[0]);
            const text = qdata.questions[id].qtext;
            const otext = optiontext.get(ivalue.value[1]);
            console.log(otext);
            mylist.innerHTML +=`<li class="display-flex"><h4>${text}<h4> -> <h3 style="color: #0f420e;">${otext}</h3></li>`
            ivalue=iter.next();
        }
        resultButton.style.display="flex";
        resultButton.addEventListener('click', e=>{
            e.preventDefault;
            const iterator=answer.entries();
            let results=iterator.next();
            while(!results.done){
                const sessionURL=`https://api.intelliq.site/intelliq_api/doanswer/${questionnaireID}/${results.value[0]}/${session}/${results.value[1]}`
                fetch(sessionURL, {method: 'POST'})
                .then(res => res.json())
                .then(data=> console.log(data)) 
                .then(results=iterator.next())
            }
        })
    }
    
//--- Get Answers Function
    function getAnswer(qid){
        currentqID=qid;
        let selectedOptions=null;
        selectedOptions = document.getElementsByName('questionID');
        for(var radio of selectedOptions){
            if(radio.type=='text'){
                radio.addEventListener('keyup',()=>{
                    const txt= document.getElementsByName('questionID').value;
                    if(txt!=""){
                        document.getElementById('sbt').removeAttribute("disabled");
                    }else{
                        document.getElementById('sbt').setAttribute("disabled","disabled");
                    }
                })
            }
            radio.addEventListener('input',function(event){
                event.preventDefault();
                selected=event.target.value;
                if(event.target.type!='text'){
                    optiontext.set(selected,event.target.getAttribute("opttxt"));
                    currentOID=selected;
                }else{
                    currentOID=event.target.getAttribute("optid");
                }
                document.getElementById('sbt').removeAttribute("disabled");
                nextqID=event.target.getAttribute("nextqid");
            })
        }
    }
//---Render Questions

    function iterate(qid){
        let id = qmap.get(qid);
        document.getElementById('sbt').setAttribute("disabled","disabled");
        question.innerText = qdata.questions[id].qtext;
        const showoptions = document.getElementById("option-container");
        showoptions.innerHTML="";
        if(qdata.questions[id].required=='FALSE'){
            const skip = document.getElementById('skip');
            skip.style.display="flex";
            skip.addEventListener('click',event=>{
                event.preventDefault();
                if(id == qdata.questions.length -1){
                    console.log("showResults();");
                }else{
                    iterate(qdata.questions[id+1].qID);
                }
            });
        }
            for (let index = 0; index < qdata.questions[id].options.length; index++) {
                if(qdata.questions[id].options[index].opttxt=='<open string>'){
                    showoptions.innerHTML += `
                    <input type="text" optid="${qdata.questions[id].options[index].optID}" nextqid="${qdata.questions[id].options[0].nextqID}" name="questionID">
                    `
                }else{    
                showoptions.innerHTML += `
                <input type="radio" opttxt="${qdata.questions[id].options[index].opttxt}" nextqid="${qdata.questions[id].options[index].nextqID}" id="${index}" name="questionID" value="${qdata.questions[id].options[index].optID}">
                <label for="${index}">${qdata.questions[id].options[index].opttxt}</label><br>
                `
                }
            }
        
        getAnswer(qid);
    }
    //--- Start
    iterate(currentqID);
}



/*getNewQuestion
->Get asnwer
->Store answer
->Give next question based on nextqid
->If nextqid == null stop
*/

