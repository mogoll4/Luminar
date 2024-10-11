const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize) => {
    const router = express.Router();
    const User = sequelize.models.Usuarios;
    const Role = sequelize.models.Roles;

    // Registrar usuario
    router.post('/register', async (req, res) => {
        const { nombre, apellido, correo_electronico, contrasena, rol_id } = req.body;

        try {
            // Verificar si el usuario ya existe
            let user = await User.findOne({ where: { correo_electronico } });
            if (user) {
                return res.status(400).json({ msg: 'El usuario ya existe' });
            }

            // Verificar si el rol es válido
            let role = await Role.findOne({ where: { rol_id } });
            if (!role) {
                return res.status(400).json({ msg: 'El rol especificado no es válido' });
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
                rol_id
            });

            // Crear y devolver token
            const payload = { userId: user.usuario_id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({ token });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error del servidor');
        }
    });

    // Login de usuario
    router.post('/login', async (req, res) => {
        const { correo_electronico, contrasena } = req.body;

        try {
            // Verificar si el usuario existe
            let user = await User.findOne({ where: { correo_electronico } });
            if (!user) {
                console.log('Usuario no encontrado con el correo:', correo_electronico);
                return res.status(400).json({ msg: 'Credenciales inválidas' });
            }

            // Verificar la contraseña
            const isMatch = await bcrypt.compare(contrasena, user.contrasena);
            if (!isMatch) {
                console.log('Contraseña no coincide para el usuario:', correo_electronico);
                return res.status(400).json({ msg: 'Credenciales inválidas' });
            }

            // Crear y devolver token
            const payload = { userId: user.usuario_id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({ token });
        } catch (err) {
            console.error('Error al intentar iniciar sesión:', err.message);
            res.status(500).send('Error del servidor');
        }
    });

    return router;
};
