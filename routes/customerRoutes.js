const express = require("express");
const { getTotalCount } = require("../controllers/customerController");

const router = express.Router();

router.route("/total-customer-count").get(getTotalCount);
// router.route("/login").get

module.exports = router;
