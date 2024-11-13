const Components = require('../models/components'); // Importar el modelo
const Prearmado = require ('../models/prearmadoSchema');
// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Components.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Obtener productos en el carrito
const mongoose = require('mongoose');



// Obtener productos en el carrito
const obtenerProductosCarrito = async (req, res) => {
    const { cartItems } = req.body;
    console.log(cartItems);
    try {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: 'cartItems debe ser un array con al menos un elemento' });
        }

        const productosConDetalles = await Promise.all(cartItems.map(async (item) => {
            let producto = null;

            // Intentar encontrar el producto en 'Components' usando ObjectId
            try {
                const componentId = new mongoose.Types.ObjectId(item.componentId);
                producto = await Components.findById(componentId);
            } catch (error) {
                console.log("Error de conversión ObjectId en Components:", error);
            }

            // Si no se encuentra en 'Components', buscar en 'Prearmado' con `id` como string
            if (!producto && Prearmado) {  // Asegura que `Prearmado` esté definido
                producto = await Prearmado.findOne({ id: item.componentId });
            }

            // Mapear los datos de `producto` a la estructura esperada si se encuentra
            return producto ? {
                id: producto._id || producto.id,
                nombre: producto.name || producto.nombre,
                imagen: producto.imagen || 'default-image-url', // asignar imagen si es necesario
                precio: producto.price || producto.precio,
                stock: producto.stock || 'N/A', // valor predeterminado si no hay stock
                categoria: producto.categoria || 'Prearmado'
            } : null;
        }));

        const productosFiltrados = productosConDetalles.filter(Boolean);
        if (productosFiltrados.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos en el carrito' });
        }

        res.json(productosFiltrados);
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        res.status(500).json({ message: 'Error al obtener productos del carrito' });
    }
};



// Crear un nuevo producto
const crearProducto = async (req, res) => {
    const nuevoProducto = new Components(req.body);
    try {
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el producto' });
    }
};

// Actualizar un producto existente
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoActualizado = await Components.findByIdAndUpdate(id, req.body, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const productoEliminado = await Components.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

// Obtener productos por filtros libres
const obtenerProductosPorFiltro = async (req, res) => {
    const { categoria, ...filtros } = req.query;
    try {
        const query = { categoria };

        // Filtrar por otros criterios en 'especificaciones'
        for (const [key, value] of Object.entries(filtros)) {
            if (value) query[`especificaciones.${key}`] = value;
        }

        // Obtener productos que coincidan con los filtros
        const productos = await Components.find(query);

        // Filtrar productos con stock > 0
        const productosDisponibles = productos.filter(producto => producto.stock > 0);

        if (!productosDisponibles.length) {
            return res.status(404).json({ message: 'No se encontraron productos disponibles con esos filtros' });
        }

        // Responder solo con productos que tienen stock disponible
        res.json(productosDisponibles);
    } catch (error) {
        console.error('Error al obtener productos por filtro:', error);
        res.status(500).json({ error: 'Error al obtener productos por filtro' });
    }
};


// Obtener productos por propósito
const obtenerProductosPorProposito = async (req, res) => {
    const { proposito } = req.query;
    try {
        // Buscar productos por el propósito
        const productos = await Components.find({ propositos: proposito });

        // Filtrar productos con stock mayor a 0
        const productosDisponibles = productos.filter(producto => producto.stock > 0);

        if (!productosDisponibles.length) {
            return res.status(404).json({ message: 'No se encontraron productos disponibles para ese propósito' });
        }

        // Responder con los productos disponibles
        res.json(productosDisponibles);
    } catch (error) {
        console.error('Error al obtener productos por propósito:', error);
        res.status(500).json({ error: 'Error al obtener productos por propósito' });
    }
};


// Obtener propósitos por categoría
const getOptionsByPurpose = async (req, res) => {
    const { name } = req.params;
    try {
        const components = await Components.find({ name }, 'propositos');
        if (components.length === 0) {
            return res.status(404).json({ message: 'No se encontraron propósitos para la categoría dada.' });
        }
        const purposes = components.flatMap(component => component.propositos);
        res.status(200).json([...new Set(purposes)]);
    } catch (error) {
        console.error('Error al obtener propósitos por categoría:', error);
        res.status(500).json({ message: 'Error al obtener propósitos por categoría', error: error.message });
    }
};

// Obtener filtros por categoría
const obtenerFiltrosPorCategoria = async (req, res) => {
    const { categoria } = req.query;
    try {
        const filtro = await Components.findOne({ categoria });
        if (!filtro) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        const filtrosObj = Object.fromEntries(filtro.especificaciones);
        res.json(filtrosObj);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener filtros por categoría' });
    }
};

// Buscar componentes según filtros seleccionados
const searchComponents = async (req, res) => {
    const { selectedOptions } = req.body;
    try {
        const filters = {};

        // Aplicar filtros de categoria y propositos si están presentes
        if (selectedOptions?.categoria) filters.categoria = selectedOptions.categoria;
        if (selectedOptions?.propositos?.length) {
            filters.propositos = { $in: selectedOptions.propositos };
        }

        // Buscar componentes con los filtros aplicados
        const components = await Components.find(filters);

        // Filtrar los componentes con stock mayor a 0
        const availableComponents = components.filter(component => component.stock > 0);

        // Responder con los componentes disponibles
        res.status(200).json(availableComponents.length > 0 ? availableComponents : []);
    } catch (error) {
        console.error("Error fetching components:", error);
        res.status(500).json({ message: "Error al cargar los componentes" });
    }
};


// Obtener cantidad de stock disponible de un producto
const obtenerStockProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Components.findById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ stockDisponible: producto.stock });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el stock del producto' });
    }
};

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Components.findById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Reducir el stock de los productos según las cantidades solicitadas
const reducirStock = async (req, res) => {
    const { productos } = req.body; // Recibimos el array de productos con sus cantidades
    try {
        const productosActualizados = await Promise.all(productos.map(async (producto) => {
            const { idProducto, cantidad } = producto;
            const componente = await Components.findById(idProducto);
            if (!componente) {
                throw new Error(`Producto con id ${idProducto} no encontrado`);
            }
            if (componente.stock < cantidad) {
                throw new Error(`No hay suficiente stock para el producto ${componente.nombre}`);
            }
            // Reducir el stock
            componente.stock -= cantidad;
            await componente.save();
            return componente;
        }));

        res.json({ message: "Stock actualizado correctamente", productosActualizados });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};


module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosPorFiltro,
    obtenerProductosPorProposito,
    getOptionsByPurpose,
    obtenerFiltrosPorCategoria,
    searchComponents,
    obtenerStockProducto,
    obtenerProductosCarrito,
    obtenerProductoPorId,
    reducirStock,
};
