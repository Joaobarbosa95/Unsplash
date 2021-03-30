"strict";
const main = document.querySelector("main");

// dynamic image add to main
window.addEventListener("load", async (e) => {
  const host = location.href;
  // database images url´s query
  const data = await fetch(`${host}photos`)
    .then((res) => res.json())
    .then((data) => data);

  // render images dynamically
  data.forEach((image) => {
    insertImages(image.url, image.label, image._id);
  });

  // add event listeners
  // if there is no images = no buttons...
  handlers();
});

function handlers() {
  const buttons = document.querySelectorAll(".delete");
  const label = document.querySelector("label");
  const addPhoto = document.querySelector(".add-photo");

  // Delete buttons handler
  buttons.forEach((btn) => {
    btn.addEventListener("click", deleteEl);
  });

  // form fetch data
  addPhoto.addEventListener("click", (e) => {
    // only form is accessible
    main.style.pointerEvents = "none";

    // making form visible
    const form = document.querySelector(".form");
    form.style.display = "block";
    form.style.visibility = "visible";

    // elements available in form
    const cancel = document.querySelector(".cancel");
    const submit = document.querySelector(".submit");
    const inputLabel = document.querySelector(".input-label");
    const inputUrl = document.querySelector(".input-url");

    // submit button handler
    submit.addEventListener("click", async (e) => {
      // e.stopImmediatePropagation();
      e.preventDefault();
      // post to database
      await post(inputLabel, inputUrl);

      // Everytime you click in the Add-photo button
      // it adds a new event listener, which will stack
      // on top of the others

      // refactor cancel
      form.style.display = "none";
      form.style.visibility = "none";
      inputLabel.value = "";
      inputUrl.value = "";
      main.style.pointerEvents = "auto";
    });

    // cancel button handler
    cancel.addEventListener("click", (e) => {
      e.stopPropagation();
      form.style.display = "none";
      form.style.visibility = "none";
      inputLabel.value = "";
      inputUrl.value = "";
      main.style.pointerEvents = "auto";
    });
  });
}

// FUNCTIONS TO REFACTOR
// dynamic images insertion
function insertImages(url, label, objectId) {
  const html = `
  <div class="image-container" objectId="${objectId}">
          <button type="button" class="delete">Delete</button>
          <img src="${url}">
          <label class="image-label">${label}</label>
          </div>`;

  main.insertAdjacentHTML("afterbegin", html);
}

async function deleteEl(e) {
  const id = e.target.parentElement.attributes.objectId.value;

  await fetch(`${location.href}photos`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ objectId: id }),
  });

  e.target.parentElement.remove();
}

async function post(inputLabel, inputUrl) {
  const { url, label, _id: objectId } = await fetch(`${location.href}photos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      label: inputLabel.value,
      url: inputUrl.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => data);

  // add to DOM tree
  insertImages(url, label, objectId);
  const newImg = document.querySelector(`[objectId="${objectId}"]`);
  newImg.addEventListener("click", deleteEl);
}
