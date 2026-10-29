// Filter Status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      url.searchParams.delete("page");
      window.location.href = url.href;
    });
  });
}
// End Filter Status

// Form Search
const formsearch = document.querySelector("#form-search");
if (formsearch) {
  formsearch.addEventListener("submit", (e) => {
    e.preventDefault();
    let url = new URL(window.location.href);

    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    url.searchParams.delete("page");
    window.location.href = url.href;
  });
}
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
  let url = new URL(window.location.href);

  buttonsPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");

      url.searchParams.set("page", page);

      window.location.href = url.href;
    });
  });
}
// End Pagination

// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  if (closeAlert) {
    closeAlert.addEventListener("click", () => {
      showAlert.classList.add("alert-hidden");
    });
  }
}
// End Show Alert
