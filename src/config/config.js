require('dotenv').config()
module.exports ={
  "development": {
    "username": process.env.DB_USER,
    "password": String(process.env.DB_PASSWORD),
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port": Number(process.env.DB_PORT)
  },
  "test": {
    "username": process.env.DB_USER,
    "password": String(process.env.DB_PASSWORD),
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres",
    "port": Number(process.env.DB_PORT)
  }
}
