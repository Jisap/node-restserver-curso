


// =========
//  Puerto
// ==========

process.env.PORT = process.env.PORT || 3000;    // Si la variable process.env.PORT es undefined o null se utiliza el puerto especificado.
                                                // Nuestra aplicación instalada en un servidor no sabemos que puerto nos obligará a usar
                                                // De esta manera configuramos el puerto para producción o desarrollo.    

// =========
//  Entorno
// ==========

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //Si la variable process.env.NODE.ENV no existe supondremos que estamos en desarrollo

// ===============
//  Base de datos
// ===============

let urlDB;

if (process.env.NODE_ENV === 'dev') {           // Si el entorno en el que trabajamos es desarrollo 'dev'

    urlDB = 'mongodb://localhost:27017/cafe'    // la dirección de la bd sera localhost

}else{                                          // Sino...

    urlDB = 'mongodb+srv://new-user2021:KyGA7Gr68i9oYdOT@cluster0.rhelh.mongodb.net/Cafe'   //la dirección será la de Mongo Atlas DB

}

process.env.URLDB = urlDB;

