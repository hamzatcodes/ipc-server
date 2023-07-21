const { Router } = require("express");
const {
    businessCustomerSignup,
    businessCustomerSignin,
} = require("../controllers/authController");

const {
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
} = require("../controllers/businessCustomerController");

const router = Router();

router.route("/signup").post(businessCustomerSignup);
router.route("/login").post(businessCustomerSignin);

router.route("/").get(getCustomers);
router
    .route("/:id")
    .get(getCustomer)
    .patch(updateCustomer)
    .delete(deleteCustomer);

module.exports = router;
