import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroService.js";
import petService from "../services/petService.js";
import Hero from "../models/heroModel.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

/**
 * @swagger
 * /heroes/with-pet:
 *   get:
 *     summary: Lista todos los héroes con su respectiva mascota adoptada y sus estadísticas
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de héroes con mascota adoptada y estadísticas
 *       401:
 *         description: Token de acceso requerido
 */
router.get('/heroes/with-pet', async (req, res) => {
    try {
        const result = await heroService.getHeroesWithAdoptedPets(req.user.userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes:
 *   get:
 *     summary: Obtiene todos los héroes del usuario autenticado
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de héroes del usuario
 *       401:
 *         description: No autorizado
 */
router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroesByUser(req.user.userId);
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/{id}:
 *   get:
 *     summary: Obtiene un héroe específico del usuario autenticado
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del héroe
 *     responses:
 *       200:
 *         description: Héroe encontrado
 *       404:
 *         description: Héroe no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/heroes/:id", async (req, res) => {
    try {
        const hero = await heroService.getHeroById(req.params.id, req.user.userId);
        if (!hero) {
            return res.status(404).json({ error: "Héroe no encontrado" });
        }
        res.json(hero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes:
 *   post:
 *     summary: Crea un nuevo héroe para el usuario autenticado
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
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
            const heroData = { name, alias, city, team };
            const addedHero = await heroService.addHero(heroData, req.user.userId);

            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

/**
 * @swagger
 * /heroes/{id}:
 *   put:
 *     summary: Actualiza un héroe existente del usuario autenticado
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
 */
router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body, req.user.userId);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/{id}:
 *   delete:
 *     summary: Elimina un héroe del usuario autenticado
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
 */
router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id, req.user.userId);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/**
 * @swagger
 * /heroes/city/{city}:
 *   get:
 *     summary: Busca héroes por ciudad del usuario autenticado
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Ciudad a buscar
 *     responses:
 *       200:
 *         description: Lista de héroes de la ciudad del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/heroes/city/:city', async (req, res) => {
    try {
        const heroes = await heroService.findHeroesByCity(req.params.city, req.user.userId);
        res.json(heroes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /heroes/{id}/enfrentar:
 *   post:
 *     summary: Enfrenta a un héroe del usuario autenticado con un villano
 *     tags: [Héroes]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: No autorizado
 */
router.post('/heroes/:id/enfrentar', async (req, res) => {
    try {
        const result = await heroService.faceVillain(req.params.id, req.body.villain, req.user.userId);
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
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Token de acceso requerido
 */
router.post('/heroes/:id/adopt-pet', async (req, res) => {
    const heroId = parseInt(req.params.id);
    const { petId } = req.body;
    if (!petId) {
        return res.status(400).json({ error: "Debes enviar el id de la mascota a adoptar (petId)" });
    }
    try {
        const pet = await petService.adoptPet(petId, heroId, req.user.userId);
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
 *     security:
 *       - bearerAuth: []
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
        const pets = await petService.getAllPetsByUser(req.user.userId);
        const pet = pets.find(p => p.id === parseInt(petId));
        if (!pet) {
            return res.status(400).json({ error: "Mascota no encontrada" });
        }
        if (pet.adoptedBy !== heroId) {
            return res.status(400).json({ error: "La mascota no pertenece a este superhéroe" });
        }
        pet.adoptedBy = null;
        await pet.save();
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
 *     security:
 *       - bearerAuth: []
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
        // Traer héroes del usuario y buscar el héroe
        const heroes = await heroService.getAllHeroesByUser(req.user.userId);
        const hero = heroes.find(h => h.id === heroId);
        if (!hero) {
            return res.status(404).json({ error: "Superhéroe no encontrado" });
        }
        // Traer todas las mascotas del usuario
        const pets = await petService.getAllPetsByUser(req.user.userId);
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

export default router 