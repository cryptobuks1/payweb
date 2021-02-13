
/**
 * This file contains all database related configurations. Here we are getting all the
 * configuration from .env file.
 * @package dbconfig
 * @subpackage sources\services\dbconfig\dbconfig
 * @author SEPA Cyber Technologies, Sujit kumar , Sekhara Suman Sahu.
 */

const mariadbCallback = require('mariadb/callback');
export const mariadb = require('mariadb');

export class DbConnMgr {
  constructor() {
    DbConnMgr.__instance = null;
    DbConnMgr.__writeConn = null;
    DbConnMgr.__readConn = null;
    DbConnMgr.__pool = null;
  }
  //Method for getting instance of the current class
  static getInstance() {
    if (DbConnMgr.__instance == null) {
      DbConnMgr.__instance = new DbConnMgr();
    }
    return DbConnMgr.__instance;
  }

  //Method for establishing database connection
  static __createReadConn() {
    if (DbConnMgr.__readConn == null) {
      let config = {
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        port: process.env.DBPORT,
        password: process.env.DBPASSWORD,
        database: process.env.DB,
        connectionLimit: process.env.DBCONNECTIONLIMIT,
        noControlAfterUse : process.env.NOCONTROLEAFTERUSE,
        dateStrings: true
      };
      DbConnMgr.__readConn = mariadbCallback.createPool(config);
    }
    return DbConnMgr.__readConn;
  }

  //Method for establishing database connection
  static __createWriteConn() {
    if (DbConnMgr.__writeConn == null) {
      let config = {
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        port: process.env.DBPORT,
        password: process.env.DBPASSWORD,
        database: process.env.DB,
        connectionLimit: process.env.DBCONNECTIONLIMIT,
        noControlAfterUse : process.env.NOCONTROLEAFTERUSE,
        dateStrings: true
      };
      DbConnMgr.__writeConn = mariadbCallback.createPool(config);
    }
    return DbConnMgr.__writeConn;
  }

  //Method for SQL query execution (Common method executing SQL query. Eventually it will be removed.)
  executeQuery(sql) {
    return new Promise((resolve, reject) => {
      let pool = DbConnMgr.__createReadConn();

      pool.getConnection((err, conn) => {
        if (err) reject(err);
        conn.query(sql, (err, res) => {
          if (err) {
            conn.end();
            reject(err);
          }
          conn.end();
          resolve(res);
        })
      })
    });
  }

  //Method to execute select queries
  doRead(sql) {
    return new Promise((resolve, reject) => {

      let pool = DbConnMgr.__createReadConn();

      pool.getConnection((err, conn) => {
        if (err) reject(err);
        conn.query(sql, (err, res) => {
          if (err) {
            conn.end();
            reject(err);
          }
          conn.end();
          resolve(res);
        })
      })
    })
  }

  //Method to execute insert queries
  doInsert(sql) {
    return new Promise((resolve, reject) => {

      let pool = DbConnMgr.__createWriteConn();

      pool.getConnection((err, conn) => {
        if (err) reject(err);
        conn.query(sql, (err, res) => {
          if (err) {
            conn.end();
            reject(err);
          }
          conn.end();
          resolve(res);
        })
      })
    })
  }

  //Method to execute update queries
  doUpdate(sql) {
    return new Promise((resolve, reject) => {
      let pool = DbConnMgr.__createWriteConn();

      pool.getConnection((err, conn) => {
        if (err) reject(err);
        conn.query(sql, (err, res) => {
          if (err) {
            conn.end();
            reject(err);
          }
          conn.end();
          resolve(res);
        })
      })
    })
  }
  //Method to execute delete queries
  doDelete(sql) {
    return new Promise((resolve, reject) => {
      let pool = DbConnMgr.__createWriteConn();

      pool.getConnection((err, conn) => {
        if (err) reject(err);
        conn.query(sql, (err, res) => {
          if (err) {
            conn.end();
            reject(err);
          }
          conn.end();
          resolve(res);
        })
      })
    })
  }


  //Method for getting single connection pool object
  async getConnObject() {
    if (DbConnMgr.__pool == null) {
      try {
        const pool = mariadb.createPool({
          host: process.env.DBHOST,
          user: process.env.DBUSER,
          port: process.env.DBPORT,
          password: process.env.DBPASSWORD,
          database: process.env.DB
        });
        DbConnMgr.__pool = pool;
      } catch (err) {
        throw new Error('Error while getting single Promise DB conn.');
      }
    }
    let conn = await DbConnMgr.__pool.getConnection();
    return conn;
  }

}