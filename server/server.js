//npm install express --save
//npm install body-parser --save
//npm i mongoose --save
//npm i mongoose-unique-validator --save
//npm install bcrypt@3.0.6 --save

require('./config/config');

const express = require('express');              // Requerimos el paquete express
const app = express();                           // Lo metemos en una constante app
const bodyParser = require('body-parser');       // Requerimos el paquete body-parser
const mongoose = require('mongoose');            // Requerimos el paquete mongoose pra trabajar con mongodb 



// parse application/x-www-form-urlencoded               //Básicamente, es un middleware para analizar JSON,  
app.use(bodyParser.urlencoded({ extended: false }));     //texto sin formato o simplemente devolver un objeto Buffer
                                                         //sin procesar para que lo maneje como lo necesite.
                                                         //body-parser transformará los argumentos (req) en un objeto JSON manejable
                                                         //los argumentos estarián en el path). Arg->req->body->JSON
// parse application/json
app.use(bodyParser.json());                              //Lo que venga por argumentos se convierten a JSON (req->body) 

// Configuración global de rutas
app.use(require('./routes/index.js'));                   //Importamos y usamos las rutas del usuario


mongoose.connect(process.env.URLDB, {  // Conexion a moongodb en la base de datos cafe
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err) {
                throw err;
 
            }
            console.log('Base de Datos online');
 
        });


app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto: ', 3000)
});