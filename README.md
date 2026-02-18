# Attendance Management System (AMS)

A modern web application for managing student attendance with a clean, responsive dashboard.

## Features

- 📊 Dashboard with attendance statistics and insights
- 👥 Student and faculty management
- 📋 Attendance tracking and reports
- 🔐 Role-based login (Admin/User)
- 📱 Fully responsive design

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS templates, CSS3
- **Icons:** Google Material Symbols

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AMS.git
   cd AMS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start with nodemon for development

## Project Structure

```
AMS/
├── server.js           # Express server
├── package.json        # Dependencies
├── views/
│   ├── partials/       # Reusable EJS components
│   │   ├── header.ejs
│   │   └── sidebar.ejs
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── faculty.ejs
│   └── index.ejs
└── public/
    ├── css/
    │   ├── Login.css
    │   ├── Styles.css
    │   └── Dashboard.css
    └── images/
```

## License

MIT
