const loginBtn = document.querySelector("#login-btn");
const loginDialog = document.querySelector("#login-dialog");
const loginErrMsgBox = document.querySelector("#err-msg");
const emailInput = document.querySelector('input[name="email"]');
const loginDialogCloseBtn = document.querySelector("#login-dialog-close");
const passInput = document.querySelector('input[name="password"]');

loginBtn.onclick = (e) => {
  e.preventDefault();
  loginDialog.showModal();
  loginDialog.classList.add(
    "animate-fade-down",
    "animate-duration-300",
    "animate-ease-out"
  );
};

// src: https://www.stefanjudis.com/blog/a-look-at-the-dialog-elements-super-powers/
loginDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    loginDialog.close();
  }
};

emailInput.onfocus = () => {
  emailInput.setAttribute("autocomplete", "email");
};

loginDialog.onclose = () => {
  loginErrMsgBox.classList.remove("opacity-1");
  loginErrMsgBox.classList.add("opacity-0");
  emailInput.setAttribute("autocomplete", "off");
};

loginDialogCloseBtn.onclick = (e) => {
  e.preventDefault();
  loginDialog.close();
};

const params = new URLSearchParams(window.location.search);
const err = params.get("error");
switch (err) {
  case "nouser":
    console.log("nouser");
    loginErrMsgBox.innerText = "No user with that email and password.";
    loginErrMsgBox.classList.remove("opacity-0");
    loginErrMsgBox.classList.add("opacity-1");
    loginDialog.showModal();
    break;
}
