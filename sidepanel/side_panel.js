const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");

inputFile.addEventListener("change", uploadFile);

function uploadFile() {
  let file = URL.createObjectURL(inputFile.files[0]);
  console.log("file received");
}