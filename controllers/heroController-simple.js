import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroService.js";
import petService from "../services/petService.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas básicas sin documentación Swagger
router.get('/heroes/with_pet', async (req, res) => {
    try {
        const result = await heroService.getHeroesWithAdoptedPets(req.user.userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroesByUser(req.user.userId);
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body, req.user.userId);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id, req.user.userId);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router; 