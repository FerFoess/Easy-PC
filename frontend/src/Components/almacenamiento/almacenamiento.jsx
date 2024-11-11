import React, { useState } from 'react';
import ProductForm from './ProductoForm';
import './estilos.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const addOrUpdateProduct = (product) => {
        if (selectedProduct) {
            setProducts(products.map((p) => (p.id === product.id ? product : p)));
        } else {
            setProducts([...products, { ...product, id: Date.now() }]);
        }
        setSelectedProduct(null);
    };

    const handleDelete = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="container">
            <h1>Lista de Productos</h1>
            <ProductForm addOrUpdateProduct={addOrUpdateProduct} selectedProduct={selectedProduct} />
            <div className="card-container">
                {products.map((product) => (
                    <div className="card" key={product.id}>
                        <div className="card-image">
                            {product.image && (
                                <img src={URL.createObjectURL(product.image)} alt={product.name} width="100" />
                            )}
                        </div>
                        <div className="card-content">
                            <h3>{product.name}</h3>
                            <p><strong>Categoría:</strong> {product.category}</p>
                            <p><strong>Precio:</strong> ${product.price}</p>
                            <p><strong>Descripción:</strong> {product.description}</p>
                        </div>
                        <div className="card-actions">
                            <button className="button" onClick={() => handleEdit(product)}>Editar</button>
                            <button className="button" onClick={() => handleDelete(product.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
