const router = require("express").Router();
const { Post, Comment } = require("../../models");

router.post("/", async (req, res) => {
  var session = req.session;

  let loggedIn = session && session.user && session.user.username;

  if (!loggedIn) {
    let result = {};
    console.log("Not logged in..");
    result.status = "9";

    res.send(result);
    return;
  }

  let result = {};
  var request = req.body;

  const title = request.title;
  const content = request.content;
  const userid = session.user.id;

  const post = { userid, title, content };

  Post.create(post)
    .then((post) => {
      result.status = "0";
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      result.status = "9";

      res.send(result);
    });
});

router.put("/:postId", async (req, res) => {
  var session = req.session;
  const postId = req.params.postId;

  let loggedIn = session && session.user && session.user.username;

  if (!loggedIn) {
    let result = {};
    console.log("Not logged in..");
    result.status = "9";

    res.send(result);
    return;
  }

  let result = {};
  var request = req.body;

  const title = request.title;
  const content = request.content;

  Post.update({ title: title, content: content }, { where: { id: postId } })
    .then((post) => {
      result.status = "0";
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      result.status = "9";

      res.send(result);
    });
});

router.delete("/:postId", async (req, res) => {
  var session = req.session;
  const postId = req.params.postId;

  let loggedIn = session && session.user && session.user.username;

  if (!loggedIn) {
    let result = {};
    console.log("Not logged in..");
    result.status = "9";

    res.send(result);
    return;
  }

  let result = {};

  Post.destroy({ where: { id: postId } })
    .then((deletedCount) => {
      result.status = "0";
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      result.status = "9";

      res.send(result);
    });
});

router.post("/:postid/comments", async (req, res) => {
  var session = req.session;

  let loggedIn = session && session.user && session.user.username;

  if (!loggedIn) {
    let result = {};
    console.log("Not logged in..");
    result.status = "9";

    res.send(result);
    return;
  }

  let result = {};
  var request = req.body;

  const postid = request.postid;
  const content = request.content;
  const by = session.user.id;

  const comment = { postid, content, by };

  Comment.create(comment)
    .then((comment) => {
      result.status = "0";
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      result.status = "9";

      res.send(result);
    });
});

module.exports = router;
