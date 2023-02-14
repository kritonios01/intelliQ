const queryString = window.location.search;
const urlParam = new URLSearchParams(queryString);
const questionnaireID = urlParam.get('questionnaireID');
const session = urlParam.get('session');
const questionURL = `https://api.intelliq.site/intelliq_api/questionnaire/${questionnaireID}`;
console.log(questionnaireID);
console.log(session);
const question = document.getElementById("question");


async function getapi(url){
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    console.log(data.questions[0].qtext);
    question.innerText = data.questions[0].qtext;
}
getapi(questionURL);
