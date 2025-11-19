import { useEffect, useState } from "react";
import axios from 'axios';
import config from 'config';
import BTN from "../../components/reactBits/BTN";

export default function ViewProduct() {
    const [productData, setProductData] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [hasSizeVariant, setHasSizeVariant] = useState(false);
    const [hasBothVariant, setHasBothVariant] = useState(false);
    const [hasColorVariant, setHasColorVariant] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);

    const product_id = new URLSearchParams(window.location.search).get('id');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.baseApi}/product/get-product-by-id`, {
                    params: { id: product_id }
                });
                setProductData(response.data);
            } catch (err) {
                console.log('Unable to fetch product data: ', err)
            }

            try {
                const resVariant = await axios.get(`${config.baseApi}/product/get-all-product-variants`)
                const varData = resVariant.data;

                const prodVariant = varData.filter(prod => prod.product_id === product_id);
                if (prodVariant.length === 0) {
                    console.log('NO VARIANTS')
                    setVariants([]);
                } else {
                    console.log('IT HAS VARIANT')
                    setVariants(prodVariant);

                    // Check variant types
                    const sizeVariantExists = prodVariant.some(variant => variant.variant_type === 'size');
                    const colorVariantExists = prodVariant.some(variant => variant.variant_type === 'color');
                    const bothVariantExists = prodVariant.some(variant => variant.variant_type === 'size-color');
                    setHasBothVariant(bothVariantExists);
                    setHasSizeVariant(sizeVariantExists);
                    setHasColorVariant(colorVariantExists);

                    // Auto-select first size and color if available
                    if (sizeVariantExists) {
                        const firstSize = prodVariant.find(variant => variant.variant_type === 'size');
                        setSelectedSize(firstSize?.size || null);
                    }

                    if (colorVariantExists) {
                        const firstColor = prodVariant.find(variant => variant.variant_type === 'color');
                        setSelectedColor(firstColor?.color || null);
                    }

                    if (bothVariantExists) {
                        const bothvariant = prodVariant.find(variant => variant.variant_type === 'size-color');
                        setSelectedColor(bothvariant?.color || null);
                        setSelectedSize(bothvariant?.size || null);
                    }

                    // Auto-select first variant if no size/color variants
                    if (prodVariant.length > 0 && !sizeVariantExists && !colorVariantExists) {
                        setSelectedVariant(prodVariant[0]);
                    }
                }
            } catch (err) {
                console.log('NO VARIANTS FOR THIS PRODUCT: ', err)
                setVariants([]);
            }
        }
        fetchData();
    }, [product_id]);

    // Find matching variant when size or color changes
    useEffect(() => {
        if (hasSizeVariant && hasColorVariant && selectedSize && selectedColor) {
            const matchingVariant = variants.find(variant =>
                variant.size === selectedSize && variant.color === selectedColor
            );
            setSelectedVariant(matchingVariant || null);
        } else if (hasSizeVariant && selectedSize && !hasColorVariant) {
            // Only size variants
            const matchingVariant = variants.find(variant => variant.size === selectedSize);
            setSelectedVariant(matchingVariant || null);
        } else if (hasColorVariant && selectedColor && !hasSizeVariant) {
            // Only color variants
            const matchingVariant = variants.find(variant => variant.color === selectedColor);
            setSelectedVariant(matchingVariant || null);
        }
    }, [selectedSize, selectedColor, variants, hasSizeVariant, hasColorVariant]);

    const handleVariantClick = (variant) => {
        setSelectedVariant(variant);
        setSelectedSize(variant.size || null);
        setSelectedColor(variant.color || null);
        setQuantity(1);
    };

    const getImageUrl = (attachmentPath) => {
        if (!attachmentPath) return "https://via.placeholder.com/400x400";
        if (attachmentPath.startsWith('http')) {
            return attachmentPath;
        }
        return `${config.baseApi}/${attachmentPath}`;
    };

    const handleAddToCart = () => {
        if (!productData || !selectedVariant) return;

        console.log('Added to cart:', {
            product: productData.product_name,
            variant: selectedVariant,
            quantity: quantity
        });
    };

    const handleBuyNow = () => {
        if (!productData || !selectedVariant) return;

        console.log('Buy now:', {
            product: productData.product_name,
            variant: selectedVariant,
            quantity: quantity
        });
    };

    if (!productData) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading product...</div>;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '40px' }}>
                {/* Product Image - Simple Square */}
                <div>
                    <img
                        src={getImageUrl(productData.attachment)}
                        alt={productData.product_name}
                        style={{
                            width: '300px',
                            height: '300px',
                            borderRadius: '8px',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x300";
                        }}
                    />
                </div>

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                    <h1 style={{ marginBottom: '10px' }}>{productData.product_name}</h1>

                    {/* Product SKU */}
                    <div style={{ color: '#666', marginBottom: '15px' }}>
                        SKU: {productData.product_sku}
                    </div>

                    {/* Selected Variant Details */}
                    {/* {selectedVariant && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            border: '1px solid #e9ecef'
                        }}>
                            <h3 style={{ marginBottom: '10px', color: '#495057' }}>Selected Variant Details</h3>
                            <div style={{ display: 'grid', }}>
                                <div>
                                    <strong>Stocks:</strong> {selectedVariant.quantity_in_stock}
                                </div>
                                <div>
                                    <strong>Purchase Price:</strong> ${selectedVariant.purchase_price}
                                </div>
                                <div>
                                    <strong>Selling Price:</strong> ${selectedVariant.selling_price}
                                </div>
                                {(selectedSize || selectedColor) && (
                                    <div>
                                        <strong>Variant:</strong>
                                        {selectedSize && ` ${selectedSize}`}
                                        {selectedSize && selectedColor && ' / '}
                                        {selectedColor && ` ${selectedColor}`}
                                    </div>
                                )}
                            </div>
                        </div>
                    )} */}

                    {/* Product Description */}
                    <div style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                        <strong>Description: </strong>
                        {productData.product_description}
                    </div>

                    {/* Category and Subcategory */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px', color: '#666' }}>
                            <div>
                                <strong>Category:</strong> {productData.product_category}
                            </div>
                            <div>
                                <strong>Subcategory:</strong> {productData.product_subcategory}
                            </div>
                        </div>
                    </div>

                    {/* Unit of Measure */}
                    <div style={{ marginBottom: '20px', color: '#666' }}>
                        <strong>Unit: </strong> Per {productData.unit_of_measure}
                    </div>

                    {/* Variant Selection */}
                    {variants.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            {/* Show message when combination is not available */}
                            {hasSizeVariant && hasColorVariant && selectedSize && selectedColor && !selectedVariant && (
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: '#fff3cd',
                                    border: '1px solid #ffeaa7',
                                    borderRadius: '4px',
                                    color: '#856404',
                                    marginTop: '10px'
                                }}>
                                    The selected combination ({selectedSize} / {selectedColor}) is not available.
                                </div>
                            )}

                            {/* Variants Table */}
                            <div style={{
                                marginTop: '20px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    backgroundColor: 'white'
                                }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            {/* Show Size column only if size variants exist */}
                                            {hasSizeVariant && <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Size</th>}

                                            {/* Show Color column only if color variants exist */}
                                            {hasColorVariant && <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Color</th>}

                                            {/* Show Size/Color combination column only if BOTH exist */}
                                            {hasBothVariant && (
                                                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Size/Color</th>
                                            )}

                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Stock</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Purchase Price</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Selling Price</th>
                                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((variant, index) => (
                                            <tr
                                                key={index}
                                                style={{
                                                    backgroundColor: selectedVariant?.id === variant.id ? '#e3f2fd' : 'white',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onClick={() => handleVariantClick(variant)}
                                            >
                                                {/* Show Size data only if size variants exist */}
                                                {hasSizeVariant && (
                                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                                        {variant.size || '-'}
                                                    </td>
                                                )}

                                                {/* Show Color data only if color variants exist */}
                                                {hasColorVariant && (
                                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                                        {variant.color || '-'}
                                                    </td>
                                                )}

                                                {/* Show Size/Color combination only if BOTH exist */}
                                                {hasBothVariant && (
                                                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                                        {variant.size && variant.color
                                                            ? `${variant.size} / ${variant.color}`
                                                            : variant.size || variant.color || '-'
                                                        }
                                                    </td>
                                                )}

                                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                                    {variant.quantity_in_stock}
                                                </td>
                                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                                    ${variant.purchase_price}
                                                </td>
                                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                                    ${variant.selling_price}
                                                </td>
                                                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                                    <div style={{ cursor: 'pointer' }}>
                                                        <BTN
                                                            label={'select'}
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleVariantClick(variant);
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Quantity Selection */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px', color: '#666' }}>

                            <h7>Quantity</h7>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    disabled={selectedVariant && quantity <= 1}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        border: '1px solid #ddd',
                                        background: 'white',
                                        borderRadius: '4px',
                                        cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                                        opacity: quantity > 1 ? 1 : 0.5
                                    }}
                                >
                                    -
                                </button>
                                <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    disabled={selectedVariant && quantity >= selectedVariant.quantity_in_stock}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        border: '1px solid #ddd',
                                        background: 'white',
                                        borderRadius: '4px',
                                        cursor: selectedVariant && quantity < selectedVariant.quantity_in_stock ? 'pointer' : 'not-allowed',
                                        opacity: selectedVariant && quantity < selectedVariant.quantity_in_stock ? 1 : 0.5
                                    }}
                                >
                                    +
                                </button>
                            </div>
                            {selectedVariant && (
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                    Maximum: {selectedVariant.quantity_in_stock} units available
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedVariant}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: selectedVariant ? 'pointer' : 'not-allowed',
                                backgroundColor: selectedVariant ? '#ffc107' : '#ccc',
                                color: '#333',
                                opacity: selectedVariant ? 1 : 0.6
                            }}
                        >
                            Add To Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={!selectedVariant}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: selectedVariant ? 'pointer' : 'not-allowed',
                                backgroundColor: selectedVariant ? '#007bff' : '#ccc',
                                color: 'white',
                                opacity: selectedVariant ? 1 : 0.6
                            }}
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Additional Product Info */}
                    <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            <div><strong>Created by:</strong> {productData.created_by}</div>
                            <div><strong>Created at:</strong> {new Date(productData.created_at).toLocaleDateString()}</div>
                            <div><strong>Status:</strong> {productData.is_active ? 'Active' : 'Inactive'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}