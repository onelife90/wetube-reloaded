const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }
  await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
  window.location.reload();
};

if (commentForm) {
  commentForm.addEventListener("submit", handleSubmit);
}
