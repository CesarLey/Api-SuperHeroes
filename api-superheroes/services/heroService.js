import Hero from '../models/heroModel.js';
import petService from './petService.js';

async function getAllHeroes() {
    return await Hero.find();
}

async function getAllHeroesByUser(userId) {
    return await Hero.find({ userId: userId });
}

async function addHero(hero, userId) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }
    // Validar nombre único por usuario
    const existingHero = await Hero.findOne({ name: hero.name, userId: userId });
    if (existingHero) {
        throw new Error("Ya tienes un héroe con ese nombre.");
    }
    // Generar un nuevo id único
    const lastHero = await Hero.findOne().sort({ id: -1 });
    const newId = lastHero ? lastHero.id + 1 : 1;
    const newHero = new Hero({ ...hero, id: newId, userId: userId });
    await newHero.save();
    return newHero;
}

async function updateHero(id, updatedHero, userId) {
    const hero = await Hero.findOne({ id: parseInt(id), userId: userId });
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    Object.assign(hero, updatedHero);
    await hero.save();
    return hero;
}

async function deleteHero(id, userId) {
    const result = await Hero.deleteOne({ id: parseInt(id), userId: userId });
    if (result.deletedCount === 0) {
        throw new Error('Héroe no encontrado');
    }
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city, userId) {
    return await Hero.find({ 
        city: { $regex: new RegExp(`^${city}$`, 'i') },
        userId: userId 
    });
}

async function faceVillain(heroId, villain, userId) {
    const hero = await Hero.findOne({ id: parseInt(heroId), userId: userId });
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

async function getHeroesWithAdoptedPets(userId) {
    const heroes = await Hero.find({ userId: userId });
    const pets = await petService.getAllPetsByUser(userId);
    // Solo héroes que tengan mascota adoptada
    const result = heroes.map(hero => {
        const pet = pets.find(p => p.adoptedBy === hero.id);
        if (pet) {
            return {
                id: hero.id,
                name: hero.name,
                alias: hero.alias,
                city: hero.city,
                team: hero.team,
                mascota: pet
            };
        }
        return null;
    }).filter(h => h !== null);
    return result;
}

export default {
    getAllHeroes,
    getAllHeroesByUser,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain,
    getHeroesWithAdoptedPets
}; 