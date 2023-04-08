const fakeUser = {
  username: "linda",
  loggedIn: true,
};

export const trending = (req, res) =>
  res.render("home", { pageTitle: "Home", fakeUser: fakeUser });
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Videos");
export const deleteVideo = (req, res) => res.send("Delete Videos");
