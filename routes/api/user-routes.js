const router = require("express").Router();
const { User } = require("../../models");
const bcrypt = require("bcrypt");

const saltRounds = 10;

router.post("/signup", async (req, res) => {
  let result = {};
  var request = req.body;

  const username = request.username;
  const email = request.email;
  const password = await bcrypt.hash(request.password, saltRounds);

  const user = { username, email, password };

  User.create(user)
    .then((user) => {
      var session = req.session;
      session.user = user;
      result.status = "0";
      res.send(result);
    })
    .catch((err) => {
      if (err && err.name === "SequelizeUniqueConstraintError") {
        result.status = "8";
      } else {
        console.log(err);
        result.status = "9";
      }

      res.send(result);
    });
});

router.post("/login", async (req, res) => {
  let result = {};
  var request = req.body;

  const username = request.username;

  User.findOne({ where: { username } })
    .then(async (user) => {
      if (user) {
        let isValid = await bcrypt.compare(request.password, user.password);
        if (isValid) {
          var session = req.session;
          session.user = user;
          result.status = "0";
          res.send(result);
        } else {
          result.status = "9";

          res.send(result);
        }
      } else {
        result.status = "9";

        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);

      result.status = "9";

      res.send(result);
    });
});

module.exports = router;
