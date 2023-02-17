import config from "./config/config.js";

const questionnnaireURL = `${config.api.base_url}/questionnaires`;
const dataConst = document.querySelector("#questn");
const mainMessage = document.getElementById('pick');
//--- Loader
const loader = document.querySelector(".loader");
const loaded = document.querySelector("#loaded");

//--- Fetch data from API
fetcher();

function fetcher() {
    fetch(questionnnaireURL)
        .then((res) => {
            if (res.status == 204) {
                loader.style.display = "none";
                mainMessage.innerText = "No Questionnaires Available"
            } else {
                res.json()
            }
        })
        .then((data) => {
            toHTML(data);
            loader.style.display = "none";
            loaded.style.display = "flex";
        })
        .then(enableBtn);
}

//--- Render HTML document
function toHTML(data) {
    data.forEach((qsn) => {
        dataConst.innerHTML += `
        <tr>
        <td><input type = "radio" name="questionnaireID" value="${qsn.questionnaireID}" id="${qsn.questionnaireID}"><td>
        <label style="width: 100%; height:100%;"for="${qsn.questionnaireID}">${qsn.questionnaireID}</label>
        <td><label style="width: 100%; height:100%;"for="${qsn.questionnaireID}">${qsn.questionnaireTitle}</label></td>
        </tr>
        `;
    });
}

//--- Enable button only after user selects a questionnaire
function enableBtn() {
    const qopt = document.querySelectorAll(
        'input[type=radio][name="questionnaireID"]'
    );
    qopt.forEach((radio) =>
        radio.addEventListener("change", () => {
            document.getElementById("sbt").removeAttribute("disabled");
        })
    );
}


//--- Create new session for selected questionnaire and redirect user
let selectedID;
const myform = document.getElementById("form");
myform.addEventListener("submit", function(e) {
    e.preventDefault();
    const questionnaires = document.getElementsByName("questionnaireID");
    for (var radio of questionnaires) {
        if (radio.checked) {
            selectedID = radio.value;
        }
    }
    const sessionURL = `${config.api.base_url}/newsession/${selectedID}`;
    fetch(sessionURL, { method: "POST" })
        .then((res) => res.json())
        .then(
            (data) =>
            (document.location.href = `../questionnaire?questionnaireID=${selectedID}&session=${data.session}`)
        );
});