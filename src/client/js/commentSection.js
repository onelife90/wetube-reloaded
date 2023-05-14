const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const textarea = commentForm.querySelector("textarea");
const button = commentForm.querySelector("button");

const handleSubmit = (event) => {
  event.preventDefault();
  const text = textarea.value;
  const video = videoContainer.dataset.id;
};

commentForm.addEventListener("submit", handleSubmit);
