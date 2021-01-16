// app.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connection = require('./connection');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello World!' })
})

app.post('/bookmarks', (req, res) => {
    const { url, title } = req.body;
    if (!url || !title) {
        return res.status(422).json({
            error: 'required field(s) missing'
        });
    }
    const sql = 'INSERT INTO bookmark SET ?';
    connection.query(sql, req.body, (err, results) => {
        if (err) {
            res.status(500).json({
                error: err.message,
                sql: err.sql,
            });
        }
        const sql2 = 'SELECT * FROM bookmark WHERE id = ?';
        connection.query(sql2, results.insertId, (err2, records) => {
            if (err2) {
                res.status(500).json({
                    error: err2.message,
                    sql: err2.sql
                });
            }
            return res.status(201).json(records[0]);
        });
    });
})

module.exports = app;
