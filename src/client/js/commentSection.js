const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
};

if (commentForm) {
  commentForm.addEventListener("submit", handleSubmit);
}
