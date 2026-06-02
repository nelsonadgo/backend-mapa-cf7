const reportesService = require("./reportes.services.js");


const listReportes = async (req, res) => {
  const { data, count } = await reportesService.listReportes();

    res.json({
    status: "success",
    total: count,
    datos: data,
    });
};

const getReporte = async (req, res) => {
    const reporte = await reportesService.getReporteById(req.params.id);
    res.json({
    status: "success",
    datos: reporte,
    });
};

module.exports = {
    listReportes,
    getReporte,
};