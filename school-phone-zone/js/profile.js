import * as dialogFunctions from "./dialog_functions.js";

// dialogs
const editDialog = document.querySelector("#edit-dialog");
const delDialog = document.querySelector("#del-dialog");
// trigger buttons
const editDetailsBtn = document.querySelector("#edit-profile-btn");
const delBtn = document.querySelector("#delete-profile-btn");

// close dialog buttons
const editDialogCancelBtn = editDialog.querySelector("#edit-dialog-close");
const delDialogCancelBtn = document.querySelector("#del-dialog-close");
console.log(delDialogCancelBtn);

editDetailsBtn.addEventListener("click", () => {
  editDialog.showModal();
});
delBtn.addEventListener("click", () => {
  delDialog.showModal();
});

editDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    dialogFunctions.clearEditForm(editDialog);
    editDialog.close();
  }
};

delDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    delDialog.close();
  }
};

editDialogCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dialogFunctions.clearEditForm(editDialog);
  delDialog.close();
});
