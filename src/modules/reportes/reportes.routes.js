const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const reportesController = require("./reportes.controller");

const router = Router();

router.get("/", asyncHandler(reportesController.listReportes));
router.get("/:id", asyncHandler(reportesController.getReporte));
// router.post("/", asyncHandler(reportesController.createReporte));
// router.patch("/:id", asyncHandler(reportesController.updateReporte));
// router.delete("/:id", asyncHandler(reportesController.deleteReporte));

module.exports = router;
