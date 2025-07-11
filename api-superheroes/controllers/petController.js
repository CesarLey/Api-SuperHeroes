import express from "express";
import { check, validationResult } from 'express-validator';
import petService from "../services/petService.js";
import Pet from "../models/petModel.js";

const router = express.Router();

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Obtiene todas las mascotas
 *     tags: [Mascotas]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 */
router.get("/pets", async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Crea una nueva mascota
 *     tags: [Mascotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mascota creada
 *       400:
 *         description: Error de validación
 */
router.post("/pets",
    [
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('type').not().isEmpty().withMessage('El tipo es requerido')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try {
            const { name, type } = req.body;
            const newPet = new Pet(null, name, type);
            const addedPet = await petService.addPet(newPet);
            res.status(201).json(addedPet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Actualiza una mascota existente
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada
 *       404:
 *         description: Mascota no encontrada
 */
router.put("/pets/:id", async (req, res) => {
    try {
        const updatedPet = await petService.updatePet(req.params.id, req.body);
        res.json(updatedPet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Elimina una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota eliminada
 *       404:
 *         description: Mascota no encontrada
 */
router.delete('/pets/:id', async (req, res) => {
    try {
        const result = await petService.deletePet(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /pets/{id}/adopt:
 *   post:
 *     summary: Un superhéroe adopta una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               heroId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mascota adoptada
 *       400:
 *         description: Mascota ya adoptada o no encontrada
 */
router.post('/pets/:id/adopt', [
    check('heroId').not().isEmpty().withMessage('El id del superhéroe es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const pet = await petService.adoptPet(req.params.id, req.body.heroId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router; 