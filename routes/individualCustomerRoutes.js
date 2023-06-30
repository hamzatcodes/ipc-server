const { Router } = require("express");
const {
    individualCustomerSignup,
    individualCustomerSignin,
} = require("../controllers/authController");

const router = Router();

router.route("/signup").post(individualCustomerSignup);
router.route("/login").post(individualCustomerSignin);

module.exports = router;
