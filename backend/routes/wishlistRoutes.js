const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/wishlistController");
const { authenticateUser } = require("../middlewares/auth");

// All wishlist routes require authentication
router.use(authenticateUser);

router.get("/", WishlistController.getWishlist);
router.post("/toggle", WishlistController.toggleWishlist);
router.delete("/clear", WishlistController.clearWishlist);

module.exports = router;
