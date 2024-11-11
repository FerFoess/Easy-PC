const Components = require('../models/components'); // Importar el modelo

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
const obtenerProductosCarrito = async (req, res) => {
    const { cartItems } = req.body;
    console.log("entro")
    console.log(cartItems)
    try {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            
            return res.status(400).json({ message: 'cartItems debe ser un array con al menos un elemento' });
        }

        const productosConDetalles = await Promise.all(cartItems.map(async (item) => {

    console.log(item.componentId)
            const producto = await Components.findById(item.componentId);
            return producto ? {
                id: producto._id,
                nombre: producto.nombre,
                imagen: producto.imagen,
                precio: producto.precio,
                stock: producto.stock
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
        for (const [key, value] of Object.entries(filtros)) {
            if (value) query[`especificaciones.${key}`] = value;
        }
        const productos = await Components.find(query);
        if (!productos.length) {
            return res.status(404).json({ message: 'No se encontraron productos con esos filtros' });
        }
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos por filtro:', error);
        res.status(500).json({ error: 'Error al obtener productos por filtro' });
    }
};

// Obtener productos por propósito
const obtenerProductosPorProposito = async (req, res) => {
    const { proposito } = req.query;
    try {
        const productos = await Components.find({ propositos: proposito });
        res.json(productos);
    } catch (error) {
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
        if (selectedOptions?.categoria) filters.categoria = selectedOptions.categoria;
        if (selectedOptions?.propositos?.length) {
            filters.propositos = { $in: selectedOptions.propositos };
        }
        const components = await Components.find(filters);
        res.status(200).json(components.length > 0 ? components : []);
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
    obtenerProductoPorId
};
