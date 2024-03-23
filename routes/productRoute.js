const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const protectclient = require("../middleWare/authclientMiddleware");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  list,
  purchaseProduct,
  getProductsForPieChart,
  getAllPurchasedProducts,
  updatePurchaceProductStatus
} = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");

router.post("/", upload.single("image"), createProduct);
router.patch("/:id", upload.single("image"), updateProduct);
router.get("/", getProducts);
router.get("/allpurchasedproducts", getAllPurchasedProducts);
router.get("/productsforpiechart", getProductsForPieChart);
router.get("/list",  list);
router.get("/:id",  getProduct);
router.patch("/:id/updatestatus", protect,  updatePurchaceProductStatus);
router.post("/:id/purchase", protectclient, purchaseProduct);

module.exports = router;

