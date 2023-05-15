const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const text = textarea.value;
  const video = videoContainer.dataset.id;
};

if (commentForm) {
  commentForm.addEventListener("submit", handleSubmit);
}
