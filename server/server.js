require('./config/config');
const path = require('path')
const dotenv = require('dotenv').config();
var bodyParser = require('body-parser')    

const express = require('express');
const mongoose = require('mongoose')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())     
app.use(require('./routes/index'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname,'../public')));

mongoose.connect(process.env.URLDB 
    ,(err,res)=>{
    if(err) throw err;
    console.log('Base de datos ONline');
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});