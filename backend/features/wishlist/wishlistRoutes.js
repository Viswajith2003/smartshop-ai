const express = require("express");
const router = express.Router();
const WishlistController = require("./wishlistController");
const { protect } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { toggleWishlistSchema } = require("./wishlistValidation");

router.use(protect);

router.get("/", WishlistController.getWishlist);
router.post("/toggle", validate(toggleWishlistSchema), WishlistController.toggleWishlist);
router.delete("/clear", WishlistController.clearWishlist);

module.exports = router;
