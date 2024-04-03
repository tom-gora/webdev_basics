const msgBox = document.querySelector("#msg-box");

const delButtons = document.querySelectorAll(".del-btn");
const delDialog = document.querySelector("#del-dialog");
const delDialogConfirmBtn = document.querySelector("#del-dialog-confirm-btn");
const delDialogCancelBtn = document.querySelector("#del-dialog-close");
const delInput = delDialog.querySelector("input[value='delete_user']");
const delDialogConfirmationBox = delDialog.querySelector(
  "#del-confirmation-box"
);

const editButtons = document.querySelectorAll(".edit-btn");
const editDialog = document.querySelector("#edit-dialog");
const editDialogConfimationBox = editDialog.querySelector(
  "#edit-confirmation-box"
);
const emailInput = editDialog.querySelector("input[name='edit-user-email']");
const firstNameInput = editDialog.querySelector(
  "input[name='edit-user-first-name']"
);
const lastNameInput = editDialog.querySelector(
  "input[name='edit-user-last-name']"
);
const passwordInput = editDialog.querySelector(
  "input[name='edit-user-password']"
);
const imageInput = editDialog.querySelector("input[name='edit-user-image']");
const roleSelect = editDialog.querySelector("select[name='edit-user-type']");

const params = new URLSearchParams(window.location.search);
const err = params.get("error");
const stat = params.get("status");
switch (stat) {
  case "userdeleted":
    msgBox.innerText = "User has been deleted.";
    msgBox.classList.remove("hidden");
    break;
}

switch (err) {
  //
  //WARN:
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ASSESSMENT: this is accomplishing task 3's final touch. UI feedback on error
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //
  case "deletedisallowed":
    msgBox.innerText = "You are not allowed to delete this user.";
    msgBox.classList.remove("bg-[--brand-color-green]");
    msgBox.classList.add("bg-red-400");
    msgBox.classList.remove("hidden");
    break;
}
// src: https://www.stefanjudis.com/blog/a-look-at-the-dialog-elements-super-powers/
delDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    delDialog.close();
  }
};
editDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
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

editButtons.forEach((editButton) => {
  editButton.addEventListener("click", () => {
    const id = editButton.dataset.userId;
    const firstName = editButton.dataset.userFirstName;
    const lastName = editButton.dataset.userLastName;
    const email = editButton.dataset.userEmail;
    const img = editButton.dataset.userImg;
    const role = editButton.dataset.userType;

    emailInput.value = email;
    firstNameInput.value = firstName;
    lastNameInput.value = lastName;
    // imageInput.value = img;
    roleSelect.value = role;
    editDialog.showModal();
  });
});
