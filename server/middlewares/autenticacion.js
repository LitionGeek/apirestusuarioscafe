const jwt = require('jsonwebtoken')
// ============================
//  Verificar TOKEN
// ============================
let verificaToken = (req,res,next)=>{
    let token = req.get('token');
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token no valido'
                }
            })
        }
        req.usuario=decoded.usuario;
    })
    next();
};


// ============================
//  Verificar token img
// ============================
let verificaTokenIMG = (req,res,next)=>{
    let token = req.query.token;
    
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token no valido'
                }
            })
        }
        req.usuario=decoded.usuario;
    })
    next();
}

// ============================
//  Verificar admin role
// ============================
let verificaAdminRole = (req,res,next)=>{
    let usuario = req.usuario;
    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        })
    }


}
module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenIMG 
}