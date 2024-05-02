const loginBtn = document.querySelector("#login-btn");
const loginDialog = document.querySelector("#login-dialog");
const loginErrMsgBox = document.querySelector("#err-msg");
const emailInput = document.querySelector('input[name="email"]');
const loginDialogCloseBtn = document.querySelector("#login-dialog-close");
const passInput = document.querySelector('input[name="password"]');
const msgBox = document.querySelector("#msg-box");

// animate in the login dialog on btn click
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
// close dialog with a click outside of its boundaries
loginDialog.onclick = (e) => {
  if (e.target.nodeName === "DIALOG") {
    loginDialog.close();
  }
};

//preventing autocomplete suggestions from showing up before input is focused
//because they obscure entire modal content
emailInput.onfocus = () => {
  emailInput.setAttribute("autocomplete", "email");
};

//reset login dialog state on close
loginDialog.onclose = () => {
  loginErrMsgBox.classList.add("hidden");
  emailInput.setAttribute("autocomplete", "off");
};

loginDialogCloseBtn.onclick = (e) => {
  e.preventDefault();
  loginDialog.close();
};

const params = new URLSearchParams(window.location.search);
const err = params.get("error");
const stat = params.get("status");
const err_msg = params.get("err_msg");
let current_id = null;
//status handling currently only for logout
switch (stat) {
  case "userdeleted":
    msgBox.innerText = "Your account has been deleted. Goodbye!";
    msgBox.classList.remove("hidden");
    break;
  case "loggedout":
    msgBox.innerText = "You have been logged out.";
    msgBox.classList.remove("hidden");
    break;
}

// full error handling with contact link and error message passed into email
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
      case "fatalinvalidid":
        msg = "Failed processing user ID. Please";
        break;
      case "users_constraint":
        msg =
          "<p>This is a demo system.<br>Limit of registered users has been reached.<br>If you have an account consider removing it to add a new one.<br>Otherwise";
        msgBox.classList.remove("animate-delay-[3000]");
        msgBox.style.animationDelay = "8000ms";
        msgBox.classList.remove("bg-[--brand-color-green]");
        msgBox.classList.add("bg-red-400");
        msgBox.classList.remove("hidden");
        break;
      default:
        msg = "Unknown error. Please";
    }
    msgBox.innerHTML = `<p>${msg} <a class="email-admin"
          href="mailto:goratomasz@outlook.com?subject=PHONEZONE%20:%20Error%20report%20from%20user%20${encodeURIComponent(current_id)}&body=---%0AError%20code:%0A${encodeURIComponent(err_msg)}%0AOccurred%20at:%0A${encodeURIComponent(current_timestamp)}%0A---%0A%0A⚠️%20Do%20not%20delete%20the%20error%20code%20above!%20⚠️">contact the administrator</a>.</p>`;
  })();
}

// generic error handling with just UI hint
switch (err) {
  // generic handlers for extra coverage if no specific msg passed
  case "fatalinvalidid":
    msgBox.innerHTML =
      "<p>Failed processing user ID. Please <a class='email-admin' href='mailto:goratomasz@outlook.com'>contact the administrator</a>.</p>";
    msgBox.classList.remove("animate-delay-[3000]");
    // HACK: changing animation via toggling classes don't work so forcing longer
    // delay directly with JS to allow for re3ading longer message and clicking link
    msgBox.style.animationDelay = "8000ms";
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
  case "autherror":
    msgBox.innerHTML =
      "<p>Something went wrong. Please try a different login method <br>or <a class='email-admin' href='mailto:goratomasz@outlook.com'>contact the administrator</a>.</p>";
    msgBox.classList.remove("animate-delay-[3000]");
    msgBox.style.animationDelay = "8000ms";
    msgBox.classList.remove("bg-[--brand-color-green]");
    msgBox.classList.add("bg-red-400");
    msgBox.classList.remove("hidden");
    break;
  // info level error reporting
  case "nouser":
    loginErrMsgBox.innerText = "No user with that email and password.";
    loginErrMsgBox.classList.toggle("hidden");
    loginDialog.showModal();
    break;
  case "nologin":
    loginErrMsgBox.innerText = "You need to login to see this page.";
    loginErrMsgBox.classList.toggle("hidden");
    loginDialog.showModal();
    break;
  case "noadmin":
    msgBox.innerText = "You have no permissions to access this page.";
    msgBox.classList.remove("bg-[--brand-color-green]");
    msgBox.classList.add("bg-red-400");
    msgBox.classList.remove("hidden");
    break;
}
