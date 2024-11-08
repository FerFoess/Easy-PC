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
        // Construir el objeto de consulta
        const query = { categoria };

        // Agregar filtros dinámicamente
        for (const [key, value] of Object.entries(filtros)) {
            if (value) { // Asegúrate de que el valor no sea null o undefined
                query[`especificaciones.${key}`] = value;
            }
        }

        // Realizar la búsqueda en la base de datos
        const productos = await Components.find(query);

        // Verificar si se encontraron productos
        if (!productos.length) {
            return res.status(404).json({ message: 'No se encontraron productos con esos filtros' });
        }

        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos por filtro:', error.message);
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

// Obtener propósitos por categoria
const getOptionsByPurpose = async (req, res) => {
    const { name } = req.params; // Obtiene el propósito de los parámetros

    try {
        // Encuentra documentos en `Components` donde `name` coincida y selecciona sólo `propositos`
        const components = await Components.find({ name }, 'propositos'); // Asegúrate de que se use `Components`

        if (components.length === 0) {
            return res.status(404).json({ message: 'No se encontraron propósitos para la categoría dada.' });
        }

        // Combina y elimina duplicados de los propósitos
        const purposes = components.flatMap(component => component.propositos);
        res.status(200).json([...new Set(purposes)]); // Responde con propósitos únicos
    } catch (error) {
        console.error('Error al obtener propósitos por categoría:', error); // Log detallado del error
        res.status(500).json({ message: 'Error al obtener propósitos por categoría', error: error.message });
    }
};

const obtenerFiltrosPorCategoria = async (req, res) => {
    const { categoria } = req.query;

    try {
        // Find the first component with the specified category
        const filtro = await Components.findOne({ categoria });


        if (!filtro) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }

        // Convert the especificaciones Map to a plain object
        const filtrosObj = {};
        filtro.especificaciones.forEach((value, key) => {
            filtrosObj[key] = value;
        });

        res.json(filtrosObj);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener filtros por categoría' });
    }
};

const searchComponents = async (req, res) => {
    const { selectedOptions } = req.body;
    console.log(selectedOptions)
    try {
        const filters = {};

        if (selectedOptions && selectedOptions.categoria) {
            filters.categoria = selectedOptions.categoria;
        }

        if (selectedOptions && selectedOptions.propositos && selectedOptions.propositos.length > 0) {
            filters.propositos = { $in: selectedOptions.propositos }; 
        }

        const components = await Components.find(filters);
        return res.status(200).json(components.length > 0 ? components : []); 
    } catch (error) {
        console.error("Error fetching components:", error);
        return res.status(500).json({ message: "Error al cargar los componentes" });
    }
};

// Obtener cantidad de stock disponible de un producto
const obtenerStockProducto = async (req, res) => {
    const { id } = req.params;  // Obtenemos el id del producto de los parámetros de la URL
    try {
      const producto = await Components.findById(id);  // Buscamos el producto por id
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json({ stockDisponible: producto.stock });  // Devolvemos el stock disponible
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el stock del producto' });
    }
  };
  
  
  

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosPorFiltro,
    obtenerProductosPorProposito,
    getOptionsByPurpose,
    obtenerFiltrosPorCategoria,
    searchComponents,
    obtenerStockProducto,
    
};
