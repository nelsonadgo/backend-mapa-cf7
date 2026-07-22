const express = require("express");
const router = express.Router();
const preferencesController = require("./preferencias.controller");
const protegerRuta = require("../../middlewares/auth.middleware");

/**
 * @swagger
 * /api/preferencias:
 *   get:
 *     summary: Obtiene las preferencias del usuario autenticado
 *     tags:
 *       - Preferencias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferencias encontradas
 *       404:
 *         description: No se encontraron preferencias
 *   put:
 *     summary: Actualiza las preferencias del usuario
 *     tags:
 *       - Preferencias
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requiere_ascensor:
 *                 type: boolean
 *               evita_escaleras:
 *                 type: boolean
 *               requiere_rampa:
 *                 type: boolean
 *               alto_contraste:
 *                 type: boolean
 *               escala_fuente:
 *                 type: integer
 *               movimiento_reducido:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferencias actualizadas correctamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.get("/", protegerRuta, preferencesController.getPreferences);
router.put("/", protegerRuta, preferencesController.updatePreferences);

module.exports = router;