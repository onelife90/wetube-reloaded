let videos = [
  {
    title: "inhale video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1,
  },
  {
    title: "exhale video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 0,
    id: 2,
  },
  {
    title: "breath video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  return res.end();
};
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Videos");
export const deleteVideo = (req, res) => res.send("Delete Videos");
