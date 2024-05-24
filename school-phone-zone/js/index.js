const msgBox = document.querySelector("#msg-box");

const params = new URLSearchParams(window.location.search);
const err = params.get("error");
const stat = params.get("status");
let err_msg;
// I was inconsistent but fuck it handle both cases of wording I might have used -_-
params.get("error_msg")
  ? (err_msg = params.get("error_msg"))
  : (err_msg = params.get("err_msg"));

//status handling currently only for logout
switch (stat) {
  case "userdeleted":
    msgBox.innerHTML = "Your account has been deleted.<br>Goodbye!";
    msgBox.classList.remove("hidden");
    break;
  case "loggedout":
    msgBox.innerText = "You have been logged out.";
    msgBox.classList.remove("hidden");
    break;
  case "userregistered":
    msgBox.innerText = "Registered successfully. You can now log in.";
    msgBox.classList.remove("hidden");
    loginDialog.showModal();
    break;
}

let msg, current_timestamp, current_id;
current_id = sessionStorage.getItem("user_id");

// full error handling with contact link and error message passed into email
if (err_msg) {
  // if specific error message is passed then set the message
  // just ready to send at a click of a button
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
      break;
    default:
      msg = "Unknown error. Please";
  }
}

switch (err) {
  case "fatalinvalidid":
    current_timestamp = new Date().toLocaleString();
    msgBox.innerHTML = `<p>${msg} <a class="email-admin"
          href="mailto:goratomasz@outlook.com?subject=PHONEZONE%20:%20Error%20report%20from%20user%20${encodeURIComponent(current_id)}&body=---%0AError%20code:%0A${encodeURIComponent(err_msg)}%0AOccurred%20at:%0A${encodeURIComponent(current_timestamp)}%0A---%0A%0A⚠️%20Do%20not%20delete%20the%20error%20code%20above!%20⚠️">contact the administrator</a>.</p>`;
    msgBox.classList.remove("animate-delay-[3000]");
    // HACK: changing animation via toggling classes don't work so forcing longer
    // delay directly with JS to allow for re3ading longer message and clicking link
    msgBox.style.animationDelay = "8000ms";
    msgBox.style.animationDelay = "8000ms";
    msgBox.classList.remove("bg-bg-info");
    msgBox.classList.add("bg-brand-primary-200");
    msgBox.classList.remove("hidden");
    break;
  case "users_constraint":
    current_timestamp = new Date().toLocaleString();
    msgBox.innerHTML = `<p>${msg} <a class="email-admin"
          href="mailto:goratomasz@outlook.com?subject=PHONEZONE%20:%20Error%20report%20from%20user%20${encodeURIComponent(current_id)}&body=---%0AError%20code:%0A${encodeURIComponent(err_msg)}%0AOccurred%20at:%0A${encodeURIComponent(current_timestamp)}%0A---%0A%0A⚠️%20Do%20not%20delete%20the%20error%20code%20above!%20⚠️">contact the administrator</a>.</p>`;
    msgBox.classList.remove("animate-delay-[3000]");
    // HACK: changing animation via toggling classes don't work so forcing longer
    // delay directly with JS to allow for re3ading longer message and clicking link
    msgBox.style.animationDelay = "8000ms";
    msgBox.style.animationDelay = "8000ms";
    msgBox.classList.remove("bg-bg-info");
    msgBox.classList.add("bg-brand-primary-200");
    msgBox.classList.remove("hidden");
    break;
  case "internalerr":
    current_timestamp = new Date().toLocaleString();
    msgBox.innerHTML = `<p>${msg} <a class="email-admin"
          href="mailto:goratomasz@outlook.com?subject=PHONEZONE%20:%20Error%20report%20from%20user%20${encodeURIComponent(current_id)}&body=---%0AError%20code:%0A${encodeURIComponent(err_msg)}%0AOccurred%20at:%0A${encodeURIComponent(current_timestamp)}%0A---%0A%0A⚠️%20Do%20not%20delete%20the%20error%20code%20above!%20⚠️">contact the administrator</a>.</p>`;
    msgBox.classList.remove("animate-delay-[3000]");
    msgBox.style.animationDelay = "8000ms";
    msgBox.classList.remove("bg-bg-info");
    msgBox.classList.add("bg-brand-primary-200");
    msgBox.classList.remove("hidden");
    break;

  // info level error reporting more generic with no specific admin email
  case "autherror":
    msgBox.innerHTML =
      "<p>Something went wrong. Please try a different login method <br>or <a class='email-admin' href='mailto:goratomasz@outlook.com'>contact the administrator</a>.</p>";
    msgBox.classList.remove("animate-delay-[3000]");
    msgBox.style.animationDelay = "8000ms";
    msgBox.classList.remove("bg-bg-info");
    msgBox.classList.add("bg-brand-primary-200");
    msgBox.classList.remove("hidden");
    break;
  case "nouser":
    loginErrMsgBox.innerText = "No user with that email and password.";
    loginErrMsgBox.classList.toggle("hidden");
    loginDialog.showModal();
    break;
  case "nologin":
    loginErrMsgBox.innerText = "You need to log in to see this page.";
    loginErrMsgBox.classList.toggle("hidden");
    loginDialog.showModal();
    break;
  case "noadmin":
    msgBox.innerText = "You have no permissions to access this page.";
    msgBox.classList.remove("bg-bg-info");
    msgBox.classList.add("bg-brand-primary-200");
    msgBox.classList.remove("hidden");
    break;
  case "passnotmatch":
    registerErrMsgBox.innerText = "Passwords do not match.";
    registerErrMsgBox.classList.toggle("hidden");
    registerDialog.showModal();
    break;
  case "registeremailtaken":
    registerErrMsgBox.innerText = "Email is already taken.";
    registerErrMsgBox.classList.toggle("hidden");
    registerDialog.showModal();
    break;
}
