const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); // Using mysql2 for better support

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myDatabase'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Serve static files from the public directory
app.use(express.static('public'));

// Handle signup form submission
app.post('/Register', (req, res) => {
    const { username, email, password, phone } = req.body;
    const sql = 'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)';
    const values = [username, email, password, phone];

    db.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log('User added: ', result);
        res.redirect('http://127.0.0.1:5500/login.html'); // Redirect to login page after successful signup
    });
});

// Corrected route for handling login
app.post('/dashboard', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            // User found, check password
            const user = result[0];
            if (password === user.password) {
                // Redirect to the index.html page after successful login
                res.redirect('/index.html');
            } else {
                // Redirect to the login page with an error message if the login fails
                res.redirect('/login.html?error=Invalid%20credentials');
            }
        } else {
            // Redirect to the login page with an error message if the user is not found
            res.redirect('/login.html?error=User%20not%20found');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Placeholder function for user authentication
function authenticateUser(email, password) {
    // Implement your authentication logic here
    // This could involve checking the provided email and password against the database
    return true; // Placeholder return value
}
