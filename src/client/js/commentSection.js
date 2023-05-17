const videoContainer = document.getElementById("videoContainer");
const commentForm = document.getElementById("commentForm");
const videoAddComments = document.querySelector(".video__add-comments");

const addComment = (text, commentId) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newCommentOwnerInfo = document.createElement("div");
  newCommentOwnerInfo.className = "video__commenterInfo";

  const commenter = document.createElement("a");
  commenter.className = "video__commenter";
  commenter.setAttribute("href", `/users/${newCommentOwnerInfo.dataset.id}`);
  videoComments.appendChild(commenter);

  const loggedInAvatar = videoAddComments.dataset.avatar;
  if (!loggedInAvatar) {
    const noneAvatar = document.createElement("span");
    noneAvatar.innerText = `😋`;
    newCommentOwnerInfo.appendChild(noneAvatar);
  } else if (loggedInAvatar.includes("https://")) {
    const socialAvatar = document.createElement("img");
    socialAvatar.className = "video__commenter-avatar";
    socialAvatar.setAttribute("src", loggedInAvatar);
    socialAvatar.setAttribute("crossorigin", "crossorigin");
    newCommentOwnerInfo.appendChild(socialAvatar);
  } else if (loggedInAvatar.includes("uploads/")) {
    const basicAvatar = document.createElement("img");
    basicAvatar.className = "video__commenter-avatar";
    basicAvatar.setAttribute("src", `/${loggedInAvatar}`);
    newCommentOwnerInfo.appendChild(basicAvatar);
  }

  const commentCreatedAt = document.createElement("small");
  commentCreatedAt.className = "video__comment-createdAt";
  const date = new Date();
  commentCreatedAt.innerText = `${date.toLocaleDateString(
    "ko-kr"
  )} ${date.toLocaleTimeString("en-US", { hour12: false })}`;
  newCommentOwnerInfo.appendChild(commentCreatedAt);

  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = commentId;
  videoComments.appendChild(newComment);

  const span = document.createElement("span");
  span.innerText = text;
  newComment.appendChild(span);

  const span2 = document.createElement("span");
  span2.className = "delete__comment";
  span2.innerText = `❌`;
  newComment.appendChild(span2);

  videoComments.prepend(newComment);
  videoComments.prepend(newCommentOwnerInfo);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text.trim() === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (commentForm) {
  commentForm.addEventListener("submit", handleSubmit);
}
