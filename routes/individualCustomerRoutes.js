const { Router } = require("express");
const {
    individualCustomerSignup,
    individualCustomerSignin,
} = require("../controllers/authController");
const {
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
} = require("../controllers/individualCustomerController");

const router = Router();

router.route("/signup").post(individualCustomerSignup);
router.route("/login").post(individualCustomerSignin);

router.route("/").get(getCustomers);
router
    .route("/:id")
    .get(getCustomer)
    .patch(updateCustomer)
    .delete(deleteCustomer);

module.exports = router;
