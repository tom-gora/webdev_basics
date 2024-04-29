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
const editDialogCancelBtn = editDialog.querySelector("#edit-dialog-close");
const editDialogConfimationBox = editDialog.querySelector(
  "#edit-confirmation-box"
);
const idInput = editDialog.querySelector("input[name='edit-user-id']");
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
const imgageLabelBg = editDialog.querySelector("#label-bg");
const imageFileName = editDialog.querySelector("#user-img-filename");

const roleSelect = editDialog.querySelector("select[name='edit-user-type']");

const params = new URLSearchParams(window.location.search);
const err = params.get("error");
const stat = params.get("status");
const err_msg = params.get("err_msg");
let current_id = null;
if (err_msg) {
  // if specific error message is passed then professionally
  // grab the message and user id and prepare simple mail body
  // just ready to send at a click of a button
  const current_timestamp = new Date().toLocaleString();
  async function get_id() {
    try {
      const data = new FormData();
      data.append("client_request", "get_id");
      const response = await fetch("scripts/utils.php", {
        method: "POST",
        body: data
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
  (async () => {
    current_id = await get_id();
    let msg;
    switch (err) {
      case "internalerr":
        msg = "Something went wrong. Please";
        break;
      default:
        msg = "Unknown error. Please";
    }
    msgBox.innerHTML = `<p>${msg} <a class="email-admin"
          href="mailto:goratomasz@outlook.com?subject=PHONEZONE%20:%20Error%20report%20from%20user%20${encodeURIComponent(current_id)}&body=---%0AError%20code:%0A${encodeURIComponent(err_msg)}%0AOccurred%20at:%0A${encodeURIComponent(current_timestamp)}%0A---%0A%0A⚠️%20Do%20not%20delete%20the%20error%20code%20above!%20⚠️">contact the administrator</a>.</p>`;
  })();
}
switch (stat) {
  case "userdeleted":
    msgBox.innerText = "User has been deleted.";
    msgBox.classList.remove("hidden");
    break;
  case "userupdated":
    msgBox.innerText = "User has been updated.";
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
  case "editdisallowed":
    msgBox.innerText = "You are not allowed to edit this user.";
    msgBox.classList.remove("bg-[--brand-color-green]");
    msgBox.classList.add("bg-red-400");
    msgBox.classList.remove("hidden");
    break;
  case "internalerr":
    msgBox.innerHTML =
      "<p>Something went wrong. Please <a class='email-admin' href='mailto:goratomasz@outlook.com'>contact the administrator</a>.</p>";
    msgBox.classList.remove("animate-delay-[3000]");
    msgBox.style.animationDelay = "8000ms";
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

imageInput.addEventListener("change", () => {
  if (imageInput.files[0] && imageInput.files[0].name) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const file = imageInput.files[0];
      const fileUrl = e.target.result;
      const fileName = file.name;

      imageFileName.innerText = fileName;
      imgageLabelBg.style.backgroundImage = `url(${fileUrl})`;
    };
    reader.readAsDataURL(imageInput.files[0]);
  }
});

editDialog.addEventListener("close", () => {
  imageFileName.innerText = "";
});

editDialogCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
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
    idInput.value = id;
    editDialogConfimationBox.innerText = `You are editing details of ${firstName} ${lastName}.`;
    imgageLabelBg.style.backgroundImage = `url("../res/user_img/${img}"`;
    emailInput.value = email;
    firstNameInput.value = firstName;
    lastNameInput.value = lastName;
    // roleSelect.value = role;
    // nope. had to actually print the select object and manually search where
    // the value of this type of input is set, because simple .value is not a key
    // of dom object of type select. Stack overflow knows shit.
    // console.log(roleSelect);
    switch (role) {
      case "admin":
        roleSelect.options.selectedIndex = 0;
        break;
      case "user":
        roleSelect.options.selectedIndex = 1;
        break;
      case "owner":
        roleSelect.options.selectedIndex = 2;
        break;
    }
    editDialog.showModal();
  });
});
