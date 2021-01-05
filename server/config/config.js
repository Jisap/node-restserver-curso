


// =========
//  Puerto
// ==========

process.env.PORT = process.env.PORT || 3000;    // Si la variable process.env.PORT es undefined o null se utiliza el puerto especificado.
                                                // Nuestra aplicación instalada en un servidor no sabemos que puerto nos obligará a usar
                                                // De esta manera configuramos el puerto para producción o desarrollo.    