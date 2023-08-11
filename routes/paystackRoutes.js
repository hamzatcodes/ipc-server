const { Router } = require("express");
const {
    initializePayment,
    verifyPayment,
} = require("../controllers/payStackController");

const router = Router();

router.post("/initialize", initializePayment);
router.get("/verify", verifyPayment);

module.exports = router;
