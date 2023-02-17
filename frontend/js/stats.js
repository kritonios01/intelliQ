//--- Endpooint config

import config from "./config/config.js";
const statsURL = `${config.api.base_url}/stats`;
let stats;

//--- Loader
const loader = document.querySelector(".loader");
const loaded = document.querySelector("#loaded");

//--- Fetch Data
async function getStats(url) {
    const res = await fetch(url);
    const data = await res.json();
    stats = data;
    loader.style.display = "none"
    loaded.style.display = "block"
    stats =Object.entries(stats.counts);
    init();
}
//--- Starting Function
function init(){
    for (let index = 0; index < 6; index++) {
        console.log(stats)
        const tabledata = document.getElementById(`td${index+1}`);
        tabledata.innerText=`${stats[index][1]}`
    }
}
//--- Starting Script
getStats(statsURL);
