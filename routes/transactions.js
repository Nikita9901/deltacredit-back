var express = require("express");
var router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware')
const transactionsController = require("../controllers/transactions.controller")

router.post("/deposit", transactionsController.depositAmount);

module.exports = router;
