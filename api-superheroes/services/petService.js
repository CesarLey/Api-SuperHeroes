import petRepository from '../repositories/petRepository.js';

function calcularEstadoDinamico(pet) {
    if (pet.muerta) {
        // Si ya está muerta, no modificar nada
        return pet;
    }
    const ahora = new Date();
    const ultimo = new Date(pet.ultimoEstado);
    const segundos = Math.floor((ahora - ultimo) / 1000);
    const intervalos = Math.floor(segundos / 30); // Cada 30 segundos

    console.log('--- calcularEstadoDinamico ---');
    console.log('ID:', pet.id);
    console.log('ahora:', ahora.toISOString());
    console.log('ultimoEstado:', pet.ultimoEstado);
    console.log('segundos transcurridos:', segundos);
    console.log('intervalos de 10s:', intervalos);
    console.log('ANTES -> hambre:', pet.hambre, 'felicidad:', pet.felicidad, 'limpieza:', pet.limpieza, 'salud:', pet.salud, 'enfermo:', pet.enfermo, 'muerta:', pet.muerta);

    if (intervalos > 0) {
        // Hambre sube más rápido
        pet.hambre = Math.min(100, pet.hambre + intervalos * 10);
        // Felicidad y limpieza bajan más rápido
        pet.felicidad = Math.max(0, pet.felicidad - intervalos * 6);
        pet.limpieza = Math.max(0, pet.limpieza - intervalos * 6);
        // Salud baja más rápido si hambre o limpieza están mal
        if (pet.hambre > 70) pet.salud = Math.max(0, pet.salud - intervalos * 10);
        if (pet.limpieza < 30) pet.salud = Math.max(0, pet.salud - intervalos * 10);
        // Salud sube más rápido si hambre baja y limpieza alta
        if (pet.hambre < 30 && pet.limpieza > 70) pet.salud = Math.min(100, pet.salud + intervalos * 4);
        // Enfermedad si salud baja mucho
        if (pet.salud < 30) pet.enfermo = true;
        else pet.enfermo = false;
        // Solo actualiza ultimoEstado si hubo cambios
        pet.ultimoEstado = new Date(ultimo.getTime() + intervalos * 30000).toISOString();
    }

    // Lógica de muerte: si salud, felicidad y limpieza llegan a 0 y hambre llega a 100
    if (pet.salud === 0 && pet.felicidad === 0 && pet.limpieza === 0 && pet.hambre === 100) {
        pet.muerta = true;
    } else {
        pet.muerta = false;
    }

    console.log('DESPUÉS -> hambre:', pet.hambre, 'felicidad:', pet.felicidad, 'limpieza:', pet.limpieza, 'salud:', pet.salud, 'enfermo:', pet.enfermo, 'muerta:', pet.muerta);
    console.log('nuevo ultimoEstado:', pet.ultimoEstado);
    console.log('-----------------------------');
    return pet;
}

async function getAllPets() {
    const pets = await petRepository.getPets();
    // Recalcula y guarda el estado dinámico de todas las mascotas
    const petsActualizados = pets.map(pet => calcularEstadoDinamico(pet));
    await petRepository.savePets(petsActualizados);
    return petsActualizados;
}

async function getPetById(id) {
    const pets = await petRepository.getPets();
    const pet = pets.find(p => p.id === parseInt(id));
    if (!pet) throw new Error('Mascota no encontrada');
    // Recalcula y guarda el estado dinámico
    const petActualizado = calcularEstadoDinamico(pet);
    await petRepository.savePets(pets);
    return petActualizado;
}

async function addPet(pet) {
    if (!pet.name || !pet.type) {
        throw new Error("La mascota debe tener nombre y tipo.");
    }
    const pets = await petRepository.getPets();
    const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    const newPet = { ...pet, id: newId, adoptedBy: null, salud: 100, felicidad: 100, hambre: 50, limpieza: 100, ropa: [], enfermo: false, ultimoEstado: new Date().toISOString() };
    pets.push(newPet);
    await petRepository.savePets(pets);
    return newPet;
}

async function updatePet(id, updatedPet) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    delete updatedPet.id;
    pets[index] = { ...pets[index], ...updatedPet };
    // Recalcula y guarda el estado dinámico tras la actualización
    const petActualizado = calcularEstadoDinamico(pets[index]);
    pets[index] = petActualizado;
    await petRepository.savePets(pets);
    return petActualizado;
}

async function deletePet(id) {
    const pets = await petRepository.getPets();
    const index = pets.findIndex(pet => pet.id === parseInt(id));
    if (index === -1) throw new Error('Mascota no encontrada');
    const filteredPets = pets.filter(pet => pet.id !== parseInt(id));
    await petRepository.savePets(filteredPets);
    return { message: 'Mascota eliminada' };
}

async function adoptPet(petId, heroId) {
    const pets = await petRepository.getPets();
    const pet = pets.find(p => p.id === parseInt(petId));
    if (!pet) throw new Error('Mascota no encontrada');
    if (pet.adoptedBy) throw new Error('La mascota ya fue adoptada');
    pet.adoptedBy = heroId;
    pet.ultimoEstado = new Date().toISOString();
    await petRepository.savePets(pets);
    return pet;
}

