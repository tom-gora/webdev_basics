const uploadListContainer = document.querySelector(".uploads-list");
const scrollableSection = document.querySelector(".card-body");
const fileInput = document.querySelector("input[type='file']");
const dragAndDropArea = document.querySelector(".drag-and-drop-area");
const dragAndDropUploader = document.querySelector(".uploader");
const uploadButton = document.querySelector(".select-files");
const cloudIndicator = document.querySelector(".uploader svg path");
const errorMessage = document.querySelector("#error-message");

// return markup for injection with string literal used
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

const formatFileName = (fullFileName) => {
  const fileNameParts = [];

  //if no extension at all
  if (!fullFileName.includes(".")) {
    // case name too long check
    if (fullFileName.length >= 12)
      fullFileName = `${fullFileName.slice(0, 12)}...`;
    fileNameParts.push(fullFileName);
    fileNameParts.push(" ");
    return fileNameParts;
  }
  // if contains dot, then split
  const fileExtension = fullFileName.split(".")[1];
  const fileName = fullFileName.split(".")[0];

  // if no extension or extension too long
  if (fileExtension.length > 4 || fileExtension <= 0) {
    // case name too long check
    if (fullFileName.length > 12)
      fullFileName = `${fullFileName.slice(0, 12)}...`;
    fileNameParts.push(fullFileName);
    fileNameParts.push("");
    return fileNameParts;
  }
  // if filename too long
  if (fileName.length > 12) {
    fileNameParts.push(`${fullFileName.split(".")[0].slice(0, 12)}..`);
    fileNameParts.push(fileExtension);
    return fileNameParts;
  }

  // name not too long with regular extension up to 4 chars
  fileNameParts.push(fileName);
  fileNameParts.push(fileExtension);
  return fileNameParts;
};

// calculate arbitrary time as 20s per mb of file read
const getDuration = (fileSize) => {
  const megaBytes = fileSize / 1048576;
  return Math.floor(megaBytes * 20000);
};

const fileHandler = (file) => {
  // disallow uploads above 50mb
  if (file.size > 52428800) {
    errorMessage.innerText = "You can upload files up to 50MB in size";
    return;
  }

  const timeInSeconds = getDuration(file.size);

  errorMessage.innerText = "";
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const fileNameFormatted = formatFileName(file.name);
    let fileName;
    // handle names depending if they need a dot because it'd be stupid
    // if there is no file extension and "." were appended for no reason
    if (fileNameFormatted[1] === "") {
      fileName = `${fileNameFormatted[0]}${fileNameFormatted[1]}`;
    } else {
      fileName = `${fileNameFormatted[0]}.${fileNameFormatted[1]}`;
    }
    uploadListContainer.insertAdjacentHTML(
      "beforeend",
      getUploadItemHTML(fileNameFormatted[1], fileName, timeInSeconds),
    );
  };
};

// observer config. only look at parent container
const observerConfig = { childList: true, subtree: false };

// observer updating the ui as nodes appended, handling animation etc.
// all props, listeners and actions for injected list items kept here for scoping reasons
const observer = new MutationObserver((mutationList) => {
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

        scrollableSection.scrollTo({
          top: uploadListContainer.scrollHeight,
          behavior: "smooth",
        });

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
              addedNode.classList.add("completed");
              node.style.left = "50%";
              node.style.margin = "0";

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

// listeners

fileInput.addEventListener("change", () => {
  Array.from(fileInput.files).forEach((file) => {
    fileHandler(file);
  });
});

// reroute the custom button to hidden input action
uploadButton.addEventListener("click", () => {
  fileInput.click();
});

dragAndDropArea.addEventListener(
  "dragenter",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragAndDropUploader.classList.add("active");
  },
  false,
);

dragAndDropArea.addEventListener(
  "dragleave",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragAndDropUploader.classList.remove("active");
  },
  false,
);

dragAndDropArea.addEventListener(
  "dragover",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragAndDropUploader.classList.add("active");
  },
  false,
);

dragAndDropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  event.stopPropagation();
  dragAndDropUploader.classList.remove("active");
  let files = event.dataTransfer.files;
  Array.from(files).forEach((file) => {
    fileHandler(file);
  });
});
