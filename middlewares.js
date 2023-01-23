const jwt = require("jsonwebtoken");
require("dotenv").config();


const reporteConsulta = async (req, res, next) => {
    const url = req.url;
    console.log(
      `Hoy ${new Date()} Se ha recibido una consulta en la ruta ${url}`);
    next();
  };

  const checkCredentials = async (req, res, next) => {
   try{
    const {email, password} = req.body;
    if (!email || !password) {
        throw {code: 401, message: 'Ninguno de los campos puede estar vacio'};
    }
    next();
   } catch (error) {
    res.status(error.code || 500).send(error);
   }
  };

  const tokenVerification = (req, res, next) => {
    const token = req.header("Authorization").split("Bearer")[1]
    if(!token) throw {code: 401, message: "Falta incluir el token"}

    const tokenValido = jwt.verify(token, process.env.SECRET_KEY)
    if(!tokenValido) throw {code: 401, message: "El Token es invalido"}
    next()
  };



  module.exports = {reporteConsulta, checkCredentials, tokenVerification}