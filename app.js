const express = require("express");
const { create } = require("express-handlebars");
const routes = require("./routes");
const sequelize = require("./config/connection");
const session = require("express-session");
require("./models");

// session expire config
const sessionExpire = 60 * 60 * 1000;

var hbs = create({});

// register new function
hbs.handlebars.registerHelper("ifEquals", function(arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

const app = express();

const port = process.env.PORT || 3000;

const initDB = async() => {
    await sequelize.sync();
};

initDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(
    session({
        secret: "its a secret",
        cookie: { maxAge: sessionExpire },
        resave: true,
        saveUninitialized: true,
    })
);

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(routes);

app.listen(port, () => {
    console.log(`HTTP Server running at http://localhost:${port}`);
});