const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Configuration
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'blitsmanagement',
};

// Function to handle database operations
async function executeQuery(sql, values = []) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [results] = await connection.execute(sql, values);
        return results;
    } finally {
        await connection.end();
    }
}

app.post('/enroll', async (req, res) => {
    const formData = req.body;
    console.log('Received enrollment data:', formData);

    try {
        const sql =
            'INSERT INTO enrollment (name, email, phone, courseType) VALUES (?, ?, ?, ?)';
        const values = [
            formData.name,
            formData.email,
            formData.phone,
            formData.courseType,
        ];

        await executeQuery(sql, values);

        res.json({ message: 'Enrollment successful!', data: formData });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Enrollment failed. Please try again.' });
    }
});

app.post('/apply_school', async (req, res) => {
    const schoolData = req.body;
    console.log('Received school application data:', schoolData);

    try {
        const sql = 'INSERT INTO applyschool (schoolName, courseApplied) VALUES (?, ?)';
        //Correct the variable names to match the database column names.
        const values = [
            schoolData.schoolapplied, // Use schoolapplied from the received data
            schoolData.courseapplied,
        ];

        await executeQuery(sql, values);

        res.json({ message: 'School application successful!', data: schoolData });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'School application failed. Please try again.' });
    }
});

//New endpoint for contact form submission
app.post('/contact', async (req, res) => {
    const contactData = req.body;
    console.log('Received contact form data:', contactData);

    try {
        const sql = 'INSERT INTO contact_messages (contactName, contactEmail, message) VALUES (?, ?, ?)';
        const values = [
            contactData.contactName,
            contactData.contactEmail,
            contactData.message,
        ];

        await executeQuery(sql, values);

        res.json({ message: 'Contact message sent successfully!', data: contactData });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Failed to send contact message. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});