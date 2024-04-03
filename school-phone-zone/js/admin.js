const delButtons = document.querySelectorAll(".del-btn");
const delDialog = document.querySelector("#del-dialog");
const delDialogConfirmBtn = document.querySelector("#del-dialog-confirm-btn");
const delDialogCancelBtn = document.querySelector("#del-dialog-close");
const delInput = delDialog.querySelector("input[value='delete_user']");
const delDialogConfirmationBox = delDialog.querySelector("#confirmation-box");
const msgBox = document.querySelector("#msg-box");

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
