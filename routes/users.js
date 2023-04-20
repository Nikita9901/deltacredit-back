var express = require("express");
var router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware')

const userController = require("../controllers/users.controller");

router.post("/signup", userController.createUser);
router.post("/users", authMiddleware, userController.getUsers);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.post("/refresh", userController.refreshToken);
router.post("/user/:id", userController.getUser);
router.post("/user/edit/:id", authMiddleware, userController.updateUser);
router.post("/activate-user/:link", userController.activateUser);
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

module.exports = router;
