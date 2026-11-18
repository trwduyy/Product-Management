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

// Product Sorting
const sortProduct = document.querySelector("#sort-product");
if (sortProduct) {
  sortProduct.addEventListener("change", (event) => {
    const parts = event.target.value.split("-");
    const sortKey = parts[0];
    const sortValue = parts[1];
    const url = new URL(window.location.href);

    if (sortKey && sortValue) {
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
    }
    url.searchParams.delete("page");
    window.location.href = url.href;
  });
}
// End Product Sorting

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
const showAlerts = document.querySelectorAll("[show-alert]");
showAlerts.forEach((showAlert) => {
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
});
// End Show Alert
