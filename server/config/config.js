// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento de Token
// ============================
process.env.CADUCIDAD_TOKEN = '48h';

// ============================
//  SEED de auth
// ============================
process.env.SEED = process.env.SEED || 'seed-desarrollo';
// seed-produccion 

// ============================
//  Base de datos
// ============================

let urlDB;
if(process.env.NODE_ENV ==='dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
    //URI mongodb+srv://litiongeek:mason123@cluster0.da6lp.mongodb.net/cafe
} 

process.env.URLDB = urlDB;         

// ============================
//  Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '233344395838-ch5sns0pgbgst0rse33vj5hpts2c0kuk.apps.googleusercontent.com';