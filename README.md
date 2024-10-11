# Sistema de Información para la Gestión de Ventas e Inventarios en Luminar - Local de Ropa Femenina

**Elaborado Por:**
- Eric Sebastián Gonzales
- Paula Andrea Ortiz
- Andres Mora
- Javier Andrés Abril

**Información General:**
- 2902093
- Centro de Gestión de Mercados, Logística y Tecnologías de la Información
- 30 de Septiembre, 2024
- Bogotá D.C.

## Nombre del Proyecto: Sistema de Información para la Gestión de Ventas e Inventarios en Luminar - Local de Ropa Femenina

### Descripción General
El proyecto tiene como objetivo la implementación de un sistema de gestión integral que permita a Luminar, un reconocido local de ropa femenina, optimizar sus procesos de inventario y ventas. Luminar se destaca por ofrecer prendas de alta calidad y estilo único, pero para mantener su competitividad y satisfacer las crecientes expectativas de sus clientes, es fundamental integrar un sistema digitalizado que mejore la eficiencia operativa. La solución propuesta incluirá herramientas avanzadas para el control de inventario en tiempo real, gestión de pedidos, y la creación de un sistema de ventas en línea. Esto no solo aumentará la eficiencia interna, sino que también permitirá a Luminar diversificar sus canales de venta, ampliando así su alcance en el mercado y mejorando su posición frente a la competencia.

## Características del Proyecto
- **Gestión de Inventario**: Registro de productos, control de existencias, actualización en tiempo real y notificación sobre bajas en inventario.
- **Gestión de Ventas**: Registro de ventas con validación de productos, gestión de pagos y reportes de ventas.
- **Canal de Ventas en Línea**: Plataforma eCommerce para que los clientes puedan realizar compras en línea de manera conveniente.
- **Registro y Login de Usuarios**: Registro de clientes y empleados con validación y hasheo seguro de contraseñas utilizando **bcryptjs**.
- **Análisis de Datos**: Herramientas para la recopilación y análisis de datos de ventas que faciliten la toma de decisiones.

## Tecnologías Utilizadas
- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor.
- **Express**: Framework web para Node.js.
- **MySQL**: Base de datos relacional para almacenar información de los productos, ventas y usuarios.
- **Sequelize**: ORM para facilitar las operaciones en la base de datos.
- **bcryptjs**: Librería para hashear contraseñas y asegurar la seguridad de la información de los usuarios.
- **dotenv**: Para la gestión de variables de entorno.
- **HTML, CSS, JavaScript**: Tecnologías para el diseño del front-end y la interfaz del sistema.

## Instalación
Sigue los pasos a continuación para configurar el proyecto localmente:

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd luminar-gestion-ventas-inventarios
Instalar dependencias:

bash
Copiar código
npm install express sequelize mysql2 bcryptjs dotenv body-parser
Si quieres usar nodemon para facilitar el desarrollo, instala también:

bash
Copiar código
npm install --save-dev nodemon
Configurar las variables de entorno: Crea un archivo .env en la raíz del proyecto y agrega la configuración de tu base de datos:

makefile
Copiar código
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=luminar
JWT_SECRET=supersecretkey
PORT=5000
Ejecutar el servidor:

Para iniciar el servidor en modo normal:
bash
Copiar código
npm start
Para iniciar el servidor en modo desarrollo (si has instalado nodemon):
bash
Copiar código
npm run dev
Abrir la aplicación: Abre tu navegador y ve a http://localhost:5000 para ver la página de inicio de sesión.

Estructura del Proyecto
graphql
Copiar código
luminar-gestion-ventas-inventarios/
|
├── .env                     # Variables de entorno
├── server.js                # Archivo principal del servidor
├── models/
│   ├── User.js              # Definición del modelo de Usuario
│   ├── Product.js           # Definición del modelo de Producto
│   └── Sale.js              # Definición del modelo de Venta
├── views/
│   ├── login.html           # Vista HTML para inicio de sesión
│   └── register.html        # Vista HTML para registro
└── public/
    ├── css/
    │   ├── util.css         # Estilos adicionales
    │   └── main.css         # Estilos principales
    ├── js/
    │   └── main.js          # Funciones JavaScript
    └── images/
        └── bg-01.jpg        # Imagen de fondo
Dependencias Utilizadas
express: Framework web para construir el servidor.
sequelize: ORM para la conexión y gestión de la base de datos.
mysql2: Driver de MySQL para conectar Sequelize.
bcryptjs: Para el hasheo de contraseñas y aumentar la seguridad.
dotenv: Manejo de variables de entorno.
body-parser: Middleware para analizar los cuerpos de las solicitudes.
Dependencia Opcional
nodemon: Para reiniciar automáticamente el servidor durante el desarrollo.
Comandos de Uso
Instalar Dependencias: npm install
Iniciar el servidor: npm start
Iniciar en modo desarrollo (si instalaste nodemon): npm run dev
Flujo del Usuario
Registro de Usuarios: Los empleados y clientes pueden registrarse proporcionando su nombre, apellido, correo electrónico, y contraseña. La contraseña se hashea antes de guardarse en la base de datos.
Login: Los usuarios pueden iniciar sesión con su correo electrónico y contraseña. Si las credenciales son correctas, se muestra un mensaje de bienvenida.
Gestión de Inventario: Los empleados pueden agregar y actualizar productos, monitorear niveles de stock y recibir alertas cuando ciertos artículos estén por agotarse.
Gestión de Ventas: Los empleados pueden registrar ventas y generar recibos, mientras que los administradores pueden acceder a reportes detallados de ventas.
Plataforma de eCommerce: Los clientes pueden explorar el catálogo de productos y realizar compras en línea de manera fácil y segura.
Justificación del Proyecto
La implementación de un sistema digitalizado para el control del inventario y la gestión de ventas es crucial para la sostenibilidad y el crecimiento de Luminar. La integración de un canal de ventas en línea permitirá a Luminar alcanzar un público más amplio y aumentar sus ingresos, brindando a los clientes la comodidad de comprar desde cualquier lugar. Mejorar la satisfacción del cliente mediante una atención más rápida y eficiente es fundamental para construir lealtad hacia la marca.

Productos o Resultados del Sistema
Sistema de Gestión de Inventario: Permite un control en tiempo real de los productos disponibles, asegurando que Luminar pueda satisfacer la demanda del cliente sin interrupciones.
Sistema de Gestión de Ventas: Facilita el seguimiento de las transacciones, permitiendo evaluar el rendimiento y ajustar las estrategias de venta según sea necesario.
Plataforma de eCommerce: Un sitio web optimizado para que los clientes puedan explorar y comprar productos de forma sencilla y eficiente.
Reportes de Análisis de Ventas: Informes detallados sobre el rendimiento de productos, ayudando a Luminar a tomar decisiones informadas sobre inventario y marketing.
