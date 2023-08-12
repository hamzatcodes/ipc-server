const { Router } = require("express");
const {
    getOrders,
    createOrder,
    getOrder,
    updateOrder,
    orderSummary,
} = require("../controllers/orderController");

const router = Router();

router.route("/order-summary").get(orderSummary);

router.route("/").get(getOrders).post(createOrder);

router.route("/:id").get(getOrder).patch(updateOrder);

module.exports = router;
