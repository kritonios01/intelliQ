 const questionnnaireURL="https://api.intelliq.site/intelliq_api/questionnaires";
 const dataConst = document.querySelector("#questn");

 fetcher();
 
 function fetcher(){
    fetch(questionnnaireURL)
    .then( res  => res.json())
    .then( data => toHTML(data))
 }
 
 function toHTML(data){
    data.forEach( (qsn) =>{
        dataConst.innerHTML +=`
        <tr>
        <td><input type = "radio" name="questionnaireID" value="${qsn.questionnaireID}"><td>
        <td>${qsn.questionnaireID}<td>
        <td>${qsn.questionnaireTitle}<td>
        <tr>
        `
    })
 }
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
    .then(data =>console.log(data))
});