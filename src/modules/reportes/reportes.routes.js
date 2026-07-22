const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const reportesController = require("./reportes.controller");

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     ReporteResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "uuid-del-reporte"
 *         titulo:
 *           type: string
 *           example: "Rampa en mal estado"
 *         descripcion:
 *           type: string
 *           example: "La rampa de acceso al Edificio B se encuentra obstruida."
 *         estado:
 *           type: string
 *           example: "pendiente"
 *         fecha_creacion:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener la lista general de reportes
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReporteResponse'
 *       401:
 *         description: No autorizado (Token JWT inválido o ausente)
 */
router.get("/", asyncHandler(reportesController.listReportes));
/**
 * @swagger
 * /api/reportes/{id}:
 *   get:
 *     summary: Obtener el detalle de un reporte por ID
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del reporte a consultar
 *     responses:
 *       200:
 *         description: Reporte encontrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 datos:
 *                   $ref: '#/components/schemas/ReporteResponse'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reporte no encontrado
 */
router.get("/:id", asyncHandler(reportesController.getReporte));
// router.post("/", asyncHandler(reportesController.createReporte));
// router.patch("/:id", asyncHandler(reportesController.updateReporte));
// router.delete("/:id", asyncHandler(reportesController.deleteReporte));

module.exports = router;
