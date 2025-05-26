import app from "./api.js";

app.get("/", function (req, res) {
    try {
        res.json({
            message: "Welcome to Rwanda Administrative divisions API",
            status: "success",
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Internal server error", error: error.message });
    }
});

// Catch-all for undefined routes
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "Route not found", error: null });
});

// Global error handler for any uncaught errors
app.use((err, req, res, next) => {
    res.status(500).json({ status: "error", message: "Internal server error", error: err.message });
});

// Start the server
const PORT = process.env.PORT || 80;
app.listen(PORT, function () {
    try {
        console.log(`Server listening on port ${PORT}`);
    } catch (error) {
        console.error("Error starting server:", error.message);
    }
});
