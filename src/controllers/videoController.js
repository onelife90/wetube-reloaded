export const trending = (req, res) => {
  res.send("Home Page Videos");
};

export const see = (req, res) => {
  return res.send(`Watch Video #${req.params.id}`);
};

export const edit = (req, res) => {};

export const search = (req, res) => {
  res.send("Search Videos");
};

export const upload = (req, res) => {
  res.send("Upload Videos");
};

export const deleteVideo = (req, res) => {
  res.send("Delete Videos");
};
