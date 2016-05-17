const mysql = require('mysql');
const devConfig = {
	host: 'localhost',
	database: 'corral',
	user: 'corral_user',
	password: 'bad_password',
	connectionLimit: 100,
};

const pool = mysql.createPool(devConfig);

function get(query, values, callback, errorCallback) {
	pool.getConnection(function(error, connection) {
        if(error) {
        	errorCallback(error);
        }
        else {
        	connection.query(query, values, function(error, results, fields) {
        		if(error) {
                    errorCallback(error);
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
