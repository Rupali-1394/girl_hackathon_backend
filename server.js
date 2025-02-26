const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const taxRoutes = require('./routes/taxRoutes');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Updated CORS configuration
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/tax', taxRoutes);
app.use('/api/ai', aiRoutes);

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: err.message || 'Something went wrong!',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 