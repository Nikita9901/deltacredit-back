var express = require("express");
var router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware')

const borrowsController = require("../controllers/borrows.controller");

router.post("/get-borrows/:credit_id", borrowsController.getBorrowsForCredit);
router.post("/create-borrow", authMiddleware, borrowsController.createBorrowRequest);

module.exports = router;
