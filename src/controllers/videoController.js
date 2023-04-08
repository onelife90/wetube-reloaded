export const trending = (req, res) => {
  const videos = [
    {
      title: "inhale video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes agd",
      views: 59,
      id: 1,
    },
    {
      title: "exhale video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes agd",
      views: 59,
      id: 1,
    },
    {
      title: "breath video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes agd",
      views: 59,
      id: 1,
    },
  ];
  return res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Videos");
export const deleteVideo = (req, res) => res.send("Delete Videos");
