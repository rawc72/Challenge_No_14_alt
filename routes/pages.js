const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");

const DATE_FORMAT = "MM/DD/YYYY";

router.get("/", async (req, res) => {
  var session = req.session;

  let loggedIn = session && session.user && session.user.username;

  const result = await Post.findAll({
    order: [["createdAt", "DESC"]],
    include: [
      { model: User, as: "user" },
      { model: Comment, as: "comments" },
    ],
  });

  var posts = result.map((post) => {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdBy: post.user.username,
      createdAt: moment(post.createdAt).format(DATE_FORMAT),
    };
  });

  var data = {
    headerTitle: "The Tech Blog",
    logged: loggedIn,
    activeTab: "home",
    post: posts,
  };

  res.render("home", data);
});

router.get("/dashboard", async (req, res) => {
  var session = req.session;

  let loggedIn = session && session.user && session.user.username;

  if (!loggedIn) {
    res.redirect("/");
    return;
  }

  const result = await Post.findAll({
    where: { userid: session.user.id },
    order: [["createdAt", "DESC"]],
  });

  var posts = result.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    createdBy: post.userid,
    createdAt: moment(post.createdAt).format(DATE_FORMAT),
  }));

  var data = {
    headerTitle: "Your Dashboard",
    logged: loggedIn,
    post: posts,
    activeTab: "dashboard",
  };

  res.render("dashboard", data);
});

router.get("/logout", function (req, res) {
  req.session.destroy();

  res.redirect("/");
});

router.get("/createpost", function (req, res) {
  var session = req.session;

  let loggedIn = session && session.user && session.user.username;

  if (!loggedIn) {
    res.redirect("/");
    return;
  }

  var data = {
    headerTitle: "Your Dashboard",
    logged: loggedIn,
    activeTab: "dashboard",
  };

  res.render("createpost", data);
});

router.get("/editpost", async (req, res) => {
  var session = req.session;

  let loggedIn = session && session.user && session.user.username;

  if (!loggedIn) {
    res.redirect("/");
    return;
  }

  const postid = req.query.post;

  const result = await Post.findByPk(postid);

  if (!result) {
    res.redirect("/");
    return;
  }

  var data = {
    headerTitle: "Your Dashboard",
    logged: loggedIn,
    title: result.title,
    content: result.content,
    postid,
    activeTab: "dashboard",
  };

  res.render("updatepost", data);
});

router.get("/commentpost", async (req, res) => {
  var session = req.session;

  let loggedIn = session && session.user && session.user.username;

  const postid = req.query.post;

  const post = await Post.findOne({
    where: { id: postid },
    include: [
      { model: User, as: "user" },
      { model: Comment, as: "comments" },
    ],
  });

  if (!post) {
    res.redirect("/");
    return;
  }

  let userids = [];

  const uids = post.comments.map((comm) => comm.by);
  userids.push(...uids);

  const users = await User.findAll({ where: { id: { [Op.in]: userids } } });

  let userMap = new Map();

  users.forEach((user) => {
    userMap.set(user.id, user.username);
  });

  const comments = post.comments.map((comment) => ({
    content: comment.content,
    createdBy: userMap.get(comment.by),
    createdAt: moment(comment.createdAt).format(DATE_FORMAT),
  }));

  var data = {
    headerTitle: "The Tech Blog",
    logged: loggedIn,
    title: post.title,
    postContent: post.content,
    postid,
    createdAt: moment(post.createdAt).format(DATE_FORMAT),
    username: post.user.username,
    comments,
    commentClass: loggedIn ? "" : "d-none",
    activeTab: "home",
  };

  res.render("commentpost", data);
});

module.exports = router;
