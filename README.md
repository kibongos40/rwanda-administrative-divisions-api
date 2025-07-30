# Rwanda Administrative Divisions API

A simple Express.js API for querying Rwanda's administrative divisions: Provinces, Districts, Sectors, Cells, and Villages. Powered by the [`rwanda-geo-structure`](https://www.npmjs.com/package/rwanda-geo-structure) package.

- **Live API:** [https://rda-ad-divisions.onrender.com/](https://rda-ad-divisions.onrender.com/)
- **GitHub Repo:** [kibongos40/rwanda-administrative-divisions-api](https://github.com/kibongos40/rwanda-administrative-divisions-api)

## Features
- Get all provinces
- Get districts by province (POST and GET with query parameters)
- Get sectors by district (POST and GET with query parameters)
- Get cells by sector (POST and GET with query parameters)
- Get villages by cell (POST and GET with query parameters)
- Filter data using URL query parameters
- Consistent JSON responses
- Robust error handling
- CORS enabled (open to all)

---

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/kibongos40/rwanda-administrative-divisions-api.git
cd rwanda-administrative-divisions-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment (Optional)**

You can set a custom port by creating a `.env` file or exporting `PORT`:

```bash
export PORT=3000
```

---

## Run the API

```bash
npm start
```

The server will start on `http://localhost:80` by default, or your specified `PORT`.

---

## API Endpoints

All responses are in the format:
```json
{
  "status": "success" | "error",
  "message": "...",
  "data": [ ... ] | null,
  "error": "..." // only on error
}
```

### Root
- **GET /**
  - Welcome message.

### Provinces
- **GET /provinces**
  - Returns all provinces.

### Districts
- **POST /districts**
  - **Body:** `{ "province": "Kigali" }`
  - Returns districts in the given province.

- **GET /districts**
  - **Query Parameters:** `?province=Kigali` (optional)
  - Returns all districts or districts filtered by province.
  - Examples:
    - `/districts` - Returns all districts
    - `/districts?province=Kigali` - Returns districts in Kigali

### Sectors
- **POST /sectors**
  - **Body:** `{ "province": "Kigali", "district": "Gasabo" }`
  - Returns sectors in the given district.

- **GET /sectors**
  - **Query Parameters:** `?province=...&district=...` (optional)
  - Returns all sectors or sectors filtered by province and/or district.
  - Examples:
    - `/sectors` - Returns all sectors
    - `/sectors?district=Gasabo` - Returns sectors in Gasabo district
    - `/sectors?province=Kigali&district=Gasabo` - Returns sectors in Gasabo, Kigali

### Cells
- **POST /cells**
  - **Body:** `{ "province": "Kigali", "district": "Gasabo", "sector": "Remera" }`
  - Returns cells in the given sector.

- **GET /cells**
  - **Query Parameters:** `?province=...&district=...&sector=...` (optional)
  - Returns all cells or cells filtered by province, district, and/or sector.
  - Examples:
    - `/cells` - Returns all cells
    - `/cells?province=Kigali&district=Gasabo&sector=Remera` - Returns cells in Remera, Gasabo, Kigali

### Villages
- **POST /villages**
  - **Body:** `{ "province": "Kigali", "district": "Gasabo", "sector": "Remera", "cell": "Nyabisindu" }`
  - Returns villages in the given cell.

- **GET /villages**
  - **Query Parameters:** `?province=...&district=...&sector=...&cell=...` (optional)
  - Returns all villages or villages filtered by province, district, sector, and/or cell.
  - Examples:
    - `/villages` - Returns all villages
    - `/villages?province=Kigali&district=Gasabo&sector=Remera&cell=Nyabisindu` - Returns villages in Nyabisindu, Remera, Gasabo, Kigali

---

## Error Handling
- All endpoints return clear error messages and status codes for missing or invalid parameters.
- Any undefined route returns a 404 with `{ status: "error", message: "Route not found" }`.

---

## Example Usage (with fetch in JavaScript)

### Using GET endpoints with query parameters (Recommended)

```js
// Get all provinces
fetch('http://localhost:80/provinces')
  .then(res => res.json())
  .then(console.log);

// Get all districts
fetch('http://localhost:80/districts')
  .then(res => res.json())
  .then(console.log);

// Get districts in a specific province
fetch('http://localhost:80/districts?province=Kigali')
  .then(res => res.json())
  .then(console.log);

// Get all sectors
fetch('http://localhost:80/sectors')
  .then(res => res.json())
  .then(console.log);

// Get sectors in a specific province
fetch('http://localhost:80/sectors?province=Kigali')
  .then(res => res.json())
  .then(console.log);

// Get sectors in a specific district
fetch('http://localhost:80/sectors?province=Kigali&district=Gasabo')
  .then(res => res.json())
  .then(console.log);

// Get villages with multiple filters
fetch('http://localhost:80/villages?province=Kigali&district=Gasabo')
  .then(res => res.json())
  .then(console.log);
```

### Using POST endpoints (Legacy)

```js
// Get districts in a province
fetch('http://localhost:80/districts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ province: 'Kigali' })
})
  .then(res => res.json())
  .then(console.log);

// Get sectors in a district
fetch('http://localhost:80/sectors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ province: 'Kigali', district: 'Gasabo' })
})
  .then(res => res.json())
  .then(console.log);
```

---

## License
MIT
