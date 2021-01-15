//Rutas del usuario

const express = require('express');
const app = express();
const Usuario = require('../models/usuario');  // Usuario Esquema es un objeto JSON que permite definir la forma y el contenido de documentos incrustados en una colección. 
const bcrypt = require('bcrypt'); 
const _= require('underscore');

// Las propiedades..

//req.query  : Provienen de parámetros de consulta en la url : http://foo.com/somePath?name=ted --> req.query.name="ted"
//req.params : Provienen de segmentos de ruta de la url que coinciden con un parámetro en la definición de ruta : /song/:id -> req.params.id
//req.body   : Provienen de una publicación de un formulario


app.get('/usuario', function (req, res) {      // Cuando el path sea un '/usuario' la respuesta del server express será 'get Usuario'
  //res.json('get Usuario')                    // El método GET  solicita una representación de un recurso específico. 
                                               // Las peticiones que usan el método GET sólo deben recuperar datos. 

    let desde = req.query.desde || 0;          // La petición puede tener parámetros opcionales(desde = donde comienza a mostrar), sino los lleva desde=0)
    desde=Number(desde);

    let limite = req.query.limite || 5;        // Limite es otro parámetro opcional 
    limite = Number(limite);

            //cond busqueda     //campos o prop queremos mostrar
    Usuario.find({estado:true}, 'nombre email role estado google')  // Usando el esquema Usuario mongoose buscará los registros ({filtros})
            .skip(desde)                                            // Se saltará a los primeros (x) registros 
            .limit(limite)                                          // Límite de 5 registros por página 
            .exec((err, usuarios)=>{                                // El rdo de la busqueda sera un array (usuarios) 

                if(err){
                    return res.status(400).json({                   // Gestión del posible error
                        ok: false,
                        err
                    });
                }
                            //cond busqueda
                Usuario.count({estado:true}, (err, conteo)=>{  // Usando el esquema Usuario mogoose contará cuantos registros
                                                               // han cumplido las condiciones anteriores
                    res.json({
                        ok: true,
                        usuarios: usuarios,                    // Mostramos el array de objetos usuarios
                        cuantos: conteo                        // Mostramos el conteo de registros.
                    })
                })
            })
});

app.post('/usuario', function (req, res){       // Lo mismo pero con una petición post (se utiliza para enviar una entidad a un recurso en específico, 
                                                // causando a menudo un cambio en el estado o efectos secundarios en el servidor)
    let body = req.body;                        
               //args                           // body contiene todos los argumentos de la petición al server       
    
    let usuario = new Usuario({                 // Definimos nuestra instancia de Usuario esquema
        nombre: body.nombre,                    // Rellenamos el esquema (Usuario) con los argumentos que nos da el post y lo llamamos usuario
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),  // Encriptación de la password 
        role: body.role
    });
                //res de mongodb
    usuario.save((err, usuarioDB) => {          // Grabamos lo que nos viene por el post (usuario) y obtenemos una respuesta de mongoose -> usuarioDB

        if(err){
            return res.status(400).json({       // Gestión del posible error
                ok: false,
                err
            });
        }

        //usuarioDB.password=null               // Para que no se muestre información sobre la password

        res.json({                              //Si todo va bien retornamos ok y usuario grabado en mongodb
            ok: true,
            usuario: usuarioDB
        })
    })

});


app.put('/usuario/:id', function (req, res) {   // Put se utiliza para actualizar registros, en este caso según id
  
    let id = req.params.id;                                                  // Obtenemos del parámetro del Id
    let body = _.pick(req.body,['nombre','email','img','role','estado']);    // Obtenemos todos los args del formulario pasados al req (petición) 
                                                                             // Estos args estarán filtrados para tener solo valores
                                                                             // de las claves permitidas.   


    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators: true}, (err, usuarioDB) => {   //Usamos el modelo (Usuario), el body (args) y un id
                                                                                                 //La función findByIdUpdate buscará en mongoDb un usuarioDB(id) 
                                                                                                 //y lo actualizará con el body.   
                                                                                                 //new:true -> mostrará el usuarioDb actualizado
                                                                                                 //runValidators: true -> validará campos del body según 
        if(err){                                                                                 //validaciones del esquema
            return res.status(400).json({       // Gestión del posible error
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB                  // UsuarioDB actualizado
        });
    })
});

app.delete('/usuario/:id', function (req, res) {             // delete cambia el estado de algo para que no este disponible
 
    let id= req.params.id;                                   // Identificamos el id de los parámetros

    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{ // Usando el esquema Usuario buscaremos en la bd el registro correspondiente al id
                                                             // lo borraremos físicamente y generaremos un usuarioBorrado

    let cambiaEstado = {
        estado:false                                         // Propiedad que queremos cambiar
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true}, (err, usuarioBorrado)=>{ 
                                                                         // Usando el esquema Usuario buscaremos en la bd el registro corresp al id  
                                                                         // cambiaremos la prop especificada y generaremos un usuarioBorrado       
        if(err){                                                                                 
            return res.status(400).json({                   // Gestión del posible error
                ok: false,
                err
            });
        }
    
        if(!usuarioBorrado){                                // Si el usuario ya ha sido borrado o no existe ...
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            usuario: usuarioBorrado
        })


    })




});

module.exports=app;