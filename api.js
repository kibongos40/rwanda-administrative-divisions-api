import express from "express";
import cors from "cors";
import {
  getProvinces,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
  getDistricts,
  getSectors,
  getCells,
  getVillages
} from "rwanda-geo-structure";

const app = express();
app.use(cors());
app.use(express.json());

const capitalize = (str) => typeof str === 'string' ? str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : str;

const fillParents = (query) => {
  let { province, district, sector, cell } = query;
  
  // District names are unique across the country, so we can safely auto-resolve the province
  if (district && !province) {
    province = getProvinces().find(p => getDistrictsByProvince(p).includes(district));
  }
  
  // We do not auto-resolve from sector or cell because their names are often duplicated across different districts
  
  return { province, district, sector, cell };
};

const getParams = (req) => {
  const input = req.method === "POST" ? req.body : req.query;
  return fillParents({
    province: capitalize(input.province),
    district: capitalize(input.district),
    sector: capitalize(input.sector),
    cell: capitalize(input.cell)
  });
};

app.get("/", (req, res) => res.json({ status: "success", message: "Welcome to Rwanda Administrative Divisions API", data: null }));

app.get("/provinces", (req, res) => {
  res.json({ status: "success", message: "List of provinces", data: getProvinces() });
});

app.all("/districts", (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'POST') return next();
  try {
    const { province } = getParams(req);

    if (province) {
      return res.json({ status: "success", message: `Districts in ${province}`, data: getDistrictsByProvince(province) });
    }

    if (req.method === 'POST') {
      return res.status(400).json({ status: "error", message: "province required", data: null });
    }

    res.json({ status: "success", message: "All districts", data: getDistricts() });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch districts", data: null, error: error.message });
  }
});

app.all("/sectors", (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'POST') return next();
  try {
    const { province, district } = getParams(req);

    if (province && district) {
      return res.json({ status: "success", message: `Sectors in ${district}, ${province}`, data: getSectorsByDistrict(province, district) });
    }

    if (province) {
      const data = getDistrictsByProvince(province).flatMap(d => getSectorsByDistrict(province, d));
      return res.json({ status: "success", message: `Sectors in ${province}`, data });
    }

    if (req.method === 'POST') {
      return res.status(400).json({ status: "error", message: "district required", data: null });
    }

    res.json({ status: "success", message: "All sectors", data: getSectors() });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch sectors", data: null, error: error.message });
  }
});

app.all("/cells", (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'POST') return next();
  try {
    const { province, district, sector } = getParams(req);

    if (province && district && sector) {
      return res.json({ status: "success", message: `Cells in ${sector}, ${district}, ${province}`, data: getCellsBySector(province, district, sector) });
    }

    if (province && district) {
      const data = getSectorsByDistrict(province, district).flatMap(s => getCellsBySector(province, district, s));
      return res.json({ status: "success", message: `Cells in ${district}, ${province}`, data });
    }

    if (province) {
      const data = getDistrictsByProvince(province).flatMap(d => getSectorsByDistrict(province, d).flatMap(s => getCellsBySector(province, d, s)));
      return res.json({ status: "success", message: `Cells in ${province}`, data });
    }
    
    if (req.method === 'POST') {
      return res.status(400).json({ status: "error", message: "sector required", data: null });
    }

    res.json({ status: "success", message: "All cells", data: getCells() });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch cells", data: null, error: error.message });
  }
});

app.all("/villages", (req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'POST') return next();
  try {
    const { province, district, sector, cell } = getParams(req);

    if (province && district && sector && cell) {
      return res.json({ status: "success", message: `Villages in ${cell}, ${sector}, ${district}, ${province}`, data: getVillagesByCell(province, district, sector, cell) });
    }

    if (province && district && sector) {
      const data = getCellsBySector(province, district, sector).flatMap(c => getVillagesByCell(province, district, sector, c));
      return res.json({ status: "success", message: `Villages in ${sector}, ${district}, ${province}`, data });
    }

    if (province && district) {
      const data = getSectorsByDistrict(province, district).flatMap(s => getCellsBySector(province, district, s).flatMap(c => getVillagesByCell(province, district, s, c)));
      return res.json({ status: "success", message: `Villages in ${district}, ${province}`, data });
    }

    if (province) {
      const data = getDistrictsByProvince(province).flatMap(d => getSectorsByDistrict(province, d).flatMap(s => getCellsBySector(province, d, s).flatMap(c => getVillagesByCell(province, d, s, c))));
      return res.json({ status: "success", message: `Villages in ${province}`, data });
    }

    if (req.method === 'POST') {
      return res.status(400).json({ status: "error", message: "cell required", data: null });
    }

    res.json({ status: "success", message: "All villages", data: getVillages() });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch villages", data: null, error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
    res.status(500).json({ status: "error", message: "Internal server error", data: null, error: err.message });
});

export default app;
