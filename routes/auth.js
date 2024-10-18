const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
    const router = express.Router();
    const User = sequelize.models.Usuarios; // Asegúrate de que el modelo tenga el nombre correcto

    // Middleware de registro de solicitudes
    router.use((req, res, next) => {
        console.log(`Solicitud entrante: ${req.method} ${req.path}`);
        console.log(`Datos del cuerpo (body): ${JSON.stringify(req.body)}`);
        next();
    });

    // Registrar usuario
    router.post('/register', async (req, res) => {
        const { nombre, apellido, correo_electronico, contrasena, rol } = req.body;

        // Validación de datos
        if (!nombre) {
            return res.status(400).json({ msg: 'El campo "nombre" es obligatorio.' });
        }
        if (!apellido) {
            return res.status(400).json({ msg: 'El campo "apellido" es obligatorio.' });
        }
        if (!correo_electronico) {
            return res.status(400).json({ msg: 'El campo "correo_electronico" es obligatorio.' });
        }
        if (!contrasena) {
            return res.status(400).json({ msg: 'El campo "contrasena" es obligatorio.' });
        }
        if (!rol) {
            return res.status(400).json({ msg: 'El campo "rol" es obligatorio.' });
        }

        try {
            // Verificar si el usuario ya existe
            let user = await User.findOne({ where: { correo_electronico } });
            if (user) {
                console.log(`Error: El usuario con correo ${correo_electronico} ya existe.`);
                return res.status(400).json({ msg: 'El usuario ya existe. Por favor, intente con otro correo.' });
            }

            // Hashear la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasena, salt);

            // Crear nuevo usuario
            user = await User.create({
                nombre,
                apellido,
                correo_electronico,
                contrasena: hashedPassword,
                rol
            });
            console.log(`Usuario creado con éxito con ID: ${user.usuario_id} y correo: ${correo_electronico}`);

            // Crear y devolver token
            const payload = { userId: user.usuario_id };
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
        const { correo_electronico, contrasena } = req.body;

        if (!correo_electronico || !contrasena) {
            return res.status(400).json({ msg: 'Correo y contraseña son obligatorios.' });
        }

        try {
            // Verificar si el usuario existe
            let user = await User.findOne({ where: { correo_electronico } });
            if (!user) {
                console.log(`Error: Usuario no encontrado con el correo: ${correo_electronico}`);
                return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
            }

            // Verificar la contraseña
            const isMatch = await bcrypt.compare(contrasena, user.contrasena);
            if (!isMatch) {
                console.log(`Error: Contraseña incorrecta para el usuario con correo: ${correo_electronico}`);
                return res.status(400).json({ msg: 'Usuario o contraseña incorrectos.' });
            }

            // Crear y devolver token
            const payload = { userId: user.usuario_id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            console.log(`Inicio de sesión exitoso para el usuario con correo: ${correo_electronico}`);
            res.json({ token });
        } catch (err) {
            console.error(`Error al intentar iniciar sesión: ${err.message}`);
            res.status(500).json({ msg: `Error del servidor: ${err.message}` });
        }
    });

    return router;
};
