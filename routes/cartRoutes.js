const { Router } = require("express");
const {
    getCartItems,
    addToCart,
    deleteCartItem,
    deleteAllCartItems,
} = require("../controllers/cartController");

const router = Router();

router.route("/").get(getCartItems).post(addToCart).delete(deleteAllCartItems);

router.route("/:id").delete(deleteCartItem);

module.exports = router;
