require("dotenv").config();
const bcrypt = require("bcryptjs");

const { Pool } = require("pg");



  const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    allowExitOnIdle: true,
  });



const getUsers = async () => {
    const { rows: users } = await pool.query("SELECT * FROM usuarios");
    return users;
};


const registrarUsuario = async (usuario) => {
    let {email, password, rol, lenguaje} = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, rol, lenguaje];
    const consulta = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
    await pool.query(consulta, values);
}; 


const verificarCredenciales = async (email, password) => {
    const values = [email];
    const consulta = "SELECT * FROM usuarios WHERE email = $1";

    const {rows: [usuario], rowCount} = await pool.query(consulta, values);

    const {password: passwordEncriptada} = usuario;

    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);
    if (!passwordEsCorrecta || !rowCount)
    throw {code: 401, message: "Email o contraseña incorrecta"}

};

module.exports = {getUsers, registrarUsuario, verificarCredenciales }