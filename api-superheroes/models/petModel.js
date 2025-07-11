class Pet {
    constructor(id, name, type, adoptedBy = null) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.adoptedBy = adoptedBy; // id del superhéroe que la adoptó, o null
    }
}

export default Pet; 