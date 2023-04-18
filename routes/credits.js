var express = require("express");
var router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware')

const creditsController = require("../controllers/credits.controller");

router.post("/creditlist", creditsController.getCreditsList);
router.post("/create-credit", creditsController.createCredit);
router.post("/delete-credit", creditsController.deleteCredit);
router.post("/get-userCredits/:user_id", creditsController.getUserCredits);
// router.get("/", function (req, res) {
//     res.send("respond with a resource");
// });

module.exports = router;
