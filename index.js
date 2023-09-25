import { createRequire } from "node:module";
import express from "express";

const require = createRequire(import.meta.url);
const datos = require("./datos.json");

const html =
	"<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/estadistica</li><li>GET: /productos/nombre/id</li><li>GET: /productos/precio/id</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/nombre/id</li><li>GET: /usuarios/telefono/id</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li></ul>";

const app = express();

const exposedPort = 1234;

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).send(html);
});

//Listado completo de productos
app.get("/productos", (req, res) => {
	try {
		let allProducts = datos.productos;
		res.status(200).json(allProducts);
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//10. CONOCER LA CANTIDAD DE PRODUCTOS
//Y LA SUMATORIA DE SUS PRECIOS
app.get("/productos/estadistica", (req, res) => {
	try {
		let productos = datos.productos;
		let cantidadProductos = productos.length;
		let sumatoriaPrecios = productos.reduce((total, producto) => {
			return total + producto.precio;
		}, 0);
		res.status(200).json({
			cantidadProductos,
			sumatoriaPrecios,
		});
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//6. OBTENER EL PRECIO DE UN PRODUCTO
app.get("/productos/precio/:id", (req, res) => {
	try {
		let productoId = parseInt(req.params.id);
		let productoEncontrado = datos.productos.find(
			(producto) => producto.id === productoId
		);
		if (productoEncontrado) {
			res.status(200).json({ precio: productoEncontrado.precio });
		} else {
			res.status(400).json({ error: "Producto no enocntrado" });
		}
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//7. OBTENER EL NOMBRE DE UN PRODUCTO
app.get("/productos/nombre/:id", (req, res) => {
	try {
		let productoId = parseInt(req.params.id);
		let productoEncontrado = datos.productos.find(
			(producto) => producto.id === productoId
		);
		if (productoEncontrado) {
			res.status(200).json({ nombre: productoEncontrado.nombre });
		} else {
			res.status(400).json({ error: "Producto no encontrado" });
		}
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//Devuelve los datos de un producto en particular
app.get("/productos/:id", (req, res) => {
	try {
		let productoId = parseInt(req.params.id);
		let productoEncontrado = datos.productos.find(
			(producto) => producto.id === productoId
		);
		if (!productoEncontrado) {
			res.status(204).json({ message: "Producto no encontrado" });
		}
		res.status(200).json(productoEncontrado);
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//Agregar un producto
app.post('/productos', (req, res) => {
    const { nombre, tipo, precio } = req.body;
    const nuevoProducto = {
      id: datos.productos.length + 1,
      nombre,
      tipo,
      precio,
    };
    datos.productos.push(nuevoProducto);
    res.status(201).json({ mensaje: 'Producto creado con éxito', producto: nuevoProducto });
  });

//Modificar un producto
app.patch('/productos/:id', (req, res) => {
    const productoId = parseInt(req.params.id);
    const { nombre, tipo, precio } = req.body;
  
    const producto = datos.productos.find((producto) => producto.id === productoId);
  
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  
    if (nombre) producto.nombre = nombre;
    if (tipo) producto.tipo = tipo;
    if (precio) producto.precio = precio;
  
    res.json({ mensaje: 'Producto actualizado con éxito', producto });
  });

//Remplazar un producto
app.put("/productos/:id", (req, res) => {
	let productoACambiarId = parseInt(req.params.id);
	let { nombre, tipo, precio } = req.body;

	let producto = datos.productos.find(
		(producto) => producto.id === productoACambiarId
	);

	if (!producto) {
		return res.status(404).json({ mensaje: "Producto no encontrado" });
	}

	producto.nombre = nombre;
	producto.tipo = tipo;
	producto.precio = precio;

	return res.json({ mensaje: "Producto actualizado con éxito", producto });
});

//Eliminar un producto
app.delete("/productos/:id", (req, res) => {
	let idProductoABorrar = parseInt(req.params.id);
	let productoABorrar = datos.productos.find(
		(producto) => producto.id === idProductoABorrar
	);

	if (!productoABorrar) {
		res.status(204).json({ message: "Producto no encontrado" });
	}

	let indiceProductoABorrar = datos.productos.indexOf(productoABorrar);
	try {
		datos.productos.splice(indiceProductoABorrar, 1);
		res.status(200).json({ message: "success" });
	} catch (error) {
		res.status(204).json({ message: "error" });
	}
});

//1. OBTENER EL LISTADO COMPLETO DE USUARIOS
app.get("/usuarios/", (req, res) => {
	try {
		let allUsers = datos.usuarios;

		res.status(200).json(allUsers);
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//8. OBTENER LE TELÉFONO DE UN USUARIO
app.get("/usuarios/telefono/:id", (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id);
		let usuarioEncontrado = datos.usuarios.find(
			(usuario) => usuario.id === usuarioId
		);
		if (usuarioEncontrado) {
			res.status(200).json({ telefono: usuarioEncontrado.telefono });
		} else {
			res.status(404).json({ error: "Usuario no encontrado" });
		}
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//9. OBTENER EL NOMBRE DE UN USUARIO
app.get("/usuarios/nombre/:id", (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id);
		let usuarioEncontrado = datos.usuarios.find(
			(usuario) => usuario.id === usuarioId
		);

		if (usuarioEncontrado) {
			res.status(200).json({ nombre: usuarioEncontrado.nombre });
		} else {
			res.status(404).json({ error: "Usuario no encontrado" });
		}
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//2. OBTENER LOS DATOS DE UN USUARIO
app.get("/usuarios/:id", (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id);
		let usuarioEncontrado = datos.usuarios.find(
			(usuario) => usuario.id === usuarioId
		);

		if (!usuarioEncontrado) {
			res.status(204).json({ message: "Usuario no encontrado" });
		}
		res.status(200).json(usuarioEncontrado);
	} catch (error) {
		res.status(204).json({ message: error });
	}
});

//3. CREAR UN NUEVO USUARIO
app.post('/usuarios', (req, res) => {
    const { nombre, edad, email, telefono } = req.body;
    const nuevoUsuario = {
      id: datos.usuarios.length + 1,
      nombre,
      edad,
      email,
      telefono,
    };
    datos.usuarios.push(nuevoUsuario);
    res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario });
  });

//4. MODIFICAR DATOS DE UN USUARIO
app.patch('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const { nombre, edad, email, telefono } = req.body;
  
    const usuario = datos.usuarios.find((usuario) => usuario.id === usuarioId);
  
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  
    if (nombre) usuario.nombre = nombre;
    if (edad) usuario.edad = edad;
    if (email) usuario.email = email;
    if (telefono) usuario.telefono = telefono;
  
    res.json({ mensaje: 'Usuario actualizado con éxito', usuario });
  });

//Reemplazar un usuario
app.put("/usuarios/:id", (req, res) => {
	let usuarioAReemplazarId = parseInt(req.params.id);
	let { nombre, edad, email, telefono } = req.body;

	let usuario = datos.usuarios.find(
		(usuario) => usuario.id === usuarioAReemplazarId
	);

	if (!usuario) {
		return res.status(404).json({ mensaje: "Usuario no encontrado" });
	}

	usuario.nombre = nombre;
	usuario.edad = edad;
	usuario.email = email;
	usuario.telefono = telefono;

	return res.json({ mensaje: "Usuario actualizado con éxito", usuario });
});

//5. ELIMINAR UN USUARIO
app.delete("/usuarios/:id", (req, res) => {
	let idUsuarioABorrar = parseInt(req.params.id);
	let usuarioABorrar = datos.usuarios.find(
		(usuario) => usuario.id === idUsuarioABorrar
	);

	if (!usuarioABorrar) {
		res.status(204).json({ message: "Usuario no encontrado" });
	}

	let indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar);
	try {
		datos.usuarios.splice(indiceUsuarioABorrar, 1);
		res.status(200).json({ message: "success" });
	} catch (error) {
		res.status(204).json({ message: "error" });
	}
});

app.use((req, res) => {
	res.status(404).send("<h1>404</h1>");
});

app.listen(exposedPort, () => {
	console.log("Servidor escuchando en http://localhost:" + exposedPort);
});
