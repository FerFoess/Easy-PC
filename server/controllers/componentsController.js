const Components = require('../models/components'); // Importar el modelo de componentes
const Prearmado = require('../models/prearmadoSchema'); // Importar el modelo de prearmado
const Categoria = require('../models/categoriasSchema'); // Importar el modelo de categorías
const mongoose = require('mongoose');

// Controlador para obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Components.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const obtenerProductosCarrito = async (req, res) => {
  const { cartItems } = req.body;
  console.log('Cart Items:', cartItems);

  try {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'cartItems debe ser un array con al menos un elemento' });
    }

    const productosConDetalles = await Promise.all(cartItems.map(async (item) => {
      try {
        console.log('Buscando producto con componentId:', item.componentId);

        // Convertir el ID si es necesario
        const componentId = new mongoose.Types.ObjectId(item.componentId);

        // Realizar la búsqueda en ambas colecciones
        const productoComponent = await Components.findById(componentId);
        const productoPrearmado = await Prearmado.findById(componentId);

        console.log('Resultado en Components:', productoComponent);
        console.log('Resultado en Prearmado:', productoPrearmado);

        const producto = productoComponent || productoPrearmado;

        return producto ? {
          id: producto._id,
          nombre: producto.nombre,
          imagen: producto.imagen || 'default-image-url',
          precio: producto.price || producto.precio,
          stock: producto.stock || 'N/A',
          categoria: producto.categoria || 'Prearmado'
        } : null;

      } catch (error) {
        console.log("Error en la búsqueda de productos:", error);
        return null;
      }
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
    const productosDisponibles = productos.filter(producto => producto.stock > 0);

    if (!productosDisponibles.length) {
      return res.status(404).json({ message: 'No se encontraron productos disponibles con esos filtros' });
    }

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
    const productos = await Components.find({ propositos: proposito });
    const productosDisponibles = productos.filter(producto => producto.stock > 0);

    if (!productosDisponibles.length) {
      return res.status(404).json({ message: 'No se encontraron productos disponibles para ese propósito' });
    }

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
    if (selectedOptions?.categoria) filters.categoria = selectedOptions.categoria;
    if (selectedOptions?.propositos?.length) {
      filters.propositos = { $in: selectedOptions.propositos };
    }

    const components = await Components.find(filters);
    const availableComponents = components.filter(component => component.stock > 0);
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
// Reducir el stock de los productos según las cantidades solicitadas
const reducirStock = async (req, res) => {
  const { productos } = req.body;
  try {
    const productosActualizados = await Promise.all(productos.map(async (producto) => {
      const { idProducto, cantidad } = producto;

      // Buscar el producto primero en Components
      let componente = await Components.findById(idProducto);

      // Si no se encuentra en Components, buscar en Prearmado
      if (!componente) {
        componente = await Prearmado.findById(idProducto);
      }

      if (!componente) {
        throw new Error(`Producto con id ${idProducto} no encontrado en Components ni en Prearmado`);
      }

      if (componente.stock < cantidad) {
        throw new Error(`No hay suficiente stock para el producto ${componente.nombre}`);
      }

      // Reducir el stock y guardar los cambios
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

// Crear categoría
const crearCategoria = async (req, res) => {
  const nuevaCategoria = new Categoria(req.body);
  try {
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la categoría' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductosCarrito,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorFiltro,
  obtenerProductosPorProposito,
  getOptionsByPurpose,
  obtenerFiltrosPorCategoria,
  searchComponents,
  obtenerStockProducto,
  obtenerProductoPorId,
  reducirStock,
  crearCategoria,
};
