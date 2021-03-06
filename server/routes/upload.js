const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario')
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path')

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id',(req,res)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message:'No se ha seleccionado ningun archivo'
            }
        })
    }

    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Los tipos permitidos son '+tiposValidos
            /*     ext:extension */
            }
        }) 
    }

    let archivo = req.files.archivo;
    let extensionesValidas = ['png','jpg','jpeg','gif'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length-1];
    let defaultNombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    if(extensionesValidas.indexOf(extension)< 0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Las extensiones permitidas son: '+extensionesValidas.join(', '),
           
            }
        })
    }
    
    archivo.mv(`uploads/${tipo}/${defaultNombreArchivo}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err,
                message:'Error al guardar la imagen'
            })
        }
        if(tipo ==='usuario'){
            imagenUsuario(id, res, defaultNombreArchivo);
        }
        else{
            imagenProducto(id, res, defaultNombreArchivo);
        }
        
    })
})


function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok: false,
                err,
                message:'Error al intentar conectar la DB'
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img,'usuarios')

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                    message:'Error al conectar'
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });
    });
}

function borrarArchivo(nombreImagen,tipo){
    let pathUrl = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`)
    if(fs.existsSync(pathUrl)){
        fs.unlinkSync(pathUrl)
    }
    
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img,'productos')

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                    message:'Error al conectar'
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });

        });
    });
}

module.exports = app;