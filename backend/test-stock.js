require("dotenv").config();
const mongoose = require("mongoose");
const OrderService = require("./Modules/order/orderService");
const Product = require("./models/Product");

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const product = await Product.findOne();
  console.log("Original stock:", product.stock);

  await OrderService._updateStock([{ product: product._id, quantity: 1 }], -1);

  const updatedProduct = await Product.findById(product._id);
  console.log("Updated stock:", updatedProduct.stock);
  
  process.exit(0);
}
test();
