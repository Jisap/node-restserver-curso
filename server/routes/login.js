//npm install jsonwebtoken --save

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => { // Cuando pongamos en el pathname /login enviaremos unos args y generaremos una respuesta

    let body = req.body;   // Contenido del formulario/args -->email y password

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {    // Dentro del esquema Usuario buscaremos un registro que contenga un email = body.email
                                                                    // generando un usuarioDB

        if(err){                                // Gestión del posible error del server                                                                     //validaciones del esquema
            return res.status(500).json({           
                ok: false,
                err
            });
        }

        if ( !usuarioDB ){                      // Gestión del posible error por fallo de usuario incorrecto
            return res.status(400).json({
                ok:false,
                err:{
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
                                                                    // Gestión del posible error por fallo en la pass
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){ // Si pass del los args no coincide con la pass de la bd
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario o (contraseña) incorrectos'   // Mensaje de error
                }
            });
        }

        let token = jwt.sign({                                          // Si no hay errores jwt se encargará de 
            usuario: usuarioDB
            //lo que queremos almacenar en el token
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})    // Generar el token em base a una semilla(secret) con una caducidad
            //secret            //duración del token
            res.json({                                                      // y mostramos el usuarioDB
                ok:true,
                usuario: usuarioDB,
                token
            })
    })
})











module.exports=app;