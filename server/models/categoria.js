const mongoose = require('mongoose')
const Schema = mongoose.Schema;
 
let categoriaSchema = new Schema({

    descripcion: { type: String,
                   unique: true, 
                   required: [true, 'La descripción es obligatoria'] },
                   
    usuario: { type: Schema.Types.ObjectId,     // El usuario será una referencia al esquema usuario según su Id
               ref: 'Usuario' }
});
 
 
module.exports = mongoose.model('Categoria', categoriaSchema);