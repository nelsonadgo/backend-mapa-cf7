const { Router } = require("express");

const authController = require("./auth.controller");
//const asyncHandler = require("../../utils/asyncHandler");

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - legajo
 *         - nombre
 *         - password
 *       properties:
 *         legajo:
 *           type: string
 *           example: "12345"
 *           description: Legajo, DNI o identificador único del usuario
 *         nombre:
 *           type: string
 *           example: "Juan Pérez"
 *         password:
 *           type: string
 *           format: password
 *           example: "Secret123"
 *         rol:
 *           type: string
 *           default: "visitante"
 *           example: "visitante"
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - legajo
 *         - password
 *       properties:
 *         legajo:
 *           type: string
 *           example: "12345"
 *         password:
 *           type: string
 *           format: password
 *           example: "Secret123"
 *
 *     GoogleLoginInput:
 *       type: object
 *       required:
 *         - tokenGoogle
 *       properties:
 *         tokenGoogle:
 *           type: string
 *           description: id_token de Google obtenido desde el frontend
 *           example: "eyJhbGciOiJSUzI1NiIs..."
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Campos obligatorios faltantes o usuario ya existente
 */
router.post("/register", authController.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión con legajo y contraseña
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login exitoso, retorna el token JWT de la aplicación
 *       400:
 *         description: Legajo y contraseña obligatorios
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", authController.login);
/**
 * @swagger
 * /api/auth/google-login:
 *   post:
 *     summary: Iniciar sesión o registrarse automáticamente mediante Google OAuth
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginInput'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso con Google, retorna token JWT
 *       400:
 *         description: El token de Google es obligatorio
 *       401:
 *         description: Token de Google inválido o expirado
 */
router.post("/google", authController.googleLogin);

module.exports = router;
