const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Smooth Area Line Chart' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login Page' });
});

app.post('/login', (req, res) => {
    const { role, username, password } = req.body;
    // TODO: Add authentication logic here
    console.log(`Login attempt: ${username} as ${role}`);
    res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { 
        title: 'Dashboard',
        stats: {
            totalStudents: '1,200',
            presentToday: '95%',
            pendingReports: '5',
            notifications: '3 New'
        }
    });
});

app.get('/faculty', (req, res) => {
    res.render('faculty', { title: 'Faculty' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
