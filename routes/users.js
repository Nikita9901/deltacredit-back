var express = require("express");
var router = express.Router();

const userController = require("../controllers/users.controller");

/* GET users listing. */
router.post("/signup", userController.createUser);
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/refresh", userController.refreshToken);
router.get("/activate-user/:link", userController.activateUser);
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
