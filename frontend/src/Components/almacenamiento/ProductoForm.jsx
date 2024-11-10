import React, { useState, useEffect } from 'react';
import './estilos.css';

const ProductForm = ({ addOrUpdateProduct, selectedProduct }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        image: null,
    });

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name,
                category: selectedProduct.category,
                price: selectedProduct.price,
                description: selectedProduct.description,
                image: selectedProduct.image,
            });
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addOrUpdateProduct({ ...formData, id: selectedProduct ? selectedProduct.id : Date.now() });
        setFormData({ name: '', category: '', price: '', description: '', image: null });
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>{selectedProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="text"
                    name="category"
                    placeholder="Categoría"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    type="number"
                    name="price"
                    placeholder="Precio"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <br />
                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={handleChange}
                ></textarea>
                <input type="file" name="image" onChange={handleChange} />
                <button type="submit">{selectedProduct ? 'Actualizar Producto' : 'Agregar Producto'}</button>
            </form>
        </div>
    );
};

export default ProductForm;
