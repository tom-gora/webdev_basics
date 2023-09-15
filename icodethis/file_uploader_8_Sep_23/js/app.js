const uploadListContainer = document.querySelector(".uploads-list");
const getUploadItemHTML = (fileExtension, fileName) => {
  return `<li class="upload-item">
            <div class="filetype">
              <ion-icon name="document-outline"></ion-icon>
              <span>${fileExtension}</span>
            </div>
            <div class="progress-bar">
              <div class="filename"><span>${fileName}</span></div>
              <div class="bar"></div>
              <div class="controls">
                <button>Pause</button>
                <button>Share Link</button>
                <button>View File</button>
              </div>
            </div>
            <div class="stop-download">
              <ion-icon name="close-outline"></ion-icon>
            </div>
          </li>`;
};

const fileInput = document.querySelector("input[type='file']");
const dragAndDropArea = document.querySelector(".uploader");
const uploadButton = document.querySelector(".select-files");
const cloudIndicator = document.querySelector(".uploader svg");
const errorMessage = document.querySelector("#error-message");

const fileHandler = (file, fullFileName, fileSize) => {
  if (fileSize > 52428800) {
    errorMessage.innerText = "You can upload files up to 50MB in size";
    return false;
  }
  errorMessage.innerText = "";
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const fileName = fullFileName.split(".")[0];
    const fileExtension = fullFileName.name.split(".")[1];
    uploadListContainer.insertAdjacentHTML(
      "beforeend",
      getUploadItemHTML(fileExtension, fileName),
    );
  };
};

uploadButton.addEventListener("click", () => {
  uploadListContainer.innerHTML = "";
  fileInput.click();

  // TODO: add "change" listener " on fileInput
  fileInput.addEventListener("change", () => {
    Array.from(fileInput.files).forEach((file) => {
      file;
      console.log(getUploadItemHTML(file, file.name, file.size));
    });
  });
});
