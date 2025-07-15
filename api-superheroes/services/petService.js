import Pet from '../models/petModel.js';

function calcularEstadoDinamico(pet) {
    if (pet.muerta) {
        return pet;
    }
    const ahora = new Date();
    const ultimo = new Date(pet.ultimoEstado);
    const segundos = Math.floor((ahora - ultimo) / 1000);
    const intervalos = Math.floor(segundos / 30);
    if (intervalos > 0) {
        pet.hambre = Math.min(100, pet.hambre + intervalos * 10);
        pet.felicidad = Math.max(0, pet.felicidad - intervalos * 6);
        pet.limpieza = Math.max(0, pet.limpieza - intervalos * 6);
        if (pet.hambre > 70) pet.salud = Math.max(0, pet.salud - intervalos * 10);
        if (pet.limpieza < 30) pet.salud = Math.max(0, pet.salud - intervalos * 10);
        if (pet.hambre < 30 && pet.limpieza > 70) pet.salud = Math.min(100, pet.salud + intervalos * 4);
        if (pet.salud < 30) pet.enfermo = true;
        else pet.enfermo = false;
        pet.ultimoEstado = new Date(ultimo.getTime() + intervalos * 30000).toISOString();
    }
    if (pet.salud === 0 && pet.felicidad === 0 && pet.limpieza === 0 && pet.hambre === 100) {
        pet.muerta = true;
    } else {
        pet.muerta = false;
    }
    return pet;
}

async function getAllPets() {
    const pets = await Pet.find();
    // Recalcula y guarda el estado dinámico de todas las mascotas
    for (const pet of pets) {
        calcularEstadoDinamico(pet);
        await pet.save();
    }
    return await Pet.find();
}

async function getPetById(id) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

async function addPet(pet) {
    if (!pet.name || !pet.type) {
        throw new Error("La mascota debe tener nombre y tipo.");
    }
    const lastPet = await Pet.findOne().sort({ id: -1 });
    const newId = lastPet ? lastPet.id + 1 : 1;
    const newPet = new Pet({ ...pet, id: newId });
    await newPet.save();
    return newPet;
}

async function updatePet(id, updatedPet) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    Object.assign(pet, updatedPet);
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

async function deletePet(id) {
    const result = await Pet.deleteOne({ id: parseInt(id) });
    if (result.deletedCount === 0) throw new Error('Mascota no encontrada');
    return { message: 'Mascota eliminada' };
}

async function adoptPet(petId, heroId) {
    const pet = await Pet.findOne({ id: parseInt(petId) });
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.adoptedBy) throw new Error('La mascota ya fue adoptada');
    pet.adoptedBy = heroId;
    pet.ultimoEstado = new Date().toISOString();
    await pet.save();
    return pet;
}

async function alimentarPet(id, cantidad = 20) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes alimentar mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes alimentar a una mascota muerta');
    pet.hambre = Math.max(0, pet.hambre - cantidad);
    pet.felicidad = Math.min(100, pet.felicidad + 10);
    if (pet.hambre < 30) pet.salud = Math.min(100, pet.salud + 5);
    pet.ultimoEstado = new Date().toISOString();
    await pet.save();
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

async function banarPet(id) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes bañar mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes bañar a una mascota muerta');
    pet.limpieza = Math.min(100, pet.limpieza + 40);
    pet.felicidad = Math.min(100, pet.felicidad + 5);
    pet.ultimoEstado = new Date().toISOString();
    await pet.save();
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

async function pasearPet(id) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes pasear mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes pasear a una mascota muerta');
    pet.felicidad = Math.min(100, pet.felicidad + 10);
    pet.hambre = Math.min(100, pet.hambre + 10);
    pet.salud = Math.min(100, pet.salud + 5);
    pet.ultimoEstado = new Date().toISOString();
    await pet.save();
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

async function equiparRopaPet(id, ropa) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes equipar ropa a mascotas adoptadas');
    if (!ropa || !ropa.nombre || !ropa.tipo) throw new Error('Debes especificar la prenda (nombre, tipo)');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes equipar ropa a una mascota muerta');
    if (!pet.ropa) pet.ropa = [];
    pet.ropa.push(ropa);
    pet.felicidad = Math.min(100, pet.felicidad + 2);
    pet.ultimoEstado = new Date().toISOString();
    await pet.save();
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

async function curarPet(id) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes curar mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes curar a una mascota muerta');
    if (!pet.enfermo) throw new Error('La mascota no está enferma');
    pet.enfermo = false;
    pet.salud = Math.min(100, pet.salud + 20);
    pet.felicidad = Math.min(100, pet.felicidad + 10);
    pet.ultimoEstado = new Date().toISOString();
    await pet.save();
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

async function usarPocionSaludPet(id) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes usar la poción en mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes usar la poción en una mascota muerta');
    pet.salud = 100;
    pet.enfermo = false;
    pet.ultimoEstado = new Date().toISOString();
    await pet.save();
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

async function revivirPet(id) {
    const pet = await Pet.findOne({ id: parseInt(id) });
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.muerta) throw new Error('La mascota no está muerta, no es necesario revivirla');
    pet.salud = 100;
    pet.felicidad = 100;
    pet.limpieza = 100;
    pet.hambre = 50;
    pet.enfermo = false;
    pet.muerta = false;
    pet.ultimoEstado = new Date().toISOString();
    await pet.save();
    calcularEstadoDinamico(pet);
    await pet.save();
    return pet;
}

export default {
    getAllPets,
    getPetById,
    addPet,
    updatePet,
    deletePet,
    adoptPet,
    alimentarPet,
    banarPet,
    pasearPet,
    equiparRopaPet,
    curarPet,
    usarPocionSaludPet,
    revivirPet
}; 