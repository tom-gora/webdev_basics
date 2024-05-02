import * as dialogFunctions from "./dialog_functions.js";

// popup for errors and status messages
const msgBox = document.querySelector("#msg-box");
// dialogs
const editDialog = document.querySelector("#edit-dialog");
const delDialog = document.querySelector("#del-dialog");
// trigger buttons
const editDetailsBtn = document.querySelector("#edit-profile-btn");
const delBtn = document.querySelector("#delete-profile-btn");
// close dialog buttons
const editDialogCancelBtn = editDialog.querySelector("#edit-dialog-close");
const delDialogCancelBtn = document.querySelector("#del-dialog-close");
// other modified elements
const editFormLabels = editDialog.querySelectorAll("label");
const labelsRawHtmlArray = Array.from(editFormLabels).map(
  (label) => label.innerHTML
);
const imageInput = editDialog.querySelector("input[name='edit-user-image']");
const imageInputLabel = editDialog.querySelector(
  "label[for='edit-user-image']"
);
const imageLabelBg = editDialog.querySelector("#label-bg");
const imageLabelDesc = editDialog.querySelector("#user-img-description");
const imageLabelSvg = editDialog.querySelector(
  "label[for='edit-user-image'] svg"
);

editDialog.querySelector("#edit-confirmation-box").remove();

// url query string
const params = new URLSearchParams(window.location.search);
const stat = params.get("status");

// status messages
stat === "userupdated"
  ? ((msgBox.innerText = "Your details have been updated."),
    msgBox.classList.remove("hidden"))
  : null;

editDetailsBtn.addEventListener("click", () => {
  editDialog.showModal();
});

delBtn.addEventListener("click", () => {
  delDialog.showModal();
});

editDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    dialogFunctions.resetFormForEdit(editFormLabels, labelsRawHtmlArray);
    editDialog.close();
  }
};

delDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    delDialog.close();
  }
};
delDialogCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  delDialog.close();
});

editDialogCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dialogFunctions.resetFormForEdit(editFormLabels, labelsRawHtmlArray);
  editDialog.close();
});

imageInput.addEventListener("change", () => {
  if (imageInput.files[0] && imageInput.files[0].name) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileUrl = e.target.result;

      imageLabelDesc.classList.add("hidden");
      imageInputLabel.classList.remove("grid-rows-2");
      imageLabelSvg.classList.add("hidden");
      imageLabelBg.style.backgroundImage = `url(${fileUrl})`;
      imageLabelBg.classList.remove("opacity-25");
    };
    reader.readAsDataURL(imageInput.files[0]);
  }
});
