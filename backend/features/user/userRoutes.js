const express = require("express");
const router = express.Router();
const UserController = require("./userController");
const validate = require("../../middlewares/validate");
const { protect } = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const {
  profileUpdateSchema,
  passwordChangeSchema,
  addressSchema,
} = require("./userValidation");

router.use(protect);

// Profile
router.get("/profile", UserController.getProfile);
router.put("/profile", validate(profileUpdateSchema), UserController.updateProfile);
router.put("/avatar", upload.single("avatar"), UserController.updateAvatar);
router.put("/change-password", validate(passwordChangeSchema), UserController.changePassword);

// Addresses
router.post("/address", validate(addressSchema), UserController.addAddress);
router.put("/address/:addressId", validate(addressSchema), UserController.updateAddress);
router.delete("/address/:addressId", UserController.deleteAddress);
router.patch("/address/:addressId/default", UserController.setDefaultAddress);

module.exports = router;
