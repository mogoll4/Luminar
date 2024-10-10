require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const { Sequelize } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configurar carpeta de archivos estáticos (public)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MySQL usando Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// Verificar la conexión a la base de datos
sequelize.authenticate()
    .then(() => console.log('Conectado a MySQL'))
    .catch(err => console.error('Error de conexión a MySQL:', err));

// Definir el modelo de Usuario
const User = require('./models/User')(sequelize);

// Sincronizar el modelo con la base de datos
sequelize.sync()
    .then(() => console.log('Modelos sincronizados'))
    .catch(err => console.error('Error sincronizando modelos:', err));

// Rutas para vistas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Registro de usuarios
app.post('/register', async (req, res) => {
    const { nombre, apellido, correo_electronico, contrasena } = req.body;

    try {
        let user = await User.findOne({ where: { correo_electronico } });
        if (user) {
            return res.send('El usuario ya existe. <a href="/register">Volver a registrar</a>');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        user = await User.create({
            nombre,
            apellido,
            correo_electronico,
            contrasena: hashedPassword
        });

        res.send('Usuario registrado con éxito. <a href="/">Iniciar sesión</a>');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Inicio de sesión de usuarios
app.post('/login', async (req, res) => {
    const { correo_electronico, contrasena 
