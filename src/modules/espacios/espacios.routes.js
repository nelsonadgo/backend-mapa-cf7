const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const espaciosController = require("./espacios.controller");
const upload = require("../../middlewares/upload");
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     EspacioInput:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: Aula Magna
 *         piso:
 *           type: integer
 *           example: 1
 *         descripcion:
 *           type: string
 *           example: Aula con capacidad para 100 personas
 *         accesible:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/espacios:
 *   get:
 *     summary: Listar espacios con filtros y paginación
 *     tags:
 *       - Espacios
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
 *         description: Cantidad de resultados a omitir (paginación)
 *     responses:
 *       200:
 *         description: Lista de espacios obtenida correctamente
 *
 *   post:
 *     summary: Crear un nuevo espacio (con opción de foto)
 *     tags:
 *       - Espacios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen para Cloudinary
 *               nombre:
 *                 type: string
 *               piso:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               accesible:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Espacio creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.get("/", asyncHandler(espaciosController.listEspacios));
router.post("/", upload.single("imagen"), asyncHandler(espaciosController.createEspacio));

/**
 * @swagger
 * /api/espacios/{id}:
 *   get:
 *     summary: Obtener un espacio por su ID
 *     tags:
 *       - Espacios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del espacio
 *     responses:
 *       200:
 *         description: Espacio encontrado
 *       404:
 *         description: Espacio no encontrado
 *
 *   put:
 *     summary: Reemplazar un espacio completo
 *     tags:
 *       - Espacios
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
 *             $ref: '#/components/schemas/EspacioInput'
 *     responses:
 *       200:
 *         description: Espacio reemplazado correctamente
 *
 *   patch:
 *     summary: Actualización parcial de un espacio
 *     tags:
 *       - Espacios
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
 *             $ref: '#/components/schemas/EspacioInput'
 *     responses:
 *       200:
 *         description: Espacio actualizado correctamente
 *
 *   delete:
 *     summary: Eliminar un espacio
 *     tags:
 *       - Espacios
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
 *         description: Espacio eliminado correctamente
 */
router.get("/:id", asyncHandler(espaciosController.getEspacio));
router.put("/:id", asyncHandler(espaciosController.replaceEspacio));
router.patch("/:id", asyncHandler(espaciosController.updateEspacio));
router.delete("/:id", asyncHandler(espaciosController.deleteEspacio));

module.exports = router;
