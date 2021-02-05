
const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');

//============================
//Obtener todos los productos
//============================
app.get('/productos',verificaToken, (req, res) => {

    let desde =req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true})
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {            // Una vez encontrado seleccionamos de ese otro esquema usuario que queremos mostrar

                if(err){
                    return res.status(500).json({       // Gestión del posible error enla bd
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok:true,
                    productos
                })
         });
});
//============================
//Obtener un producto
//=============================
app.get('/productos/:id',verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario','nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
        

        if(err){
            return res.status(500).json({       // Gestión del posible error enla bd
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({       // Gestión del posible error enla bd
                ok: false,
                err:{
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

//==========================
//Buscar productos
//==========================
app.get('/productos/buscar/:termino', verificaToken, (req,res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')            // Expresión regular basada en el termino, i -> insensible a mayúsculas y minúsculas

    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if(err){
                return res.status(500).json({       // Gestión del posible error enla bd
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })
})






//=========================
//Crear un producto
//=========================

app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;     // body contiene todos los argumentos de la petición al server con los que hacer la creación de la categoria

    let producto = new Producto({           // Instancia de nuevo producto
        nombre:body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,      // la descripción y el resto de campos vienen por argumentos del formulario (body)
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id            // y la id del usuario logueado.(Para crear una categoria hemos tenido que loguear->usuario y token)
    });

    producto.save((err, productoDB) => {

        if(err){
            return res.status(500).json({       // Gestión del posible error enla bd
                ok: false,
                err
            });
        }

        res.status(201).json({                  // Sino hubo errores generamos la respuesta y la imprimimos.
            ok: true,
            producto: productoDB
        });
    });
});

//============================
//Actualizar producto
//============================
app.put('/productos/:id', (req, res) => {

    let id = req.params.id;                                     // Id según parámetros 
    let body = req.body;                                        // Body según argumentos

    Producto.findById(id, (err,productoDB) => {

        if(err){
            return res.status(500).json({       // Gestión del posible error enla bd
                ok: false,
                err
            });
        }

        if (!productoDB){
            return res.status(400).json({       // Gestión del error si no existia el producto
                ok:false,
                err: {
                    message: 'El id del producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;                // Actualización
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {    // Guardado en la bd

            if(err){
                return res.status(500).json({           // Gestión del posible error enla bd
                 ok: false,
                 err
                });
            }

            res.json({
                ok:true,
                producto:productoGuardado
            })
        });
        
    });
});

//============================
//Borrar un producto
//============================
app.delete('/productos/:id',verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if(err){
                return res.status(500).json({           // Gestión del posible error enla bd
                 ok: false,
                 err
                });
            }

        if(!productoDB){
            return res.status(400).json({       // Gestión del error si no existia el producto
                ok:false,
                err: {
                    message: 'El id del producto no existe'
                }
            });
        }
        
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if(err){
                return res.status(500).json({           // Gestión del posible error enla bd
                 ok: false,
                 err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            })
        })
    })
});

module.exports = app;