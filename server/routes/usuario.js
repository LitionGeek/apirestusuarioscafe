const express = require('express');
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const app = express();

const { verificaToken,verificaAdminRole } = require('../middlewares/autenticacion')

app.get('/usuario', verificaToken, function(req, res) {
    
    let desde = Number(req.query.desde) || 0;
    
    let limite = Number(req.query.limit) || 5;
    let paramEstado = {
        estado:true
    }
    
    Usuario.find({paramEstado}, 'nombre email')
    .skip(desde)
    .limit(limite)
    .exec((err,usuarios)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        console.log('Usuario: ',usuarios)
        Usuario.count({estado:true},(err,conteo)=>{
            res.json({
            ok:true,
            usuarios/* ,
            //total:conteo */
            })
        });  
    })
});

app.post('/usuario',verificaToken, function(req, res) {

    let body = req.body.persona;
    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password ,12),
        role:body.role,
        img: body.img || null
    });

    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            usuario:usuarioDB
        })
    });
});

app.put('/usuario/:id', [verificaToken,verificaAdminRole],function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','password','role','estado','google',]);
    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            usuario:usuarioDB
        });
    })


});

app.delete('/usuario/:id', [verificaToken,verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let cambiaEstado ={
        estado:false
    }
    Usuario.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                error:err
            })
        }
        if(usuarioBorrado === null){
            return res.status(400).json({
                ok:false,
                error:{
                    message:'Usuario no encontrado'
                }
            })
        }
        
        res.json({
            ok:true,
            usuario:usuarioBorrado
        })
    });
});


module.exports = app;