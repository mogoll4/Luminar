require('dotenv').config();
const express = require('express');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
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

// Definir el modelo de Producto
const Product = sequelize.define('Producto', {
    producto_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_producto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    talla: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    cantidad_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'Productos',
    timestamps: false,
});

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

app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'productos.html'));
});

// CRUD Productos

// Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
    const { nombre_producto, descripcion, talla, color, precio, cantidad_stock, categoria_id } = req.body;
    try {
        const newProduct = await Product.create({
            nombre_producto,
            descripcion,
            talla,
            color,
            precio,
            cantidad_stock,
            categoria_id
        });
        console.log("Producto creado:", newProduct);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error al crear producto:', err.message);
        res.status(500).send('Error del servidor');
    }
});

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Product.findAll();
        if (productos.length === 0) {
            console.log("No se encontraron productos en la base de datos.");
        } else {
            console.log("Productos obtenidos:", productos);
        }
        res.json(productos);
    } catch (err) {
        console.error('Error al obtener productos:', err.message);
        res.status(500).send('Error del servidor');
    }
});

// Obtener un producto específico
app.get('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            console.log('Producto no encontrado con ID:', id);
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (err) {
        console.error('Error al obtener el producto:', err.message);
        res.status(500).send('Error del servidor');
    }
});

// Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_producto, descripcion, talla, color, precio, cantidad_stock, categoria_id } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            console.log('Producto no encontrado con ID:', id);
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        await product.update({
            nombre_producto,
            descripcion,
            talla,
            color,
            precio,
            cantidad_stock,
            categoria_id
        });
        console.log("Producto actualizado:", product);
        res.json(product);
    } catch (err) {
        console.error('Error al actualizar producto:', err.message);
        res.status(500).send('Error del servidor');
    }
});

// Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            console.log('Producto no encontrado con ID:', id);
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        await product.destroy();
        console.log("Producto eliminado con ID:", id);
        res.json({ msg: 'Producto eliminado con éxito' });
    } catch (err) {
        console.error('Error al eliminar producto:', err.message);
        res.status(500).send('Error del servidor');
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
