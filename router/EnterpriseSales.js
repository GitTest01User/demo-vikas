const express = require("express");

var {
  getProducts,

  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/EnterpriseSales");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

router.get("/Status/Digi2l/EnterpriseSales", getProducts);
router.post("/Status/Digi2l/EnterpriseSales/Post", createProduct);
router.patch("/Status/Digi2l/EnterpriseSales", updateProduct);
router.delete("/Status/Digi2l/EnterpriseSales", deleteProduct);

module.exports = router;
