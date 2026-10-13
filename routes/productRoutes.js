const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// CREATE - Thêm sản phẩm
router.post("/", async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;

    const existingProduct = await Product.findOne({ pid });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product pid already exists",
      });
    }

    const product = new Product({
      pid,
      pname,
      price,
      quantity,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.log("=== POST PRODUCT ERROR ===");
    console.error(error.stack);
    console.log("=== END ERROR ===");

    return res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// READ - Lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
});

// READ - Lấy sản phẩm theo pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: Number(req.params.pid),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
});

// UPDATE - Cập nhật sản phẩm theo pid
router.put("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: Number(req.params.pid) },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// DELETE - Xóa sản phẩm theo pid
router.delete("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: Number(req.params.pid),
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

module.exports = router;