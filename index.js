import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

async function uploadFile() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: true,  // This enables FTPS,
            secureOptions: {
                rejectUnauthorized: false,
                checkServerIdentity: () => undefined
            }
        });

        const localFilePath = path.join(__dirname, 'demo.txt');
        const remoteFilePath = '/files/demo-gsk.txt';

        await client.uploadFrom(localFilePath, remoteFilePath);
        console.log('File uploaded successfully!');
    } catch (err) {
        console.error(err);
    }
    client.close();
}

uploadFile();
