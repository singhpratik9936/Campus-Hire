const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (Updated Standards)
app.use(cors());
app.use(express.json()); // Built-in body parser
app.use(express.urlencoded({ extended: true }));

// Sample Base Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server running successfully!"
    });
});

// Update API Route Example
app.put('/api/update', (req, res) => {
    const data = req.body;
    
    // Yahan aapka update logic aayega
    res.status(200).json({
        success: true,
        message: "Data updated successfully",
        updatedData: data
    });
});

// Server Listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
