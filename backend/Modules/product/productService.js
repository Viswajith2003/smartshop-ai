const Product = require("../../models/Product");
const { NotFoundError } = require("../../utils/errors");

class ProductService {
  static async createProduct(data) {
    const product = new Product(data);
    await product.save();
    await product.populate("category", "name");
    return product;
  }

  static async updateProduct(id, data) {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("category", "name");
    
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  static async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  static async getAllProducts(queryParams = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
      category,
      minPrice,
      maxPrice,
      rating,
      isActive,   // "true" | "false" | "all" | undefined
    } = queryParams;

    const query = this._buildSearchQuery({ search, category, minPrice, maxPrice, rating, isActive });

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      products,
      meta: {
        totalProducts,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit),
      },
    };
  }

  static async getProductById(id, checkActive = true) {
    const product = await Product.findById(id).populate("category", "name");
    if (!product || (checkActive && !product.isActive)) throw new NotFoundError("Product not found");
    return product;
  }

  static async createProductReview(productId, reviewData, user) {
    const { rating, comment } = reviewData;
    const product = await Product.findById(productId);

    if (!product) throw new NotFoundError("Product not found");

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
    } else {
      // Add new review
      const review = {
        user: user._id,
        name: user.name,
        rating: Number(rating),
        comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
    }

    // Calculate Average Rating
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    return product;
  }

  static async getUserReviews(userId) {
    const products = await Product.find({ "reviews.user": userId }).select("name images reviews");
    const userReviews = [];

    products.forEach((product) => {
      const review = product.reviews.find((r) => r.user.toString() === userId.toString());
      if (review) {
        userReviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          productImage: product.images[0],
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        });
      }
    });

    return userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Private helper (Rule 1)
  static _buildSearchQuery({ search, category, minPrice, maxPrice, rating, isActive }) {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category.includes(",") ? { $in: category.split(",") } : category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // isActive filter: "true"/true → active only, "false"/false → inactive only, "all" → no filter (allows both), undefined → active only by default
    if (isActive === "true" || isActive === true) {
      query.isActive = true;
    } else if (isActive === "false" || isActive === false) {
      query.isActive = false;
    } else if (isActive === "all") {
      // no filter, shows all active and inactive products (e.g. for admin usage)
    } else {
      // By default, only show active products to users
      query.isActive = true;
    }

    return query;
  }
}

module.exports = ProductService;
