const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT;
const CONTAINER2_SERVICE = process.env.CONTAINER2_SERVICE;
const storagePath = process.env.MOUNTED_PATH;

app.use(bodyParser.json());

// testing the pipeline for app1.

app.post('/store-file', (req, res) => {
    const json_data = req.body;
    if (!json_data.file || !json_data.data) {
        return res.json({
            file: null,
            error: 'Invalid JSON input.'
        });
    }

    const file_name = json_data.file;
    const file_data = json_data.data;

    if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath);
    }

    fs.writeFile(path.join(storagePath, file_name), file_data, (err) => {
        if (err) {
            console.error('Error:', err);
            return res.json({
                file: file_name,
                error: 'Internal Server Error'
            });
        }
        res.json({
            file: file_name,
            message: 'Success.'
        });
    });
});

app.post('/calculate', (req, res) => {
    const json_data = req.body;
    if (!json_data.file || !json_data.product) {
        return res.json({
            file: null,
            error: 'Invalid JSON input.'
        });
    }

    const file_name = json_data.file;
    const file_path = path.join(storagePath, file_name);

    if (!fs.existsSync(file_path)) {
        return res.json({
            file: file_name,
            error: 'File not found.'
        });
    }

    const url = `http://${CONTAINER2_SERVICE}/calculateAmount`;
    axios.post(url, json_data)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({
                error: 'Internal Server Error'
            });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});