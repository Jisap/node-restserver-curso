const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion'); // Todas las peticiones que se hagan necesitarán que el usuario este autenticado--> necesario token
let { verificaAdmin_Role } = require('../middlewares/autenticacion')
let app = express();
let Categoria = require('../models/categoria');

//===============================
//  Mostrar todas las categorias
//===============================
app.get('/categoria',verificaToken, (req, res) => {

    Categoria.find({})
              .sort('descripcion')
              .populate('usuario', 'nombre email')   // populate revisa que id u objects ids existen en la categoria que estamos buscando
              .exec((err,categorias) => {            // Una vez encontrado seleccionamos de ese otro esquema usuario que queremos mostrar

                if(err){
                    return res.status(500).json({       // Gestión del posible error enla bd
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    categorias
                })
              });

});

//===============================
//  Mostrar una categoria por ID
//===============================
app.get('/categoria/:id',verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if(err){
            return res.status(500).json({       // Gestión del posible error enla bd
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(500).json({       // Gestión del posible error enla bd
                ok: false,
                err:{
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

//===============================
//  Crear nueva categoria
//===============================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;     // body contiene todos los argumentos de la petición al server con los que hacer la creación de la categoria

    let categoria = new Categoria({         // Instancia de nueva categoria
        descripcion: body.descripcion,      // la descripción que viene por argumentos    
        usuario: req.usuario._id            // y la id del usuario logueado.(Para crear una categoria hemos tenido que loguear->usuario y token)
    });

    categoria.save((err, categoriaDB) => {

        if(err){
            return res.status(500).json({       // Gestión del posible error enla bd
                ok: false,
                err
            });
        }

        res.json({                              // Sino hubo errores generamos la respuesta y la imprimimos.
            ok: true,
            categoria: categoriaDB
        });
    });
});

//=============================================
//  Actualizar descripción de  una categoria
//=============================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;                                     // Id según parámetros 
    let body = req.body;                                        // Body según argumentos
    let descCategoria = { descripcion: body.descripcion };      // Esto es lo que queremos actualizar

    Categoria.findByIdAndUpdate(id, descCategoria, {new:true, runValidators: true}, (err, categoriaDB) =>{

        if(err){
            return res.status(500).json({       // Gestión del posible error enla bd
                ok: false,
                err
            });
        }

        if (!categoriaDB){
            return res.status(400).json({       // Gestión del error si no existia la categoría
                ok:false,
                err
            });
        }

        res.json({                              // Sino hubo errores generamos la respuesta con sus categoría actualizadda y la imprimimos.
            ok: true,
            categoria: categoriaDB
        });
    });

});

//===============================
//  Borrar nueva categoria
//===============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
                                        //categoriaBorrada
        if(err){
            return res.status(500).json({       // Gestión del posible error enla bd
                ok: false,
                err
            });
        }
        
        if (!categoriaDB){
            return res.status(400).json({       // Gestión del error si no existia la categoría
                ok:false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok:true,
            message: 'Categoria borrada'
        })
    })
});


module.exports = app;