const main = document.querySelector("main");
const button = document.querySelector(".delete");
const label = document.querySelector("label");
const addPhoto = document.querySelector(".add-photo");

button.addEventListener("click", async (e) => {
  const id = e.target.parentElement.attributes.objectId.value;
  console.log();

  await fetch(`${location.href}photos`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ objectId: id }),
  });

  e.target.parentElement.remove();
});

// dynamic image add to main
window.addEventListener("load", async (e) => {
  const host = location.href;
  // database images url´s query
  const data = await fetch(`${host}photos`)
    .then((res) => res.json())
    .then((data) => data);

  // render images dynamically
  data.forEach((image) => {
    insertImages(image.url, image.label);
  });
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
    try {
      // post to database
      const { url, label, _id: objectId } = await fetch(
        `${location.href}photos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            label: inputLabel.value,
            url: inputUrl.value,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => data);

      console.log(url, label, objectId);
      // add to DOM tree
      insertImages(url, label, objectId);

      inputLabel.value = "";
      inputUrl.value = "";
    } catch (e) {
      console.log(e);
    }

    main.style.pointerEvents = "auto";
  });

  // cancel button handler
  cancel.addEventListener("click", (e) => {
    form.style.display = "none";
    form.style.visibility = "none";
    inputLabel.value = "";
    inputUrl.value = "";
    main.style.pointerEvents = "auto";
  });
});

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
