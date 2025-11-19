const icons = { product: <i className="ph ph-package" />, add: <i className="ph ph-plus" />, chest: <i className="ph ph-treasure-chest" /> };

const tools = {
    id: 'Tools',
    title: 'Tools',
    type: 'group',
    icon: icons.add,
    children: [
        {
            id: 'product',
            title: 'Products',
            type: 'collapse',
            icon: icons.product,
            children: [
                {
                    id: 'add-product',
                    title: 'Add Product',
                    type: 'item',
                    icon: icons.add,
                    url: '/products/add-product'

                },
                {
                    id: 'product-table',
                    title: 'All Products',
                    type: 'item',
                    icon: icons.chest,
                    url: '/products/product-table'

                },

            ]
        },

    ]
};

export default tools;
