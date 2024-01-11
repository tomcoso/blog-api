const router = require("express").Router();
const auth_controller = require("../controllers/authController");

router.post("/login", auth_controller.auth_login);

router.post("/logout", auth_controller.auth_logout);

router.post("/sign-up", auth_controller.auth_signup);

module.exports = router;
