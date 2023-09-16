const uploadListContainer = document.querySelector(".uploads-list");
const getUploadItemHTML = (fileExtension, fileName, time) => {
  return `<li class="upload-item" data-time="${time}">
            <div class="filetype">
              <ion-icon name="document-outline"></ion-icon>
              <span>${fileExtension}</span>
            </div>
            <div class="progress-bar">
              <div class="filename"><span>${fileName}</span></div>
              <div class="bar">
                <div class="progress-counter">xx</div>
              </div>
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

const truncateFileName = (string) => {
  if (string.length > 12) return `${string.slice(0, 12)}...`;
  else return string;
};

/* TODO: fileHandler must calc time from filesize then store in "innerHTML" as data attr
so it can be read in mutation observer and animate accordingly with CSS
*/
const fileHandler = (file) => {
  if (file.size > 52428800) {
    errorMessage.innerText = "You can upload files up to 50MB in size";
    return;
  }

  // calculate artitrary time as 10s per mb of file read
  const megaBytes = file.size / 1048576;
  const timeInSeconds = megaBytes * 10;

  errorMessage.innerText = "";
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const fileExtension = file.name.split(".")[1];
    const fileName = `${truncateFileName(
      file.name.split(".")[0],
    )} .${fileExtension}`;
    uploadListContainer.insertAdjacentHTML(
      "beforeend",
      getUploadItemHTML(fileExtension, fileName, timeInSeconds),
    );
  };
};

fileInput.addEventListener("change", () => {
  Array.from(fileInput.files).forEach((file) => {
    fileHandler(file);
  });
});

// reroute the custom button to hidden input action
uploadButton.addEventListener("click", () => {
  fileInput.click();
});

const observer = new MutationObserver((mutationList, observer) => {
  mutationList.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      const addedNodes = mutation.addedNodes;
      addedNodes.forEach((addedNode) => {
        const bar = addedNode.querySelector(".bar");
        const counter = addedNode.querySelector(".progress-counter");
        bar.classList.add("bar-moving");
        const time = addedNode.getAttribute("data-time");
        console.log(addedNode);
        console.log(time);
      });
    }
  });
});

observer.observe(uploadListContainer, { childList: true, subtree: true });
