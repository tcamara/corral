const mysql = require('mysql');
const dev_config = {
	host: 'localhost',
	database: 'corral',
	user: 'corral_user',
	password: 'bad_password',
	connectionLimit: 100,
};

const pool = mysql.createPool(dev_config);

function get(query, values, callback, error_callback) {
	pool.getConnection(function(error, connection) {
        if(error) {
        	error_callback(error);
        }
        else {
        	connection.query(query, values, function(error, results, fields) {
        		if(error) {
                    error_callback(error);
        		}
        		else {
        			callback(results, fields);
        		}
        	});

        	connection.release();
        }
    });
}

module.exports = get;