async function alimentarPet(id, cantidad = 20) {
    let pets = await petRepository.getPets();
    let pet = pets.find(p => p.id === parseInt(id));
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes alimentar mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes alimentar a una mascota muerta');
    pet.hambre = Math.max(0, pet.hambre - cantidad);
    pet.felicidad = Math.min(100, pet.felicidad + 10);
    if (pet.hambre < 30) pet.salud = Math.min(100, pet.salud + 5);
    pet.ultimoEstado = new Date().toISOString();
    await petRepository.savePets(pets);
    // Vuelve a leer y recalcular para asegurar coherencia
    pets = await petRepository.getPets();
    pet = pets.find(p => p.id === parseInt(id));
    const petActualizado = calcularEstadoDinamico(pet);
    await petRepository.savePets(pets);
    return petActualizado;
}

async function banarPet(id) {
    let pets = await petRepository.getPets();
    let pet = pets.find(p => p.id === parseInt(id));
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes bañar mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes bañar a una mascota muerta');
    pet.limpieza = Math.min(100, pet.limpieza + 40);
    pet.felicidad = Math.min(100, pet.felicidad + 5);
    pet.ultimoEstado = new Date().toISOString();
    await petRepository.savePets(pets);
    pets = await petRepository.getPets();
    pet = pets.find(p => p.id === parseInt(id));
    const petActualizado = calcularEstadoDinamico(pet);
    await petRepository.savePets(pets);
    return petActualizado;
}

async function pasearPet(id) {
    let pets = await petRepository.getPets();
    let pet = pets.find(p => p.id === parseInt(id));
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes pasear mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes pasear a una mascota muerta');
    pet.felicidad = Math.min(100, pet.felicidad + 10);
    pet.hambre = Math.min(100, pet.hambre + 10);
    pet.salud = Math.min(100, pet.salud + 5);
    pet.ultimoEstado = new Date().toISOString();
    await petRepository.savePets(pets);
    pets = await petRepository.getPets();
    pet = pets.find(p => p.id === parseInt(id));
    const petActualizado = calcularEstadoDinamico(pet);
    await petRepository.savePets(pets);
    return petActualizado;
}

async function equiparRopaPet(id, ropa) {
    let pets = await petRepository.getPets();
    let pet = pets.find(p => p.id === parseInt(id));
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes equipar ropa a mascotas adoptadas');
    if (!ropa || !ropa.nombre || !ropa.tipo) throw new Error('Debes especificar la prenda (nombre, tipo)');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes equipar ropa a una mascota muerta');
    if (!pet.ropa) pet.ropa = [];
    pet.ropa.push(ropa);
    pet.felicidad = Math.min(100, pet.felicidad + 2);
    pet.ultimoEstado = new Date().toISOString();
    await petRepository.savePets(pets);
    pets = await petRepository.getPets();
    pet = pets.find(p => p.id === parseInt(id));
    const petActualizado = calcularEstadoDinamico(pet);
    await petRepository.savePets(pets);
    return petActualizado;
}

async function curarPet(id) {
    let pets = await petRepository.getPets();
    let pet = pets.find(p => p.id === parseInt(id));
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes curar mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes curar a una mascota muerta');
    if (!pet.enfermo) throw new Error('La mascota no está enferma');
    pet.enfermo = false;
    pet.salud = Math.min(100, pet.salud + 20);
    pet.felicidad = Math.min(100, pet.felicidad + 10);
    pet.ultimoEstado = new Date().toISOString();
    await petRepository.savePets(pets);
    pets = await petRepository.getPets();
    pet = pets.find(p => p.id === parseInt(id));
    const petActualizado = calcularEstadoDinamico(pet);
    await petRepository.savePets(pets);
    return petActualizado;
}

async function usarPocionSaludPet(id) {
    let pets = await petRepository.getPets();
    let pet = pets.find(p => p.id === parseInt(id));
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.adoptedBy) throw new Error('Solo puedes usar la poción en mascotas adoptadas');
    calcularEstadoDinamico(pet);
    if (pet.muerta) throw new Error('No puedes usar la poción en una mascota muerta');
    pet.salud = 100;
    pet.enfermo = false;
    pet.ultimoEstado = new Date().toISOString();
    await petRepository.savePets(pets);
    // Vuelve a leer y recalcular para asegurar coherencia
    pets = await petRepository.getPets();
    pet = pets.find(p => p.id === parseInt(id));
    const petActualizado = calcularEstadoDinamico(pet);
    await petRepository.savePets(pets);
    return petActualizado;
}

async function revivirPet(id) {
    let pets = await petRepository.getPets();
    let pet = pets.find(p => p.id === parseInt(id));
    if (!pet) throw new Error('Mascota no encontrada');
    if (!pet.muerta) throw new Error('La mascota no está muerta, no es necesario revivirla');
    pet.salud = 100;
    pet.felicidad = 100;
    pet.limpieza = 100;
    pet.hambre = 50;
    pet.enfermo = false;
    pet.muerta = false;
    pet.ultimoEstado = new Date().toISOString();
    await petRepository.savePets(pets);
    // Vuelve a leer y recalcular para asegurar coherencia
    pets = await petRepository.getPets();
    pet = pets.find(p => p.id === parseInt(id));
    const petActualizado = calcularEstadoDinamico(pet);
    await petRepository.savePets(pets);
    return petActualizado;
}

// Aquí irán las acciones: alimentar, bañar, pasear, equipar ropa, etc.

export default {
    getAllPets,
    getPetById,
    addPet,
    updatePet,
    deletePet,
    adoptPet,
    calcularEstadoDinamico,
    alimentarPet,
    banarPet,
    pasearPet,
    equiparRopaPet,
    curarPet,
    usarPocionSaludPet,
    revivirPet
}; 