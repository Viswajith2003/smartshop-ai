const express=require("express")
const cartController=require("../controllers/cartController")
const router=express.Router()

router.post("/add", cartController.addToCart)
router.get("/:userId", cartController.getCart)
router.put("/update-quantity", cartController.updateQuantity)
router.patch("/toggle-selection", cartController.toggleSelection)
router.delete("/:userId/:productId", cartController.deleteCartItem)

module.exports=router