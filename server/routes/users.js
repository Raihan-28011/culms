const express = require("express");
const { getUserInfo } = require("../controller/users");

const router = express.Router();
router.get("/info", getUserInfo);

module.exports = router;
