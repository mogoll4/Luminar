const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
    const router = express.Router();
    const User = sequelize.models.Usuario;

    // Middleware de registro de solicitudes
    router.use((req, res, next) => {
        console.log(`Solicitud entrante: ${req.method} ${req.path}`);
        console.log(`Datos del cuerpo (body): ${JSON.stringify(req.body)}`);
        next();
    });

    // Registrar usuario
    router.post('/register', async (req, res) => {
        const { nombre, apellido, correo, contrasena, rol } = req.body;

        if (!nombre || !apellido || !correo || !contrasena || !rol) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
        }

        try {
            // Verificar si el usuario ya existe
            let user = await User.findOne({ where: { correo } });
            if (user) {
                console.log(`Error: El usuario con correo ${correo} ya existe.`);
                return res.status(400).json({ msg: 'El usuario ya existe. Por favor, intente con otro correo.' });
            }

            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            // Crear nuevo usuario
            user = await User.create({
                nombre,
                apellido,
                correo,
                contrasena: hashedPassword,
                rol
            });
            console.log(`Usuario creado con éxito con ID: ${user.id} y correo: ${correo}`);

            // Crear y devolver token
            const payload = { userId: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.status(201).json({ token });
        } catch (err) {
            console.error(`Error al registrar el usuario: ${err.message}`);
            res.status(500).json({ msg: `Error del servidor: ${err.message}` });
        }
    });

    // Login de usuario
    router.post('/login', async (req, res) => {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ msg: 'Correo y contraseña son obligatorios.' });
        }

        try {
            // Verificar si el usuario existe
            let user = await User.findOne({ where: { correo } });
            if (!user) {
                console.log(`Error: Usuario no encontrado con el correo: ${correo}`);
                return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
            }

            // Verificar la contraseña
            const isMatch = await bcrypt.compare(contrasena, user.contrasena);
            if (!isMatch) {
                console.log(`Error: Contraseña incorrecta para el usuario con correo: ${correo}`);
                return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
            }

            // Crear y devolver token
            const payload = { userId: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            console.log(`Inicio de sesión exitoso para el usuario con correo: ${correo}`);
            res.json({ token });
        } catch (err) {
            console.error(`Error al intentar iniciar sesión: ${err.message}`);
            res.status(500).json({ msg: `Error del servidor: ${err.message}` });
        }
    });

    return router;
};
