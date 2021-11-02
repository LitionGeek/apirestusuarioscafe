const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}


let Schema = mongoose.Schema;
let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es requerido']
    },
    email:{
        type:String,
        required:[true,'El email es requerido'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contraseña es requerida']
    },
    img:{
        type:String
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },google:{
        type:Boolean,
        default:false
    },

});

usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObjec = user.toObject();
    delete userObjec.password;
    return userObjec;
}

usuarioSchema.plugin(uniqueValidator),{message:'{PATH} email debe ser unico!'};

module.exports = mongoose.model('Usuario',usuarioSchema)