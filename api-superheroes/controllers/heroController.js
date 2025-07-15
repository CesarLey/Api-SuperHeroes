import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroService.js";
import petService from "../services/petService.js";
import Hero from "../models/heroModel.js";

const router = express.Router();

/**
 * @swagger
 * /heroes:
 *   get:
 *     summary: Obtiene todos los héroes
 *     tags: [Héroes]
 *     responses:
 *       200:
 *         description: Lista de héroes
 */
router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes:
 *   post:
 *     summary: Crea un nuevo héroe
 *     tags: [Héroes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               alias:
 *                 type: string
 *               city:
 *                 type: string
 *               team:
 *                 type: string
 *     responses:
 *       201:
 *         description: Héroe creado
 *       400:
 *         description: Error de validación
 */
router.post("/heroes",
    [
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('alias').not().isEmpty().withMessage('El alias es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array() })
        }

        try {
            const { name, alias, city, team } = req.body;
            const newHero = new Hero(null, name, alias, city, team);
            const addedHero = await heroService.addHero(newHero);

            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

/**
 * @swagger
 * /heroes/{id}:
 *   put:
 *     summary: Actualiza un héroe existente
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               alias:
 *                 type: string
 *               city:
 *                 type: string
 *               team:
 *                 type: string
 *     responses:
 *       200:
 *         description: Héroe actualizado
 *       404:
 *         description: Héroe no encontrado
 */
router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/{id}:
 *   delete:
 *     summary: Elimina un héroe
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Héroe eliminado
 *       404:
 *         description: Héroe no encontrado
 */
router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/city/{city}:
 *   get:
 *     summary: Busca héroes por ciudad
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad a buscar
 *     responses:
 *       200:
 *         description: Lista de héroes de la ciudad
 */
router.get('/heroes/city/:city', async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city);
        res.json(heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /heroes/{id}/enfrentar:
 *   post:
 *     summary: Enfrenta a un héroe con un villano
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del héroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               villain:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resultado del enfrentamiento
 *       404:
 *         description: Héroe no encontrado
 */
router.post('/heroes/:id/enfrentar', async (req, res) => {
    try {
        const result = await heroService.faceVillain(req.params.id, req.body.villain);
        res.json({ message: result });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

/**
 * @swagger
 * /heroes/{id}/adopt-pet:
 *   post:
 *     summary: Un superhéroe adopta una mascota
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mascota adoptada por el superhéroe
 *       400:
 *         description: Error de validación o mascota ya adoptada
 */
router.post('/heroes/:id/adopt-pet', async (req, res) => {
    const heroId = parseInt(req.params.id);
    const { petId } = req.body;
    if (!petId) {
        return res.status(400).json({ error: "Debes enviar el id de la mascota a adoptar (petId)" });
    }
    try {
        const pet = await petService.adoptPet(petId, heroId);
        res.json({ message: `El superhéroe ${heroId} adoptó la mascota ${pet.name}` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/{id}/unadopt-pet:
 *   post:
 *     summary: Un superhéroe desadopta (libera) una mascota
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del superhéroe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mascota desadoptada por el superhéroe
 *       400:
 *         description: Error de validación o la mascota no pertenece a ese superhéroe
 */
router.post('/heroes/:id/unadopt-pet', async (req, res) => {
    const heroId = parseInt(req.params.id);
    const { petId } = req.body;
    if (!petId) {
        return res.status(400).json({ error: "Debes enviar el id de la mascota a desadoptar (petId)" });
    }
    try {
        const pets = await import("../repositories/petRepository.js").then(m => m.default.getPets());
        const pet = pets.find(p => p.id === parseInt(petId));
        if (!pet) {
            return res.status(400).json({ error: "Mascota no encontrada" });
        }
        if (pet.adoptedBy !== heroId) {
            return res.status(400).json({ error: "La mascota no pertenece a este superhéroe" });
        }
        pet.adoptedBy = null;
        await import("../repositories/petRepository.js").then(m => m.default.savePets(pets));
        res.json({ message: `El superhéroe ${heroId} desadoptó la mascota ${pet.name}` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/{id}/mascotas-adoptadas:
 *   get:
 *     summary: Obtiene las mascotas adoptadas por un superhéroe, junto con el nombre del superhéroe
 *     tags: [Héroes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del superhéroe
 *     responses:
 *       200:
 *         description: Lista de mascotas adoptadas y nombre del superhéroe
 *       404:
 *         description: Superhéroe no encontrado
 */
router.get('/heroes/:id/mascotas-adoptadas', async (req, res) => {
    const heroId = parseInt(req.params.id);
    try {
        // Traer héroes y buscar el héroe
        const heroes = await import("../repositories/heroRepository.js").then(m => m.default.getHeroes());
        const hero = heroes.find(h => h.id === heroId);
        if (!hero) {
            return res.status(404).json({ error: "Superhéroe no encontrado" });
        }
        // Traer todas las mascotas
        const pets = await import("../repositories/petRepository.js").then(m => m.default.getPets());
        // Filtrar las que fueron adoptadas por este héroe
        const adoptedPets = pets.filter(pet => pet.adoptedBy === heroId);
        res.json({
            hero: {
                id: hero.id,
                name: hero.name,
                alias: hero.alias
            },
            adoptedPets
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/with-pet:
 *   get:
 *     summary: Lista todos los héroes con su respectiva mascota adoptada y sus estadísticas
 *     tags: [Héroes]
 *     responses:
 *       200:
 *         description: Lista de héroes con mascota adoptada y estadísticas
 */
router.get('/heroes/with-pet', async (req, res) => {
    try {
        const result = await heroService.getHeroesWithAdoptedPets();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router 