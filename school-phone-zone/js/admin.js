import * as dialogFunctions from "./dialog_functions.js";

// popup for errors and status messages
const msgBox = document.querySelector("#msg-box");
//dialog boxes
const editDialog = document.querySelector("#edit-dialog");
const delDialog = document.querySelector("#del-dialog");
// trigger buttons
const addUserButton = document.querySelector("#add-user-btn");
const editButtons = document.querySelectorAll(".edit-btn");
const delButtons = document.querySelectorAll(".del-btn");
// close dialog buttons
const editDialogCancelBtn = editDialog.querySelector("#edit-dialog-close");
const delDialogCancelBtn = document.querySelector("#del-dialog-close");
// other modified elements
const imageInput = editDialog.querySelector("input[name='edit-user-image']");
const imageInputLabel = editDialog.querySelector(
  "label[for='edit-user-image']"
);
const imageLabelBg = editDialog.querySelector("#label-bg");
const imageLabelDesc = editDialog.querySelector("#user-img-description");
const imageLabelSvg = editDialog.querySelector(
  "label[for='edit-user-image'] svg"
);
const delInput = delDialog.querySelector("input[value='delete_user']");
const delDialogConfirmationBox = delDialog.querySelector(
  "#del-confirmation-box"
);
// url query string
const params = new URLSearchParams(window.location.search);
const err = params.get("error");
const stat = params.get("status");
const err_msg = params.get("err_msg");

//error handling and status messages
//logically admin is the one on the page so no need to do
//"contact the admin flow"

switch (err) {
  //
  //WARN:
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ASSESSMENT: this is adding task 3's final touch. UI feedback on error,
  // should a disallowed operation be attempted somehow
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //
  case "deletedisallowed":
    msgBox.innerText = "You are not allowed to delete this user.";
    msgBox.classList.remove("bg-[--brand-color-green]");
    msgBox.classList.add("bg-red-400");
    msgBox.classList.remove("hidden");
    break;
  case "editdisallowed":
    msgBox.innerText = "You are not allowed to edit this user.";
    msgBox.classList.remove("bg-[--brand-color-green]");
    msgBox.classList.add("bg-red-400");
    msgBox.classList.remove("hidden");
    break;
  // and other cases
  case "add_emailtaken":
    msgBox.innerText = "Cannot add user. Email already taken.";
    msgBox.classList.remove("bg-[--brand-color-green]");
    msgBox.classList.add("bg-red-400");
    msgBox.classList.remove("hidden");
    break;
  case "internalerr":
    const current_timestamp = new Date().toLocaleString();
    msgBox.innerHTML = `<p>Something went wrong.<br>Error: ${err_msg}<br>Timestamp: ${current_timestamp} </p>`;
    msgBox.classList.remove("animate-delay-[3000]");
    msgBox.style.animationDelay = "8000ms";
    msgBox.classList.remove("bg-[--brand-color-green]");
    msgBox.classList.add("bg-red-400");
    msgBox.classList.remove("hidden");
    break;
}

// status messages
switch (stat) {
  case "userdeleted":
    msgBox.innerText = "User has been deleted.";
    msgBox.classList.remove("hidden");
    break;
  case "userupdated":
    msgBox.innerText = "User has been updated.";
    msgBox.classList.remove("hidden");
    break;
  case "useradded":
    msgBox.innerText = "User has been added.";
    msgBox.classList.remove("hidden");
    break;
}

//listeners

// src: https://www.stefanjudis.com/blog/a-look-at-the-dialog-elements-super-powers/
delDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    delDialog.close();
  }
};

editDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    dialogFunctions.clearEditForm(editDialog);
    editDialog.close();
  }
};

delDialogCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  delDialog.close();
});

delButtons.forEach((delButton) => {
  delButton.addEventListener("click", () => {
    const id = delButton.dataset.userId;
    const name = delButton.dataset.userName;
    delInput.value = id;
    delDialogConfirmationBox.innerText = `Are you sure you want to delete ${name}?`;

    delDialog.showModal();
  });
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

editDialog.addEventListener("close", () => {
  dialogFunctions.clearEditForm(editDialog);
});

editDialogCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dialogFunctions.clearEditForm(editDialog);
  editDialog.close();
});

editButtons.forEach((editButton) => {
  editButton.addEventListener("click", () => {
    const id = editButton.dataset.userId;
    const firstName = editButton.dataset.userFirstName;
    const lastName = editButton.dataset.userLastName;
    const email = editButton.dataset.userEmail;
    const img = editButton.dataset.userImg;
    const role = editButton.dataset.userType;
    dialogFunctions.prefillFormForEdit(
      editDialog,
      id,
      firstName,
      lastName,
      email,
      img,
      role
    );
    editDialog.showModal();
  });
});

addUserButton.addEventListener("click", () => {
  dialogFunctions.setFormForAddition(editDialog);
  editDialog.showModal();
});

//
//WARN:
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ASSESSMENT: this improves the restrictions by hiding select options
// and not allowing to add or edit admin/owner types unless and owner account
// is logged in. regular admin type can only add regular user types
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

(async () => {
  let currentMasterAndCommander = await dialogFunctions.get_role();
  const roleSelect = document.querySelector("select[name='edit-user-type']");
  if (currentMasterAndCommander !== "owner" && roleSelect.children.length > 1) {
    roleSelect.querySelector("option[value='admin']").remove();
    roleSelect.querySelector("option[value='owner']").remove();
  }
})();
