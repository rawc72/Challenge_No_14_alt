// import models
const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

Post.belongsTo(User, {
  foreignKey: "userid",
  targetKey: "id",
  onDelete: "CASCADE",
});

User.hasMany(Post, { foreignKey: "userid", sourceKey: "id" });

Comment.belongsTo(Post, {
  foreignKey: "postid",
  targetKey: "id",
  onDelete: "CASCADE",
});

Post.hasMany(Comment, {
  foreignKey: "postid",
  sourceKey: "id",
});

Comment.belongsTo(User, {
  foreignKey: "by",
  targetKey: "id",
  onDelete: "CASCADE",
});

User.hasMany(Comment, { foreignKey: "by", sourceKey: "id" });

module.exports = {
  User,
  Post,
  Comment,
};
