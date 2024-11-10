import { apiKey } from './export.js';

const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const fileList = document.getElementById("file-list")

inputFile.addEventListener("change", uploadFile);

document.addEventListener('DOMContentLoaded', checkAndDisplayStoredData);

function checkAndDisplayStoredData() {
    chrome.storage.local.get(['fileName', 'skills'], function(result) {
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
            chrome.storage.local.set({skills, fileName}, function() {
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