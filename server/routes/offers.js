const express = require("express");
const router = express.Router();
const { getActiveOffersProducts, getLatestActiveOffer } = require("../controllers/offers");

router.route("/latest").get(getLatestActiveOffer);
router.route("/").get(getActiveOffersProducts);

module.exports = router;
