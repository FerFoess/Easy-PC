class Mediador {
    notificar(emisor, evento, datos) {
        throw new Error("Método 'notificar' debe ser implementado");
    }
}

module.exports = Mediador;
