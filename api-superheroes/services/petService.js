import petRepository from '../repositories/petRepository.js';

async function getAllPets() {
    return await petRepository.getPets();
}

async function addPet(pet) {
    if (!pet.name || !pet.type) {
        throw new Error("La mascota debe tener nombre y tipo.");
    }
    const pets = await petRepository.getPets();
    const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 1;
    const newPet = { ...pet, id: newId, adoptedBy: null };
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
    await petRepository.savePets(pets);
    return pets[index];
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
    await petRepository.savePets(pets);
    return pet;
}

export default {
    getAllPets,
    addPet,
    updatePet,
    deletePet,
    adoptPet
}; 