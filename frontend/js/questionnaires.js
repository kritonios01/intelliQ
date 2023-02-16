const questionnnaireURL =
    "https://api.intelliq.site/intelliq_api/questionnaires";
const dataConst = document.querySelector("#questn");

//--- Loader
const loader = document.querySelector(".loader");
const loaded = document.querySelector("#loaded");

//--- Fetch data from API
fetcher();

function fetcher() {
    fetch(questionnnaireURL)
        .then((res) => res.json())
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
myform.addEventListener("submit", function (e) {
    e.preventDefault();
    const questionnaires = document.getElementsByName("questionnaireID");
    for (var radio of questionnaires) {
        if (radio.checked) {
            selectedID = radio.value;
        }
    }
    const sessionURL = `https://api.intelliq.site/intelliq_api/newsession/${selectedID}`;
    fetch(sessionURL, { method: "POST" })
        .then((res) => res.json())
        .then(
            (data) =>
                (document.location.href = `./question.html?questionnaireID=${selectedID}&session=${data.session}`)
        );
});