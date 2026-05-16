const express = require("express");
const router = express.Router();
const CartController = require("./cartController");
const { protect } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { 
  addToCartSchema, 
  updateQuantitySchema, 
  toggleSelectionSchema 
} = require("./cartValidation");

router.use(protect);

router.post("/add", validate(addToCartSchema), CartController.addToCart);
router.get("/", CartController.getCart);
router.put("/update-quantity", validate(updateQuantitySchema), CartController.updateQuantity);
router.patch("/toggle-selection", validate(toggleSelectionSchema), CartController.toggleSelection);
router.delete("/:productId", CartController.deleteCartItem);

module.exports = router;
