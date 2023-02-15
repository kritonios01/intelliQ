const questionnnaireURL="https://api.intelliq.site/intelliq_api/questionnaires";
const dataConst = document.querySelector("#questn");

//--- Add loader
const loader = document.querySelector(".loader");
const loaded = document.querySelector("#loaded");

//---Get data from endpoint

fetcher();
 
function fetcher(){
    fetch(questionnnaireURL)
    .then( res  => res.json())
    .then( data => toHTML(data))
    .then (enableBtn)
    loader.style.display="none"
    loaded.style.display="flex"
}
 
//---Render Data to html
function toHTML(data){
    data.forEach( (qsn) =>{
        dataConst.innerHTML +=`
        <tr>
        <td><input type = "radio" name="questionnaireID" value="${qsn.questionnaireID}" id="${qsn.questionnaireID}"><td>
        <label style="width: 100%; height:100%;"for="${qsn.questionnaireID}">${qsn.questionnaireID}</label>
        <td><label style="width: 100%; height:100%;"for="${qsn.questionnaireID}">${qsn.questionnaireTitle}</label></td>
        </tr>
        `
    })

}

//--- Function to enable button only after user selects Questionnaires
function enableBtn(){
    const qopt = document.querySelectorAll('input[type=radio][name="questionnaireID"]');
    qopt.forEach(radio=> radio.addEventListener('change',() => {
        document.getElementById('sbt').removeAttribute("disabled");
        console.log("enabled button");
    }));
}

//--- POST selected QuestionnaireID to the endpoint
let selectedID;
const myform = document.getElementById('form');
myform.addEventListener('submit', function(e){
    e.preventDefault();
    const questionnaires = document.getElementsByName('questionnaireID');
    for(var radio of questionnaires){
        if (radio.checked){
            selectedID=radio.value;
        }
    }
    const sessionURL=`https://api.intelliq.site/intelliq_api/newsession/${selectedID}`
    fetch(sessionURL, {method: 'POST'})
    .then(res => res.json())
    .then(data =>document.location.href=`./question.html?questionnaireID=${selectedID}&session=${data.session}`)
});