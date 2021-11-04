const express = require('express')

const {verificaToken} = require('../middlewares/autenticacion')

let app = express();
let Producto = require('../models/producto');

app.get('/productos',verificaToken,(req,res)=>{
    let desde =  0;
    Producto.find({disponible:true})
    .skip(desde)
    .limit(5)
    .sort('nombre')
    .populate('categoria', 'descripcion')
    .populate('usuario','nombre email')    
    .exec((err,productos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            productos
        })
    })
})

app.get('/productos/:id',(req,res)=>{
    let id = req.params.id;
    Producto.find({_id:id})
    .sort('nombre')
    .populate('usuario','nombre')
    .populate('categoria','descripcion')
    .exec((err,producto)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            producto
        })
    })
})

app.post('/productos',verificaToken,(req,res)=>{
    let body = req.body;
    let producto = new Producto({
        usuario:req.usuario._id,
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria:body.categoria
    });

    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message:'Se produjo un error al llamar a la base de datos'
            })
        } 
        
    
        res.status(201).json({
            ok:true,
            producto:productoDB
        })

    })
})

app.put('/productos/:id',verificaToken,(req,res)=>{
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id,(err,productoDB)=>{
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'El id no existe'
                }
            })
        }
        productoDB.nombre=body.nombre;
        productoDB.precioUni=body.precioUni;
        productoDB.categoria=body.categoria;
        productoDB.disponible=body.disponible;
        productoDB.descripcion=body.descripcion;
       
        productoDB.save((err,productoGuardado)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                producto:productoGuardado
            })
        })

    })
})

app.delete('/productos/:id',verificaToken,(req,res)=>{
    var id = req.params.id;
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err 
            })
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                message:'ID No existe'
            })
        }

        productoDB.disponible = false;
        productoDB.save((err,producoBorrado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err 
                })
            }
            res.json({
                ok:true,
                producto:producoBorrado,
                message:'Producto borrado'
            })
        })
        
    })
})

app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');
    Producto.find({nombre:regex})
    .populate('categoria','nombre')
    .exec((err,productos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            productos
        })
    })
})

module.exports = app;