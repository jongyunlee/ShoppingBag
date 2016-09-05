module.exports.connections = {
    server: {
	adapter: <%= db_adapter %>,
	host: <%= db_host %>,
	port: <%= db_port %>,
	database: <%= db_name %>
    }
};
