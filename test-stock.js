const mongoose = require("mongoose");
const OrderService = require("./backend/Modules/order/orderService");
const Product = require("./backend/models/Product");

async function test() {
  await mongoose.connect("mongodb://127.0.0.1:27017/smartshop"); // Adjust if needed
  
  // Find a product
  const product = await Product.findOne();
  console.log("Original stock:", product.stock);

  // Try updating stock using the exact method
  await OrderService._updateStock([{ product: product._id, quantity: 1 }], -1);

  const updatedProduct = await Product.findById(product._id);
  console.log("Updated stock:", updatedProduct.stock);
  
  process.exit(0);
}
test();
