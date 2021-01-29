


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

// =======================
//  Vencimiento del token
// =======================
// 60 secs, 60 minutos, 24 horas, 30 días

process.env.CADUCIDAD_TOKEN = 60*60*24*30;

// =========================================
//    Seed  --   Semilla de autenticación
// =========================================
                                                                     // Secret - Semilla de autenticación   
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; // Si la variable process.env.SEED no esta definida en heroku usaremos 
                                                                     // la que esta aquí definida   
// ===============
//  Base de datos
// ===============

let urlDB;

if (process.env.NODE_ENV === 'dev') {           // Si el entorno en el que trabajamos es desarrollo 'dev'

    urlDB = 'mongodb://localhost:27017/cafe'    // la dirección de la bd sera localhost

}else{                                          // Sino...

    urlDB = process.env.MONGO_URI;              //la dirección será la de Mongo Atlas DB --> heroku config --> MONGO_URIgit

}

process.env.URLDB = urlDB;

// =================
//  Google Client ID
// =================

process.env.CLIENT_ID = process.env.CLIENTE_ID || '170305983302-kl47vn7e5n4nse5bei27dankkvr2prbi.apps.googleusercontent.com';

