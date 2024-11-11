import {apiKey} from './export.js';
import {checkSkillsMatch} from '../SkillsMatcher.js';

const SCOPE = "https://scope.sciencecoop.ubc.ca/myAccount/co-op/postings.htm";

const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const fileList = document.getElementById("file-list")
const skillList = document.getElementById("skill-list")

inputFile.addEventListener("change", uploadFile);

document.addEventListener('DOMContentLoaded', checkAndDisplayStoredData);

function checkAndDisplayStoredData() {
    chrome.storage.local.get(['fileName', 'skills'], function (result) {
        if (result.fileName) {
            if (fileList.children.length === 1) {
                fileList.innerHTML = '';
            }
            const fileItem = document.createElement("div");
            fileItem.classList.add("file-item");
            fileItem.textContent = `${result.fileName} • Uploaded`;
            fileList.appendChild(fileItem);

            console.log('Stored skills:', result.skills);
        }
    });
}

function updateFileDisplay(fileName, status) {
    if (fileList.children.length === 1) {
        fileList.innerHTML = '';
    }
    const fileItem = document.createElement("div");
    fileItem.classList.add("file-item");
    fileItem.textContent = `${fileName} • ${status}`;
    fileList.appendChild(fileItem);
}

function updateSkillDisplay(skills) {
    if (skillList.children.length > 0) {
        skillList.innerHTML = '';
    }
    const title = document.createElement('h3');
    title.textContent = 'Matched skills:';  // Set the title text
    const ul = document.createElement('ul');

    skills.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        ul.appendChild(li);
    });

    skillList.appendChild(title);
    skillList.appendChild(ul);
}

function uploadFile() {
    let file = inputFile.files[0];
    console.log("File received.");
    updateFileDisplay(file.name, 'Uploaded');

    const formData = new FormData();

    // Append a file to the form data (example file input from a file input field)
    formData.append("file_name", file);


    // Send the form data using fetch
    fetch("https://api.superparser.com/parse", {
        method: "POST",
        headers: {
            "X-API-KEY": apiKey
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const skills = data.data.skills.overall_skills;
            const fileName = file.name;
            // console.log(skills);
            chrome.storage.local.set({skills, fileName}, function () {
                console.log('Value is set to ' + skills + fileName);
                updateFileDisplay(file.name, 'Uploaded');
            });
        })
        .catch(error => {
            updateFileDisplay(file.name, 'Could not parse');
            console.error("error: ", error);
        });
}

dropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
});

dropArea.addEventListener("drop", function (e) {
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadFile();
});

/* Set for initial active tab when open the sidepanel */
(async () => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    getPageContent(tab);
})();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.active) {
            getPageContent(tab);
        }
    }
);

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab.active) {
        getPageContent(tab);
    }
});

function getPageContent(tab) {
    console.log("======= active tab url", tab.url);
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: getLiContent
    }, (result) => {
        if (result && result[0]) {
            const liList = JSON.parse(result[0].result);  // Parse the JSON string
            chrome.storage.local.get(['fileName', 'skills'], function (storageResult) {
                // Destructure the result to get skills and fileName
                const {skills, fileName} = storageResult;

                // Check if we got the skills and fileName
                if (skills) {
                    const {matchNum, matches} = checkSkillsMatch(skills, liList);
                    // These are available because they're inside the callback now
                    console.log("Match Number:", matchNum);
                    console.log("Matched Skills:", matches);
                    updateSkillDisplay(matches);
                } else {
                    console.log('No skills found in storage.');
                }
            });
        } else {
            console.log('No li elements found.');
        }
    });
}


function getLiContent() {
    var liElements = document.getElementsByTagName('li');
    var liContents = Array.from(liElements).map(li => li.textContent.trim());
    return JSON.stringify(liContents); // Returning the content as JSON string
}
