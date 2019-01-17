function postComment() {
  const name = document.getElementById("name").value;
  const comment = document.getElementById("comment").value;
  document.getElementById("commentDiv").innerHTML =
    document.getElementById("commentDiv").innerHTML +
    `<div class="row">
    <div class="col">
      ${name}
        </div>
    </div>
    <div class="row">
    <div class="col">
    ${comment}
        </div>
    </div>`;
}
