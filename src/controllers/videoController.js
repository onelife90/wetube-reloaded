import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import { async } from "regenerator-runtime";

const getKrDate = (createdAt) => {
  const date = createdAt.toLocaleDateString("ko-kr");
  const time = createdAt.toLocaleTimeString("en-US", { hour12: false });
  return `${date} ${time}`;
};

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({ path: "comments", populate: { path: "owner" } });
  if (!video) {
    req.flash("error", "Video not found.");
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  const videoCreatedAt = getKrDate(video.createdAt);
  return res.render("videos/watch", {
    pageTitle: video.title,
    video,
    videoCreatedAt,
  });
};

export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit", {
    pageTitle: `Edit: ${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
  } = req;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload video" });
};

export const postUpload = async (req, res) => {
  const {
    body: { title, description, hashtags },
    files: { video, thumb },
    session: {
      user: { _id },
    },
  } = req;

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].location,
      thumbUrl: thumb[0].location,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    req.flash("error", error._message);
    return res
      .status(400)
      .render("videos/upload", { pageTitle: "Upload video" });
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  const user = await User.findById(_id);

  if (!video) {
    req.flash("error", "Video not found.");
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("videos/search", {
    pageTitle: "Search",
    keyword,
    videos,
  });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  const comment = await Comment.findById(id).populate("owner");
  if (!comment) {
    req.flash("error", "Comment not found.");
    return res.sendStatus(404);
  }
  if (String(user._id) !== String(comment.owner._id)) {
    req.flash("error", "Commenter and User do not match.");
    return res.sendStatus(404);
  }
  const video = await Video.findById(String(comment.video._id));
  if (!video) {
    req.flash("error", "Video not found.");
    return res.sendStatus(404);
  }
  video.comments.splice(video.comments.indexOf(id), 1);
  await video.save();
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
};
