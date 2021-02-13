/**
 * This file contains all database related configurations. Here we are getting all the
 * configuration from .env file.
 * @package dbconfig
 * @subpackage sources\services\dbconfig\dbconfig
 * @author SEPA Cyper Technologies, Sujit kumar.
 */

export const config = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    port: process.env.DBPORT,
    password: process.env.DBPASSWORD,
    database: process.env.DB,
    connectTimeout : process.env.CONNECTTIMEOUT
};