require('dotenv').config();
const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

const app = express();

// Middlewares para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configurar carpeta de archivos estáticos (public)
app.use(express.static(path.join(__dirname, 'public')));

// Conectar a MySQL usando Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false // Desactivar logging SQL para menos ruido en la consola
});

// Verificar la conexión a la base de datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a MySQL');
    } catch (err) {
        console.error('Error de conexión a MySQL:', err.message);
        process.exit(1); // Salir si la conexión falla
    }
})();

// Definir el modelo de Usuario
const User = sequelize.define('Usuario', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo_electronico: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    contrasena: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Usuarios',
    timestamps: false,
});

// Definir el modelo de Rol
const Role = sequelize.define('Rol', {
    rol_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Roles',
    timestamps: false,
});

// Relación entre Usuarios y Roles
User.belongsTo(Role, { foreignKey: 'rol_id', as: 'rol' });

// Sincronizar los modelos con la base de datos
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados');
    } catch (err) {
        console.error('Error sincronizando modelos:', err.message);
        process.exit(1); // Salir si la sincronización falla
    }
})();

// Importar y usar el módulo de autenticación
try {
    const authRoutes = require('./controllers/auth')(sequelize);
    app.use('/', authRoutes);
    console.log('Rutas de autenticación cargadas correctamente.');
} catch (err) {
    console.error('Error al cargar las rutas de autenticación:', err.message);
}

// Rutas para vistas HTML
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'views', 'login-register.html'));
    } catch (err) {
        console.error('Error al cargar la página de login/register:', err.message);
        res.status(500).json({ msg: `Error del servidor: Error al cargar la página de login/register.` });
    }
});

app.get('/accounts', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'accounts.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'checkout.html'));
});

app.get('/dashboard-admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-admin.html'));
});

app.get('/dashboard-cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-cliente.html'));
});

app.get('/dashboard-vendedor', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard-vendedor.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'productos.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'shop.html'));
});

app.get('/whishlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'whishlist.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
