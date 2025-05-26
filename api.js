import express from "express";
import cors from "cors";
import { getProvinces, getDistrictsByProvince, getSectorsByDistrict, getCellsBySector, getVillagesByCell } from "rwanda-geo-structure";

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

// Global error handler
app.use((err, req, res, next) => {
    res.status(500).json({ status: "error", message: "Internal server error", data: null, error: err.message });
});

export default app;
