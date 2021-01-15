
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');   // Es un complemento que agrega validación previa al guardado para campos únicos 
                                                                // dentro de un esquema de Mongoose.
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'  // Definimos los roles válidos
};

let Schema = mongoose.Schema;   // Cascaron del esquema

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true,'El nombre es necesario'],
    },
    email:{
        type: String,
        unique: true,                               // Este campo será utilizado por el plugin unique-validator
        required:[true,'El correo es necesario'],
    },
    password:{
        type: String,
        required:[true, 'La constraseña es obligatoria'],
    },
    img:{
        type: String,
        required: false,
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos          // Aplicamos los roles que son válidos
    },
    estado:{
        type: Boolean,
        default: true,
    },
    google:{
        type: Boolean,
        default: false,
    }
});

usuarioSchema.methods.toJSON = function(){      // Del esquema de usuario cogemos el método para imprimir un JSON y le aplicamos una func que lo modificará
    let user = this;                            // y le decimos que a este esquema
    let userObject = user.toObject();           // que haga un clon
    delete userObject.password;                 // y borre en ese clon una de sus propiedades

    return userObject;                          // El rdo final será el esquema imprimiendo todo menos la password
}

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} Debe de ser único'}); // Aplicamos el plugin al campo correo con mensaje si existe error

module.exports = mongoose.model('Usuario', usuarioSchema); // Exportamos el modelo usuario eschema
