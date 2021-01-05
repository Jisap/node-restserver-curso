//npm install express --save
//npm install body-parser --save

require('./config/config');

const express = require('express');              // Requerimos el paquete express
const app = express();                           // Lo metemos en una constante app
const bodyParser = require('body-parser');       // Requerimos el paquete body-parser

// parse application/x-www-form-urlencoded               //Básicamente, es un middleware para analizar JSON,  
app.use(bodyParser.urlencoded({ extended: false }));     //texto sin formato o simplemente devolver un objeto Buffer
                                                         //sin procesar para que lo maneje como lo necesite.
// parse application/json
app.use(bodyParser.json());


app.get('/usuario', function (req, res) {      // Cuando el path sea un '/usuario' la respuesta del server express será 'get Usuario'
  res.json('get Usuario')                      // El método GET  solicita una representación de un recurso específico. 
                                               // Las peticiones que usan el método GET sólo deben recuperar datos. 
});

app.post('/usuario', function (req, res){       // Lo mismo pero con una petición post (se utiliza para enviar una entidad a un recurso en específico, 
                                                // causando a menudo un cambio en el estado o efectos secundarios en el servidor)
    let body = req.body;                        // Este body será el que va a aparecer cuando body-parser procese cualquier payload(argumentos)
                                                // que reciba en las peticiones (los argumentos estarián en el path)       
    
    if(body.nombre === undefined){  // si no me mandan el nombre

      res.status(400).json({        // Le decimos a la persona que envió la información que es lo que falla
        ok: false,
        mensaje: 'El nombre es necesario'
      });

    }else{

      res.json({
        persona: body
      });

    }

});


app.put('/usuario/:id', function (req, res) {   // Put se utiliza para actualizar registros, en este caso según id
  
    let id = req.params.id;

    res.json({
        id
    });
});

app.delete('/usuario', function (req, res) {   // delete cambia el estado de algo para que no este disponible
  res.json('delete Usuario')
});

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto: ', 3000)
});