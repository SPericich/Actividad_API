import { createRequire } from "node:module"
import express from "express"

const require = createRequire(import.meta.url)
const datos = require("./datos.json")

const html =
	"<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/estadistica</li><li>GET: /productos/nombre/id</li><li>GET: /productos/precio/id</li><li>GET: /productos/id</li><li>POST: /productos/</li><li>DELETE: /productos/id</li><li>PUT: /productos/id</li><li>PATCH: /productos/id</li><li>GET: /usuarios/</li><li>GET: /usuarios/nombre/id</li><li>GET: /usuarios/telefono/id</li><li>GET: /usuarios/id</li><li>POST: /usuarios/</li><li>DELETE: /usuarios/id</li><li>PUT: /usuarios/id</li><li>PATCH: /usuarios/id</li></ul>"

const app = express()

const exposedPort = 1234

app.get("/", (req, res) => {
	res.status(200).send(html)
})

app.get("/productos", (req, res) => {
	try {
		let allProducts = datos.productos
		res.status(200).json(allProducts)
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

//10. Conocer la cantidad de productos y la sumatoria de sus precios
app.get("/productos/estadistica", (req, res) => {
	try {
		let productos = datos.productos
		let cantidadProductos = productos.length
		let sumatoriaPrecios = productos.reduce((total, producto) => {
			return total + producto.precio
		}, 0)
		res.status(200).json({
			cantidadProductos,
			sumatoriaPrecios,
		})
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

//6. endpoint que devuelve el precio de un producto
app.get("/productos/precio/:id", (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = datos.productos.find(
			(producto) => producto.id === productoId
		)
		if (productoEncontrado) {
			res.status(200).json({ precio: productoEncontrado.precio })
		} else {
			res.status(400).json({ error: "Producto no enocntrado" })
		}
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

//7. endpoint para obtener el nombre de un producto
app.get("/productos/nombre/:id", (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = datos.productos.find(
			(producto) => producto.id === productoId
		)
		if (productoEncontrado) {
			res.status(200).json({ nombre: productoEncontrado.nombre })
		} else {
			res.status(400).json({ error: "Producto no encontrado" })
		}
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

app.get("/productos/:id", (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = datos.productos.find(
			(producto) => producto.id === productoId
		)
		if (!productoEncontrado) {
			res.status(204).json({ message: "Producto no encontrado" })
		}
		res.status(200).json(productoEncontrado)
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

app.post("/productos", (req, res) => {
	 try {
		let bodyTemp = ""

		req.on("data", (chunk) => {
			bodyTemp += chunk.toString()
		})
		req.on("end", () => {
			const data = JSON.parse(bodyTemp)
			req.body = data
			datos.productos.push(req.body)
		})
		res.status(201).json({ message: "success" })
	} catch (error) {
		res.status(204).json({ message: "error" })
	}
})

app.patch("/productos/:id", (req, res) => {
	let idProductoAEditar = parseInt(req.params.id)
	let productoAActualizar = datos.productos.find(
		(producto) => producto.id === idProductoAEditar
	)
	if (!productoAActualizar) {
		res.status(204).json({ message: "Producto no encontrado" })
	}

	let bodyTemp = ""

	req.on("data", (chunk) => {
		bodyTemp += chunk.toString()
	})

	req.on("end", () => {
		const data = JSON.parse(bodyTemp)
		req.body = data

		if (data.nombre) {
			productoAActualizar.nombre = data.nombre
		}

		if (data.tipo) {
			productoAActualizar.tipo = data.tipo
		}

		if (data.precio) {
			productoAActualizar.precio = data.precio
		}

		res.status(200).send("Producto actualizado")
	})
})

app.delete("/productos/:id", (req, res) => {
	let idProductoABorrar = parseInt(req.params.id)
	let productoABorrar = datos.productos.find(
		(producto) => producto.id === idProductoABorrar
	)

	if (!productoABorrar) {
		res.status(204).json({ message: "Producto no encontrado" })
	}

	let indiceProductoABorrar = datos.productos.indexOf(productoABorrar)
	try {
		datos.productos.splice(indiceProductoABorrar, 1)
		res.status(200).json({ message: "success" })
	} catch (error) {
		res.status(204).json({ message: "error" })
	}
})

//1. endpoint para el listado completo de usuarios
app.get("/usuarios/", (req, res) => {
	try {
		let allUsers = datos.usuarios

		res.status(200).json(allUsers)
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

//8. endpoint para obtener el teléfono de un usuario
app.get("/usuarios/telefono/:id", (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = datos.usuarios.find(
			(usuario) => usuario.id === usuarioId
		)
		if (usuarioEncontrado) {
			res.status(200).json({ telefono: usuarioEncontrado.telefono })
		} else {
			res.status(404).json({ error: "Usuario no encontrado" })
		}
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

//9. endpoint para obtener el nombre de un usuario
app.get("/usuarios/nombre/:id", (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = datos.usuarios.find(
			(usuario) => usuario.id === usuarioId
		)

		if (usuarioEncontrado) {
			res.status(200).json({ nombre: usuarioEncontrado.nombre })
		} else {
			res.status(404).json({ error: "Usuario no encontrado" })
		}
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

//2. endpoint para obtener los datos de un usuario por Id
app.get("/usuarios/:id", (req, res) => {
	try {
		let usuarioId = parseInt(req.params.id)
		let usuarioEncontrado = datos.usuarios.find(
			(usuario) => usuario.id === usuarioId
		)

		if (!usuarioEncontrado) {
			res.status(204).json({ message: "Usuario no encontrado" })
		}
		res.status(200).json(usuarioEncontrado)
	} catch (error) {
		res.status(204).json({ message: error })
	}
})

//3. endpoint para guardar un nuevo usuario
app.post("/usuarios", (req, res) => {
	try {
		let bodyTemp = ""

		req.on("data", (chunk) => {
			bodyTemp += chunk.toString()
		})

		req.on("end", () => {
			const data = JSON.parse(bodyTemp)
			req.body = data
			datos.usuarios.push(req.body)
		})

		res.status(201).json({ message: "success" })
	} catch (error) {
		res.status(204).json({ message: "error" })
	}
})

//4. endpoint para modificar algún dato de un usuario en particular
app.patch("/usuarios/:id", (req, res) => {
	let idUsuarioAEditar = parseInt(req.params.id)
	let usuarioAActualizar = datos.usuarios.find(
		(usuario) => usuario.id === idUsuarioAEditar
	)

	if (!usuarioAActualizar) {
		res.status(204).json({ message: "Usuario no encontrado" })
	}

	let bodyTemp = ""

	req.on("data", (chunk) => {
		bodyTemp += chunk.toString()
	})

	req.on("end", () => {
		const data = JSON.parse(bodyTemp)
		req.body = data

		if (data.nombre) {
			usuarioAActualizar.nombre = data.nombre
		}

		if (data.edad) {
			usuarioAActualizar.edad = data.edad
		}

		if (data.email) {
			usuarioAActualizar.email = data.email
		}

		if (data.telefono) {
			usuarioAActualizar.telefono = data.telefono
		}

		res.status(200).send("Usuario actualizado")
	})
})

//5. endpoint para borrar un usuario determinado
app.delete("/usuarios/:id", (req, res) => {
	let idUsuarioABorrar = parseInt(req.params.id)
	let usuarioABorrar = datos.usuarios.find(
		(usuario) => usuario.id === idUsuarioABorrar
	)

	if (!usuarioABorrar) {
		res.status(204).json({ message: "Usuario no encontrado" })
	}

	let indiceUsuarioABorrar = datos.usuarios.indexOf(usuarioABorrar)
	try {
		datos.usuarios.splice(indiceUsuarioABorrar, 1)
		res.status(200).json({ message: "success" })
	} catch (error) {
		res.status(204).json({ message: "error" })
	}
})

app.use((req, res) => {
	res.status(404).send("<h1>404</h1>")
})

app.listen(exposedPort, () => {
	console.log("Servidor escuchando en http://localhost:" + exposedPort)
})
