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

const endpoints = [
  ["/provinces", getProvinces, [], "get", "List of provinces"],
  ["/districts", getDistrictsByProvince, ["province"], "post", "Districts in %s"],
  ["/sectors", getSectorsByDistrict, ["province", "district"], "post", "Sectors in %s, %s"],
  ["/cells", getCellsBySector, ["province", "district", "sector"], "post", "Cells in %s, %s, %s"],
  ["/villages", getVillagesByCell, ["province", "district", "sector", "cell"], "post", "Villages in %s, %s, %s, %s"]
];

endpoints.forEach(([route, fn, params, method, msg]) => {
  app[method](route, (req, res) => {
    try {
      const args = params.map(p => req[method === "get" ? "query" : "body"][p]);
      if (params.length && args.some(a => !a)) {
        return res.status(400).json({ status: "error", message: `${params.join(", ")} required`, data: null });
      }
      const data = fn(...args);
      res.json({
        status: "success",
        message: msg.replace(/%s/g, () => args.shift()),
        data
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: `Failed to fetch ${route.replace("/","")}` , data: null, error: error.message });
    }
  });
});

// Helper function to filter data based on query parameters
const filterData = (data, filters) => {
  if (!filters || Object.keys(filters).length === 0) return data;

  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true; // Skip empty filters
      return item[key] && item[key].toLowerCase() === value.toLowerCase();
    });
  });
};

// GET endpoints with query parameter filtering
app.get("/districts", (req, res) => {
  try {
    const { province } = req.query;
    let data;

    if (province) {
      data = getDistrictsByProvince(province);
    } else {
      // Get all districts and filter if needed
      data = getDistricts();
    }

    res.json({
      status: "success",
      message: province ? `Districts in ${province}` : "All districts",
      data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch districts",
      data: null,
      error: error.message
    });
  }
});

app.get("/sectors", (req, res) => {
  try {
    const { province, district } = req.query;
    let data;

    if (province && district) {
      // Use the specific function if both province and district are provided
      data = getSectorsByDistrict(province, district);
    } else {
      // Get all sectors and filter based on available query parameters
      data = getSectors();
      const filters = {};
      if (province) filters.province = province;
      if (district) filters.district = district;
      data = filterData(data, filters);
    }

    const message = province && district
      ? `Sectors in ${district}, ${province}`
      : province
        ? `Sectors in ${province}`
        : district
          ? `Sectors in ${district}`
          : "All sectors";

    res.json({
      status: "success",
      message,
      data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch sectors",
      data: null,
      error: error.message
    });
  }
});

app.get("/cells", (req, res) => {
  try {
    const { province, district, sector } = req.query;
    let data;

    if (province && district && sector) {
      // Use the specific function if all parameters are provided
      data = getCellsBySector(province, district, sector);
    } else {
      // Get all cells and filter based on available query parameters
      data = getCells();
      const filters = {};
      if (province) filters.province = province;
      if (district) filters.district = district;
      if (sector) filters.sector = sector;
      data = filterData(data, filters);
    }

    const messageParts = [];
    if (sector) messageParts.push(sector);
    if (district) messageParts.push(district);
    if (province) messageParts.push(province);

    const message = messageParts.length > 0
      ? `Cells in ${messageParts.join(", ")}`
      : "All cells";

    res.json({
      status: "success",
      message,
      data
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch cells",
      data: null,
      error: error.message
    });
  }
});

app.get("/villages", (req, res) => {
  try {
    const { province, district, sector, cell } = req.query;
    let data;

    if (province && district && sector && cell) {
      // Use the specific function if all parameters are provided
      data = getVillagesByCell(province, district, sector, cell);
    } else {
      // Get all villages and filter based on available query parameters
      data = getVillages();
      const filters = {};
      if (province) filters.province = province;
      if (district) filters.district = district;
      if (sector) filters.sector = sector;
      if (cell) filters.cell = cell;
      data = filterData(data, filters);
    }

    const messageParts = [];
    if (cell) messageParts.push(cell);
    if (sector) messageParts.push(sector);
    if (district) messageParts.push(district);
    if (province) messageParts.push(province);

    const message = messageParts.length > 0
      ? `Villages in ${messageParts.join(", ")}`
      : "All villages";

    res.json([{
      status: "success",
      message,
      data
    }]);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch villages",
      data: null,
      error: error.message
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
    res.status(500).json({ status: "error", message: "Internal server error", data: null, error: err.message });
});

export default app;
