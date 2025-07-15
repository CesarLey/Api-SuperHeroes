import Hero from '../models/heroModel.js';
import petService from './petService.js';

async function getAllHeroes() {
    return await Hero.find();
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }
    // Generar un nuevo id único
    const lastHero = await Hero.findOne().sort({ id: -1 });
    const newId = lastHero ? lastHero.id + 1 : 1;
    const newHero = new Hero({ ...hero, id: newId });
    await newHero.save();
    return newHero;
}

async function updateHero(id, updatedHero) {
    const hero = await Hero.findOne({ id: parseInt(id) });
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    Object.assign(hero, updatedHero);
    await hero.save();
    return hero;
}

async function deleteHero(id) {
    const result = await Hero.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) {
        throw new Error('Héroe no encontrado');
    }
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city) {
    return await Hero.find({ city: { $regex: new RegExp(`^${city}$`, 'i') } });
}

async function faceVillain(heroId, villain) {
    const hero = await Hero.findOne({ id: parseInt(heroId) });
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

async function getHeroesWithAdoptedPets() {
    const heroes = await Hero.find();
    const pets = await petService.getAllPets();
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
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain,
    getHeroesWithAdoptedPets
}; 