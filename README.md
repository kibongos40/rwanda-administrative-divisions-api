# Rwanda Administrative Divisions API

A simple Express.js API for querying Rwanda's administrative divisions: Provinces, Districts, Sectors, Cells, and Villages. Powered by the [`rwanda-geo-structure`](https://www.npmjs.com/package/rwanda-geo-structure) package.

- **Live API:** [https://rda-ad-divisions.onrender.com/](https://rda-ad-divisions.onrender.com/)
- **GitHub Repo:** [kibongos40/rwanda-administrative-divisions-api](https://github.com/kibongos40/rwanda-administrative-divisions-api)

## Features
- Get all provinces
- Get districts by province
- Get sectors by district
- Get cells by sector
- Get villages by cell
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
  - **Body:** `{ "province": "Kigali City" }`
  - Returns districts in the given province.

### Sectors
- **POST /sectors**
  - **Body:** `{ "province": "Kigali City", "district": "Gasabo" }`
  - Returns sectors in the given district.

### Cells
- **POST /cells**
  - **Body:** `{ "province": "Kigali City", "district": "Gasabo", "sector": "Remera" }`
  - Returns cells in the given sector.

### Villages
- **POST /villages**
  - **Body:** `{ "province": "Kigali City", "district": "Gasabo", "sector": "Remera", "cell": "Nyabisindu" }`
  - Returns villages in the given cell.

---

## Error Handling
- All endpoints return clear error messages and status codes for missing or invalid parameters.
- Any undefined route returns a 404 with `{ status: "error", message: "Route not found" }`.

---

## Example Usage (with fetch in JavaScript)

```js
// Get all provinces
fetch('http://localhost:80/provinces')
  .then(res => res.json())
  .then(console.log);

// Get districts in a province
fetch('http://localhost:80/districts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ province: 'Kigali City' })
})
  .then(res => res.json())
  .then(console.log);

// Get sectors in a district
fetch('http://localhost:80/sectors', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ province: 'Kigali City', district: 'Gasabo' })
})
  .then(res => res.json())
  .then(console.log);
```

---

## License
MIT
