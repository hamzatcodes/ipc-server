const { Router } = require("express");
const {
    getOrders,
    createOrder,
    getOrder,
    updateOrder,
} = require("../controllers/orderController");

const router = Router();

router.route("/").get(getOrders).post(createOrder);

router.route("/:id").get(getOrder).patch(updateOrder);

module.exports = router;
