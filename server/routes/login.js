//npm install jsonwebtoken --save
//npm install google-auth-library --save

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');  // Requerimos la libreria de autenticación de google
const client = new OAuth2Client(process.env.CLIENT_ID); // Creamos una instancia de autenticación de google con el identificador id de google

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
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})    // generar el token em base a una semilla(secret) con una caducidad
            //secret            //duración del token
            res.json({                                                  // y mostramos el usuarioDB
                ok:true,
                usuario: usuarioDB,
                token
            });

    });
});

// Configuraciones de Google

async function verify(token) {                          // Verificación token mediante función async -> Promesa de resp
  const ticket = await client.verifyIdToken({           // Cuando se verifica creamos un ticket basado en
      idToken: token,                                   // el token de google
      audience: process.env.CLIENT_ID,                  // y nuestras credenciales
  });
  const payload = ticket.getPayload();                  // Con la verificación realizada creamos la carga útil de información en un payload
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);

    return {                                            // Retornamos con todo ello un objeto
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  
}


app.post('/google', async(req, res) => {        // Ruta para autenticación con google

    let token = req.body.idtoken                // Recibimos el token generado por google

    let googleUser = await verify(token)       // Verificamos su atenticidad 
                        .catch(e =>{
                            return res.status(403).json({   // Gestión del posible error
                                ok: false,
                                err: e
                            });
                        })
                                                                        // Si no hay errores la verificación fue correcta
    Usuario.findOne({email:googleUser.email}, (err, usuarioDB) => {     // Dentro del esquema Usuario buscaremos un email que 
                                                                        // coincida con el dado por googleUsery generaremos un usuarioDB

        if(err){                                // Gestión del posible error del server                                                                     
            return res.status(500).json({           
                ok: false,
                err
            });
        }

        if (usuarioDB){                         // Si usuarioDB ya existia porque se logueo de otra manera                                       
            if(usuarioDB.google === false) {    // y no estaba logueado con google
                return res.status(400).json({   // mensaje de error (un usuario no se puede logear dos veces)         
                    ok: false,
                    err:{
                        message: "Debe usar su autenticación normal"
                    }
                });    
            }else{                              // Si usuarioDB no existia pero se logeo antes por google
                let token = jwt.sign({          // Renovamos el token de ese usuarioDB                                
                   usuario: usuarioDB
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{  // Si el usuario no existe en nuestra base de datos

            let usuario = new Usuario();                // Instancia de Usuario

            usuario.nombre = googleUser.nombre;         // Rellenamos los campos del usuario
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {          // Generamos un usuarioDB y lo grabamos en la bd

                if(err){                                // Gestión del posible error del server                                                                     //validaciones del esquema
                    return res.status(500).json({           
                        ok: false,
                    err
                    });
                }

                let token = jwt.sign({                  // Generamos un token                               
                   usuario: usuarioDB
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({                       // Devolvemos una respuesta con el usuarioDB creado y su token
                    ok: true,
                    usuario: usuarioDB,
                    token
                });                
            })

        }
    })

    // res.json({                                  
    //     usuario: googleUser
    // });
});




module.exports=app;