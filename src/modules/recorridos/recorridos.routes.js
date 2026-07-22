const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const recorridosController = require("./recorridos.controller");

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RecorridoInput:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: Ruta accesible Edificio A
 *         origen_id:
 *           type: string
 *           example: uuid-del-espacio-origen
 *         destino_id:
 *           type: string
 *           example: uuid-del-espacio-destino
 *         descripcion:
 *           type: string
 *           example: Recorrido sin escalones por rampa lateral
 *         es_accesible:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/recorridos:
 *   get:
 *     summary: Listar recorridos con filtros y paginación
 *     tags:
 *       - Recorridos
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados a devolver
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Cantidad de resultados a omitir
 *     responses:
 *       200:
 *         description: Lista de recorridos obtenida correctamente
 *
 *   post:
 *     summary: Crear un nuevo recorrido
 *     tags:
 *       - Recorridos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecorridoInput'
 *     responses:
 *       201:
 *         description: Recorrido creado correctamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.get("/", asyncHandler(recorridosController.listRecorridos));
router.get("/:id", asyncHandler(recorridosController.getRecorrido));

/**
 * @swagger
 * /api/recorridos/{id}:
 *   get:
 *     summary: Obtener un recorrido por ID
 *     tags:
 *       - Recorridos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del recorrido
 *     responses:
 *       200:
 *         description: Recorrido encontrado
 *       404:
 *         description: Recorrido no encontrado
 *
 *   patch:
 *     summary: Actualización parcial de un recorrido
 *     tags:
 *       - Recorridos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecorridoInput'
 *     responses:
 *       200:
 *         description: Recorrido actualizado correctamente
 *       404:
 *         description: Recorrido no encontrado
 *
 *   delete:
 *     summary: Eliminar un recorrido
 *     tags:
 *       - Recorridos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recorrido eliminado correctamente
 *       404:
 *         description: Recorrido no encontrado
 */
router.post("/", asyncHandler(recorridosController.createRecorrido));
router.patch("/:id", asyncHandler(recorridosController.updateRecorrido));
router.delete("/:id", asyncHandler(recorridosController.deleteRecorrido));

module.exports = router;
