const { Router } = require("express");
const {
    businessCustomerSignup,
    businessCustomerSignin,
} = require("../controllers/authController");

const router = Router();

router.route("/signup").post(businessCustomerSignup);
router.route("/login").post(businessCustomerSignin);

module.exports = router;
