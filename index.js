import express from 'express';
import * as ftp from 'basic-ftp';
import * as path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000; // Choose your port

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint for file upload
app.post('/upload', async (req, res) => {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: true,
            secureOptions: {
                rejectUnauthorized: false,
                checkServerIdentity: () => undefined
            }
        });

        // Assuming file path is passed in the request body
        const { filePath } = req.body;

        const localFilePath = path.join(__dirname, filePath);
        const remoteFilePath = `/files/${path.basename(localFilePath)}`;

        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log('File uploaded successfully!');
        res.status(200).send('File uploaded successfully!');
    } catch (err) {
        console.error('FTP Error:', err);
        res.status(500).send('Failed to upload file');
    } finally {
        client.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
