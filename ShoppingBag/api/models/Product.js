module.exports = {
    attributes: {
	name: {
	    type: 'string',
	    required: true
	},
	price: {
	    type: 'integer',
	    required: true
	},
	image: {
	    type: 'string',
	    required: true
	},
	total_stock: {
	    type: 'integer',
	    required: true,
	    defaultsTo: 0
	},
	description: {
	    type: 'text',
	    required: true
	},
	hit: {
	    type: 'integer',
	    required: true,
	    defaultsTo: 0.0
	},
	rating: {
	    type: 'float',
	    required: true,
	    defaultsTo: 0.0
	},
	reviews: {
	    collection: 'review',
	    via: 'product'
	},
	product_actions: {
	    collection: 'productaction',
	    via: 'product'
	},
	products_in_cart: {
	    collection: 'cartproduct',
	    via: 'product'
	}
    }
};
