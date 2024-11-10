import { apiKey } from './export.js';

const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const fileList = document.getElementById("file-list")

inputFile.addEventListener("change", uploadFile);

function uploadFile() {
    let file = inputFile.files[0];
    console.log("File received.");
    if (fileList.children.length === 1) {
        fileList.innerHTML = '';
    }
    const fileItem = document.createElement("div");
    fileItem.classList.add("file-item");
    fileItem.textContent = `${file.name} • Uploaded`;
    fileList.appendChild(fileItem);

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
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
}

dropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
});

dropArea.addEventListener("drop", function (e) {
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadFile();
});