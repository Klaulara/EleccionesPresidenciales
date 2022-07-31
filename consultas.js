const { Pool } = require('pg');
require("dotenv").config();

const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DB
});

const ingresarCandidato = async (data) => {
    const SQLQuery = {
        text: "INSERT INTO candidatos(nombre, foto, color) VALUES($1, $2, $3) RETURNING *;",
        values: data
    }
    try {
        const result = await pool.query(SQLQuery);
        return result.rows
    } catch (error) {
        throw new Error();
    }
};

const traerCandidatos = async () => {
    const SQLQuery = {
        text: "SELECT * FROM candidatos"
    }
    try {
        const result = await pool.query(SQLQuery);
        console.log(result.rows)
        return result.rows
    } catch (error) {
        throw new Error();
    }
}

const eliminarCandidato = async (id) => {
    const SQLQuery = {
        text: "DELETE FROM candidatos WHERE id=$1 RETURNING *;",
        values: id
    }
    try {
        const result = await pool.query(SQLQuery);
        return result;
    } catch (error) {
        throw new Error();
    }
};

const editarCandidato = async (data) => {
    const SQLQuery = {
        text: "UPDATE candidatos SET nombre=$1, foto=$2 WHERE id=$3 RETURNING *;",
        values: data
    }
    try {
        const result = await pool.query(SQLQuery);
        return result;
    } catch (error) {
        throw new Error();
    }
};

const ingresarVotos = async (data) => {
    const { estado, votos, ganador } = data;
    let votoNumero = parseInt(votos)
    const SQLQuery = {
        text: "INSERT INTO historial (estado, votos, ganador) VALUES ($1, $2, $3) RETURNING *;",
        values: [estado, votos, ganador]
    }
    const SQLQuery2 = {
        text: "UPDATE candidatos SET votos=votos+$1 WHERE nombre=$2 RETURNING *;",
        values: [votoNumero, ganador]
    }
    try {
        await pool.query('BEGIN');
        await pool.query(SQLQuery);
        await pool.query(SQLQuery2);
        await pool.query('COMMIT');
        return true;
    } catch (error) {
        await pool.query('ROLLBACK');
        throw new Error();
    }
};

const traerHistorial = async () => {
    const SQLQuery = {
        text: "SELECT * FROM historial",
        rowMode: "array"
    }
    try {
        const result = await pool.query(SQLQuery);
        return result.rows;
    } catch (error) {
        throw new Error();
    }
}

module.exports = { 
    ingresarCandidato, 
    traerCandidatos, 
    eliminarCandidato, 
    editarCandidato, 
    ingresarVotos, 
    traerHistorial 
}