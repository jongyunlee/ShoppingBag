module.exports = {
    attributes: {
	product : {
	    model: 'product'
	},
	user : {
	    model: 'user'
	},
	content : {
	    type: 'text',
	    required: true
	},
	rating: {
	    type: 'float',
	    required: true,
	    defaultsTo: 0.0
	}
    }
}
