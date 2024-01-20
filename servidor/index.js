const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500"
    },
    pingInterval: 1000,
    pingTimeout: 2000
});

io.on('connection', socket => {
    console.log("cliente conectado");
    const transporteInicial = socket.conn.transport.name;

    socket.on("disonnect", () => {
        console.log("cliente desconectado: ", socket.id);
    });

    socket.on("posicion", (data) => {
        console.log("posición recibida: ", data);
    });

    // cuando se hace el upgrade
    socket.conn.once("upgrade", () => {
        const transporteNuevo = socket.conn.transport.name;
        console.log(`Hemos pasado de ${transporteInicial} a ${transporteNuevo}`);
    });

    socket.emit("evento-presonalizado", "este es un evento personalizado");
    //io.to(socket.id).emit("evento-presonalizado", "este es un evento personalizado");

    io.emit("cliente-conectado", "se ha conectado un nuevo cliente");

})

httpServer.listen(3000)