document.addEventListener("DOMContentLoaded", () => {
  const inbox = document.getElementsByClassName("notification-container")[0];
  const submit_buttons = document.getElementsByClassName("submit-btn");
  const info_symbol = "&#10003;";
  const confirmation_symbol = "&#128712;";
  const error_symbol = "&#9888;";
  var input_field;
  var type;
  var new_notification;
  var dismiss_buttons;
  var target_notification;
  var target_button;
  var notification_id = 1;
  var notification_count;
  let timed_out;

  construct_notification_markup = (type, id) => {
    if (type === "info") {
      symbol = info_symbol;
    } else if (type === "confirmation") {
      symbol = confirmation_symbol;
    } else {
      symbol = error_symbol;
    }
    var notification_markup = `<p class="symbol">${symbol}</p><p class="notification-text">${input_field.value}</p>
          <button class="dismiss-btn" data-dismiss="${id}"></button>`;
    return notification_markup;
  };

  getInput = (button) => {
    if (button.classList.contains("info-submit")) {
      input_field = button.previousElementSibling;
      type = "info";
    } else if (button.classList.contains("error-submit")) {
      input_field = button.previousElementSibling;
      type = "error";
    } else {
      input_field = button.previousElementSibling;
      type = "confirmation";
    }
  };

  Array.from(submit_buttons).forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      getInput(button);
      new_notification = document.createElement("div");
      new_notification.classList.add("notification", type);
      new_notification.setAttribute("data-notification", notification_id);
      injection_markup = construct_notification_markup(type, notification_id);
      new_notification.innerHTML = injection_markup;
      notification_id++;

      inbox.appendChild(new_notification);
      input_field.value = "";
      notification_count = inbox.childElementCount;

      dismiss_buttons = inbox.getElementsByClassName("dismiss-btn");
      dismiss = (e) => {
        target_button = e.target.getAttribute("data-dismiss");
        target_notification = inbox.querySelector(
          `.notification[data-notification="${target_button}"]`
        );
        if (target_notification == null) {
          return;
        } else {
          target_notification.remove();
          e.target.removeEventListener("click", dismiss);
          clearTimeout(timed_out);
          notification_count = inbox.childElementCount;
        }
      };

      Array.from(dismiss_buttons).forEach((close_button) => {
        close_button.addEventListener("click", dismiss);
      });

      if (notification_count > 3) {
        inbox.removeChild(inbox.firstElementChild);
      } else if (notification_count != 0 && notification_count <= 3) {
        timed_out = setTimeout(() => {
          try {
            inbox.removeChild(inbox.firstElementChild);
          } catch (error) {
            console.log("Notification box already empty.", error.message);
          }
        }, 10000);
      }
    });
  });
});
