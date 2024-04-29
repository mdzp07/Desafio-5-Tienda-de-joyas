import { obtenerJoyas, filtrarJoyas } from './consultas.js';
import express from 'express';
import reportarConsulta from './Middleware/reportarConsulta.js';

const app = express();

app.use(reportarConsulta)
app.use(express.json());
app.listen(3000, console.log("Servidor encendido en puerto 3000"));

const prepararHATEOAS = (joyas) => {
    const results = joyas.map((j) => {
        return {
            name: j.nombre,
            href: `/joyas/joya/${j.id}`,
        }
    })
    const totalJoyas = joyas.length
    const stockTotal = joyas.reduce((totalStock, joya) => totalStock + joya.stock, 0)
    const HATEOAS = {
        totalJoyas,
        stockTotal,
        results
    }
    return HATEOAS
}

app.get('/joyas', async (req, res)=>{
    try{
      const query = req.query;
      const joyas = await obtenerJoyas(query);
      const HATEOAS = prepararHATEOAS(joyas);
      res.json(HATEOAS);
  
    }catch(error){
      res.status(500).send(error)
    }
  });

app.get('/joyas/filtros', async (req, res) => {
    try {
        const queryStrings = req.query
        const joyas = await filtrarJoyas(queryStrings)
        res.json(joyas)
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("*", async (req, res) => {
    res.status(404).send("Esta ruta no existe")
})
