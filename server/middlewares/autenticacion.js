// ====================
//   VERIFICAR TOKEN
// ====================

const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => { // req:solicitud que yo estoy haciendo, res: respuesta que deseo retornar, next: continua la ejecución del programa
                                          // en la petición del path name
    
    let token = req.get('token')          // Identificamos el token que viene en la petición del pathname

    jwt.verify(token, process.env.SEED, (err, decoded)=>{   // Usamos la función verify de la libreria jwt
                                                            // Usamos el token, el seed y comparamos.   
        if (err) {
            return res.status(401).json({                   // gestionamos el posible error
                ok: false,
                err:{
                    message: 'Token no válido'
                }
            });
        }                                                   // y si el token que se envía coincide con la semilla almacenada en config

        req.usuario = decoded.usuario;                      // el usuario que buscamos = usuario decodificado en base al token
        next();                                             // y continua la ejecución del programa.     
    });

};                                              

// ======================
// Verifica AdminRole
// ======================

let verificaAdmin_Role = (req, res, next) => {              // Comprobamos el Rol del usuario

    let usuario = req.usuario;                              // Rescatamos el usuario decodificado anteriormente            

    if( usuario.role === 'ADMIN_ROLE'){                     // Comprobamos el rol y si es admin
        
        next();                                             // continua
        
    }else{                                                  // sino lo es mensaje de error   
        return res.json({
                 ok:false,
                 err: {
                    message: 'El usuario no es administrador'
                }
        });
    }




}



module.exports = {verificaToken, verificaAdmin_Role}