import mongoose from 'mongoose';
import Hero from './models/heroModel.js';
import Pet from './models/petModel.js';

const mongoUri = 'mongodb+srv://cesarley15:qWyMmxTAZJ1U7fPD@cluster0.asaxiov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Datos originales de superheroes.json
const heroes = [
  { "id": 1, "name": "Bruce Wayne", "alias": "Batman", "city": "Gotham", "team": "Justice League" },
  { "id": 2, "name": "Clark Kent", "alias": "Superman", "city": "Metropolis", "team": "Justice League" },
  { "id": 3, "name": "Diana Prince", "alias": "Wonder Woman", "city": "Themyscira", "team": "Justice League" },
  { "id": 4, "name": "Barry Allen", "alias": "Flash", "city": "Central City", "team": "Justice League" },
  { "id": 5, "name": "Hal Jordan", "alias": "Green Lantern", "city": "Coast City", "team": "Justice League" },
  { "id": 6, "name": "Arthur Curry", "alias": "Aquaman", "city": "Atlantis", "team": "Justice League" },
  { "id": 7, "name": "Victor Stone", "alias": "Cyborg", "city": "Detroit", "team": "Justice League" },
  { "id": 8, "name": "Oliver Queen", "alias": "Green Arrow", "city": "Star City", "team": "Justice League" },
  { "id": 9, "name": "Billy Batson", "alias": "Shazam", "city": "Fawcett City", "team": "Justice League" },
  { "id": 10, "name": "J'onn J'onzz", "alias": "Martian Manhunter", "city": "Mars", "team": "Justice League" }
];

// Datos originales de pets.json
const pets = [
{"id":1,"name":"Krypto","type":"Perro","adoptedBy":2,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:23:53.563Z","muerta":true},{"id":2,"name":"Dex-Starr","type":"Gato","adoptedBy":null,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:28:33.227Z","muerta":true},{"id":3,"name":"Ace","type":"Perro","adoptedBy":1,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:28:33.227Z","muerta":true},{"id":4,"name":"Comet","type":"Caballo","adoptedBy":3,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:28:33.227Z","muerta":true},{"id":5,"name":"Jumpa","type":"Canguro","adoptedBy":null,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:12:33.227Z","muerta":true},{"id":6,"name":"Streaky","type":"Gato","adoptedBy":null,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:28:33.227Z","muerta":true},{"id":7,"name":"Beppo","type":"Mono","adoptedBy":null,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:28:33.227Z","muerta":true},{"id":8,"name":"Bat-Cow","type":"Vaca","adoptedBy":null,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:28:33.227Z","muerta":true},{"id":9,"name":"Hoppy","type":"Conejo","adoptedBy":9,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[{"nombre":"sombrero","tipo":"gratis"}],"enfermo":true,"ultimoEstado":"2025-07-15T03:28:42.937Z","muerta":true},{"id":10,"name":"Top Dog","type":"Perro","adoptedBy":null,"salud":0,"felicidad":0,"hambre":100,"limpieza":0,"ropa":[],"enfermo":true,"ultimoEstado":"2025-07-15T03:28:33.227Z","muerta":true}
];

async function migrate() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB para migración.');

    // Limpiar colecciones antes de migrar
    await Hero.deleteMany({});
    await Pet.deleteMany({});

    // Insertar datos
    await Hero.insertMany(heroes);
    await Pet.insertMany(pets);

    console.log('Migración completada.');
  } catch (err) {
    console.error('Error en la migración:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB.');
  }
}

migrate(); 