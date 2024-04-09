const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT;
const storagePath = process.env.MOUNTED_PATH;

app.use(bodyParser.json());

// testing the pipeline for app2.

app.post('/calculateAmount', (req, res) => {
    const json_data = req.body;

    const file_name = json_data.file;
    const file_path = path.join(storagePath, file_name);
    const product = json_data.product;

    if (!file_path.toLowerCase().endsWith('.csv') && !file_path.toLowerCase().endsWith('.dat') && !file_path.toLowerCase().endsWith('.yml')) {
        return res.json({
            file: file_name,
            error: 'Input file not in CSV format.'
        });
    }

    const results = [];
    let hasProductColumn = false;
    let hasAmountColumn = false;

    fs.createReadStream(file_path)
        .pipe(csvParser())
        .on('data', (data) => {
            const trimmedData = {};
            Object.keys(data).forEach(key => {
                trimmedData[key.trim()] = data[key].trim();
            });

            results.push(trimmedData);
            if (!hasProductColumn && trimmedData.hasOwnProperty('product')) {
                hasProductColumn = true;
            }
            if (!hasAmountColumn && trimmedData.hasOwnProperty('amount')) {
                hasAmountColumn = true;
            }
        })
        .on('end', () => {
            if (!hasProductColumn || !hasAmountColumn) {
                return res.json({
                    file: file_name,
                    error: 'Input file not in CSV format.'
                });
            }
            const productRows = results.filter(row => row.product === product);
            const sum = productRows.reduce((acc, curr) => acc + parseInt(curr.amount), 0);

            res.json({
                file: file_name,
                sum: sum
            });
        })
        .on('error', (error) => {
            console.error(error);
            res.json({
                file: file_name,
                error: 'Input file not in CSV format.'
            });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
