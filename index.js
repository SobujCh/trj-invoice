const express = require('express');
const multer = require('multer'); // For handling multipart/form-data uploads
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3012;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post('/', upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
    }

    console.log('Received PDF file:', req.file.originalname);
    console.log('File size:', req.file.size, 'bytes');

    // req.file.buffer contains the PDF buffer if using memoryStorage
    // req.file.path contains the path if using diskStorage

    // Example: Save the received buffer to a file (optional)
    try {
        const uploadDir = path.join(__dirname, 'received_pdfs');
        await fs.mkdir(uploadDir, { recursive: true }); // Ensure directory exists
        const filePath = path.join(uploadDir, `${Date.now()}_${req.file.originalname}`);
        await fs.writeFile(filePath, req.file.buffer);
        console.log(`PDF saved to: ${filePath}`);
    } catch (error) {
        console.error('Error saving received PDF:', error);
        return res.status(500).json({ success: false, message: 'Failed to save received PDF.', error: error.message });
    }


    res.json({
        success: true,
        message: 'PDF received successfully by the target server!',
        fileName: req.file.originalname,
        fileSize: req.file.size
    });
});

app.listen(port, () => {
    console.log(`Target Server listening at http://localhost:${port}`);
});