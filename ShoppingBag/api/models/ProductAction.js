module.exports = {
    attributes: {
	user: {
	    model: 'user'
	},
	product: {
	    model: 'product'
	},
	action : {
	    type: 'string',
	    enum: ['hit', 'buy', 'review', 'buyreview'],
	    defaultsTo: 'hit'
	}
    }
}
