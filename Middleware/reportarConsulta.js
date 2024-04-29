const reportarConsulta = async (req, res, next) => {
    const parametros = req.query
    const url = req.url
    console.log(`
    Hemos recibido una consulta en la ruta ${url}
    con los parámetros:
    `, parametros)
    next()
}

export default reportarConsulta;