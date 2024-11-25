const Mediador = require('./Mediador');

class MediadorConcreto extends Mediador {
    constructor() {
        super();
        this.colegas = new Map();
    }

    registrarColega(nombre, colega) {
        this.colegas.set(nombre, colega);
        colega.setMediador(this);
    }

    notificar(emisor, evento, datos) {
        this.colegas.forEach((colega) => {
            if (colega !== emisor) {
                colega.recibirEvento(evento, datos);
            }
        });
    }
}

module.exports = MediadorConcreto;
