const express = require("express");
const { getTotalCount } = require("../controllers/customerController");

const router = express.Router();

router.route("/total-customer-count").get(getTotalCount);

module.exports = router;
