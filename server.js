const express = require('express')
const app = express()
require("dotenv").config();
const port = process.env.PORT
const {ingresarCandidato, traerCandidatos, eliminarCandidato, editarCandidato, ingresarVotos, traerHistorial} = require('./consultas.js')

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/candidato', async(req, res)=>{
    const data = Object.values(req.body);
    try {
        const result = await ingresarCandidato(data);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send("Candidato no fue ingresado");
    }
});

app.get('/candidatos', async(req, res)=>{
    try {
        const result = await traerCandidatos();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("No se encuentra candidatos");
    }
});

app.delete('/candidato', async(req, res)=>{
    const id = Object.values(req.query);
    try {
        const result = await eliminarCandidato(id);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("El candidato no fue eliminado")
    }
});

app.put('/candidato', async(req, res)=>{
    const data = Object.values(req.body);
    try {
        const result = await editarCandidato(data);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("El candidato no fue editado")
    }
});

app.post('/votos', async(req, res)=>{
    const data = (req.body);
    try {
        const result = await ingresarVotos(data);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send("No se pudo actualizar los votos")
    }
});

app.get('/historial', async(req, res)=>{
    try {
        const result = await traerHistorial();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send("No se pudo traer el historial")
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))