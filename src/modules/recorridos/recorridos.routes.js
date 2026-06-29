const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const recorridosController = require("./recorridos.controller");

const router = Router();

router.get("/", asyncHandler(recorridosController.listRecorridos));
router.get("/:id", asyncHandler(recorridosController.getRecorrido));
router.post("/", asyncHandler(recorridosController.createRecorrido));
router.patch("/:id", asyncHandler(recorridosController.updateRecorrido));
router.delete("/:id", asyncHandler(recorridosController.deleteRecorrido));

module.exports = router;
