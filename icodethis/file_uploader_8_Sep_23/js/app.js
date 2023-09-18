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
            <div class="stop-delete">
              <ion-icon name="close-outline"></ion-icon>
            </div>
          </li>`;
};

const fileInput = document.querySelector("input[type='file']");
const dragAndDropArea = document.querySelector(".drag-and-drop-area");
const dragAndDropUploader = document.querySelector(".uploader");
const uploadButton = document.querySelector(".select-files");
const cloudIndicator = document.querySelector(".uploader svg path");
const errorMessage = document.querySelector("#error-message");

const truncateFileName = (string) => {
  if (string.length > 12) return `${string.slice(0, 12)}...`;
  else return string;
};

const fileHandler = (file) => {
  if (file.size > 52428800) {
    errorMessage.innerText = "You can upload files up to 50MB in size";
    return;
  }

  // calculate arbitrary time as 20s per mb of file read
  const megaBytes = file.size / 1048576;
  const timeInSeconds = Math.floor(megaBytes * 20000);

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

const observerConfig = { childList: true, subtree: false };

const observer = new MutationObserver((mutationList, observer) => {
  mutationList.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      const addedNodes = mutation.addedNodes;
      addedNodes.forEach((addedNode) => {
        const bar = addedNode.querySelector(".bar");
        const counter = addedNode.querySelector(".progress-counter");
        bar.classList.add("bar-moving");
        const timeToAnimate = addedNode.getAttribute("data-time");

        const viewButton = addedNode.querySelector(".controls :nth-child(3)");
        const stopDeleteButton = addedNode.querySelector(".stop-delete");
        const stopDeleteIcon = addedNode.querySelector(".stop-delete ion-icon");

        uploadListContainer.scrollIntoView(false);

        stopDeleteButton.addEventListener("click", () => {
          uploadListContainer.removeChild(addedNode);
        });

        bar.style.setProperty("--animation-time", timeToAnimate + "ms");
        counter.style.setProperty("--animation-time", timeToAnimate + "ms");

        const countTo100 = (node, time) => {
          const interval = time / 100;
          let currentStep = 0;

          const intervalId = setInterval(() => {
            if (currentStep <= 100) {
              node.innerText = `${currentStep}%`;
              currentStep++;
            } else {
              clearInterval(intervalId);
              node.style.left = "50%";
              node.style.color = "var(--card-bg)";
              node.style.fontWeight = "900";
              viewButton.style.display = "block";
              stopDeleteIcon.setAttribute("name", "trash-outline");
            }
          }, interval);
        };

        countTo100(counter, timeToAnimate);
      });
    } else return;
  });
});

observer.observe(uploadListContainer, observerConfig);

dragAndDropArea.addEventListener("dragenter", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dragAndDropUploader.classList.add("active");
});

dragAndDropArea.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dragAndDropUploader.classList.remove("active");
});

dragAndDropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dragAndDropUploader.classList.add("active");
});

dragAndDropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  e.stopPropagation();
  dragAndDropUploader.classList.remove("active");
  let files = e.dataTransfer.files;
  Array.from(files).forEach((file) => {
    fileHandler(file);
  });
});
