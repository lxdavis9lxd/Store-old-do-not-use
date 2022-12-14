var fs = require('mz/fs')
const util = require('util');
const mysql = require('mysql2');
//console.log("dbHost", process.env)
const pool = mysql.createPool({
    connectionLimit: 10,

   

    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    port: process.env.DB_PORT || 3306,
    "typeCast": function castField( field, useDefaultTypeCasting ) {
        if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
            const bytes = field.buffer();
            return( bytes[ 0 ] === 1 );
        }
        return( useDefaultTypeCasting() );
    }
});

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ER_DUP_ENTRY') {
            console.error('dup.',connection.sqlMessage);
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
        console.log ("errorcode", err.code)
    }
     //console.log ("did it work",connection.release)
    if (connection) connection.release();
        
    return;
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

module.exports = pool;
