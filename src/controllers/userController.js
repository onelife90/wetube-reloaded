import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  res.render("users/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, username, password, password2, name, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    req.flash("error", "Password confirmation does not match.");
    res.status(400).render("users/join", { pageTitle });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    req.flash("error", "This username/email is already taken.");
    res.status(400).render("users/join", { pageTitle });
  }
  try {
    await User.create({
      email,
      username,
      password,
      name,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    req.flash("error", error._message);
    return res.status(400).render("users/join", { pageTitle });
  }
};

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    req.flash("error", "An account with this username does not exists.");
    return res.status(400).render("users/login", { pageTitle });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    req.flash("error", "Wrong password.");
    return res.status(400).render("users/login", { pageTitle });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let socialEmailOnDB = await User.findOne({ email: emailObj.email });
    if (!socialEmailOnDB) {
      socialEmailOnDB = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        socialOnly: true,
        password: "",
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = socialEmailOnDB;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername },
    },
    body: { name, email, username, location },
    file,
  } = req;

  let searchParams = [];
  if (sessionEmail !== email) {
    searchParams.push({ email });
  }
  if (sessionUsername !== username) {
    searchParams.push({ username });
  }
  if (searchParams.length > 0) {
    const findUser = await User.findOne({ $or: searchParams });
    if (findUser && findUser._id.toString() !== _id) {
      req.flash(
        "error",
        "This Username/E-mail already exists. Please choose another."
      );
      return res
        .status(400)
        .render("users/edit-profile", { pageTitle: "Edit Profile" });
    }
  }
  const isFly = process.env.NODE_ENV === "production";
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isFly ? file.location : file.path) : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    req.flash("error", "The current password incorrect.");
    return res.status(400).render("users/change-password", { pageTitle });
  }
  if (oldPassword === newPassword) {
    req.flash("error", "The Old Password is same as New Password.");
    return res.status(400).render("users/change-password", { pageTitle });
  }
  if (newPassword !== newPassword1) {
    req.flash("error", "The password does not match the confirmation.");
    return res.status(400).render("users/change-password", { pageTitle });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    req.flash("error", "User not found.");
    return res.status("404").render("404", { pageTitle: "User not found." });
  }
  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};
