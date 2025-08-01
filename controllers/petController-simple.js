import express from "express";
import { check, validationResult } from 'express-validator';
import petService from "../services/petService.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Ruta de prueba para verificar que el controlador funciona
router.get("/pets/test", (req, res) => {
    res.json({ message: "Controlador de mascotas funcionando correctamente" });
});

// Rutas básicas sin documentación Swagger
router.get("/pets", async (req, res) => {
    try {
        const pets = await petService.getAllPetsByUser(req.user.userId);
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
            const petData = { name, type };
            const addedPet = await petService.addPet(petData, req.user.userId);
            res.status(201).json(addedPet);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.put("/pets/:id", async (req, res) => {
    try {
        const updatedPet = await petService.updatePet(req.params.id, req.body, req.user.userId);
        res.json(updatedPet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/pets/:id', async (req, res) => {
    try {
        const result = await petService.deletePet(req.params.id, req.user.userId);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/pets/:id/adopt', [
    check('heroId').not().isEmpty().withMessage('El id del superhéroe es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const pet = await petService.adoptPet(req.params.id, req.body.heroId, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/alimentar', async (req, res) => {
    try {
        const cantidad = req.body.cantidad || 20;
        const pet = await petService.alimentarPet(req.params.id, cantidad, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/banar', async (req, res) => {
    try {
        const pet = await petService.banarPet(req.params.id, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/pasear', async (req, res) => {
    try {
        const pet = await petService.pasearPet(req.params.id, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/equipar_ropa', async (req, res) => {
    try {
        const pet = await petService.equiparRopaPet(req.params.id, req.body, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/curar', async (req, res) => {
    try {
        const pet = await petService.curarPet(req.params.id, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/pocion_salud', async (req, res) => {
    try {
        const pet = await petService.usarPocionSaludPet(req.params.id, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/revivir', async (req, res) => {
    try {
        const pet = await petService.revivirPet(req.params.id, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/pets/:id/estado', async (req, res) => {
    try {
        const pet = await petService.getPetById(req.params.id, req.user.userId);
        res.json(pet);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router; 