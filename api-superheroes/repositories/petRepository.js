import fs from 'fs-extra';
import Pet from '../models/petModel.js';

const filePath = './pets.json';

async function getPets() {
    try {
        const data = await fs.readJson(filePath);
        return data.map(pet => new Pet(
            pet.id,
            pet.name,
            pet.type,
            pet.adoptedBy,
            pet.salud,
            pet.felicidad,
            pet.hambre,
            pet.limpieza,
            pet.ropa,
            pet.enfermo,
            pet.ultimoEstado,
            pet.muerta // nuevo campo
        ));
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function savePets(pets) {
    try {
        await fs.writeJson(filePath, pets);
    } catch (error) {
        console.error(error);
    }
}

export default {
    getPets,
    savePets
}; 