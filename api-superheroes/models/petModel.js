class Pet {
    constructor(id, name, type, adoptedBy = null, salud = 100, felicidad = 100, hambre = 50, limpieza = 100, ropa = [], enfermo = false, ultimoEstado = null, muerta = false) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.adoptedBy = adoptedBy; // id del superhéroe que la adoptó, o null
        this.salud = salud;
        this.felicidad = felicidad;
        this.hambre = hambre;
        this.limpieza = limpieza;
        this.ropa = ropa; // array de objetos {nombre, tipo}
        this.enfermo = enfermo;
        this.ultimoEstado = ultimoEstado || new Date().toISOString();
        this.muerta = muerta;
    }
}

export default Pet; 