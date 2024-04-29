import pkg from 'pg';
const { Pool } = pkg;
import {config} from 'dotenv';
import format from "pg-format";

config();

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,    
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    allowExitOnIdle: true
})

const obtenerJoyas = async ({limits = 10, order_by = "id_ASC", page = 1}) => {

    const offset = (page - 1) * limits
    const [campo, direccion] = order_by.split("_")

    const consulta = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset);
    const { rows } = await pool.query(consulta);
    return rows;

}

const filtrarJoyas = async ({ precio_min, precio_max, categoria, metal }) => {
    let filtros = []
    const values = []

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }

    if (precio_min) agregarFiltro('precio', '>=', precio_min)
    if (precio_max) agregarFiltro('precio', '<=', precio_max)
    if (categoria) agregarFiltro('categoria', '=', categoria)
    if (metal) agregarFiltro('metal', '=', metal)

    let consulta = "SELECT * FROM inventario"

    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
    const { rows } = await pool.query(consulta, values)
    return rows;
}


  export { obtenerJoyas, filtrarJoyas }