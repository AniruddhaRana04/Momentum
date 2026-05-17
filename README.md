# 📋 Professional Todo Application

A modern, full-stack Todo Application built with Flask (Python) and MongoDB. Features a beautiful, responsive UI with dark mode support, real-time updates, and professional animations.

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.3-green?style=flat-square&logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## ✨ Features

### Core Functionality
- ✅ **Add Todos** - Create new tasks with title validation
- ✏️ **Edit Todos** - Modify existing tasks easily
- 🗑️ **Delete Todos** - Remove completed or unwanted tasks
- ☑️ **Toggle Completion** - Mark tasks as complete/incomplete
- 🔍 **Search Todos** - Find tasks by title
- 📊 **Filter Todos** - View All, Completed, or Pending tasks
- 💾 **Persistent Storage** - All data stored in MongoDB

### UI/UX Features
- 🌙 **Dark Mode Toggle** - Theme preference saved in localStorage
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Glassmorphism Design** - Modern, premium UI with backdrop blur effects
- ✨ **Smooth Animations** - Delightful transitions and interactions
- 📈 **Progress Tracking** - Visual progress bar and statistics
- ⚡ **AJAX Integration** - Smooth, fast interactions without page reloads
- 🔔 **Flash Messages** - User feedback for all actions
- 📊 **Statistics Dashboard** - Total, Completed, and Pending tasks count

### Advanced Features
- 🕐 **Task Timestamps** - Created and updated dates
- 📅 **Date Formatting** - Human-readable date display
- 🎯 **Character Counter** - Real-time character count for task titles
- ♿ **Accessibility** - WCAG compliant with keyboard shortcuts
- 🔒 **Input Validation** - Server and client-side validation
- ⌨️ **Keyboard Shortcuts** - Ctrl+K for search, Escape to close modal

## 📋 Project Structure

```
todo-app/
│
├── app.py                          # Flask backend application
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables (sample)
├── .gitignore                     # Git ignore file
│
├── static/
│   ├── css/
│   │   └── style.css             # Main stylesheet (professional CSS)
│   └── js/
│       └── script.js             # Frontend JavaScript logic
│
├── templates/
│   └── index.html                # Jinja2 HTML template
│
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- MongoDB (local or MongoDB Atlas)
- pip (Python package manager)

### 1. Clone or Download the Project

```bash
cd path/to/todo-app
```

### 2. Create Virtual Environment

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB server:
   - **Windows**: `mongod` (in MongoDB installation bin folder)
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection URI: `mongodb+srv://username:password@cluster.mongodb.net/todo_db?retryWrites=true&w=majority`

### 5. Configure Environment Variables

Create `.env` file in project root:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/todo_db

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-change-this-in-production
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/todo_db?retryWrites=true&w=majority
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secure-random-key-here
```

### 6. Run the Application

```bash
python app.py
```

Output:
```
============================================================
Todo Application - Flask Backend
============================================================
Environment: development
MongoDB URI: mongodb://localhost:27017/todo_db
============================================================
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

### 7. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 🎯 Usage Guide

### Adding a Todo
1. Enter task title in the input field
2. Click "Add Task" button or press Enter
3. Task appears in the list instantly

### Editing a Todo
1. Click the edit icon (✏️) on any task
2. Modal appears with the task title
3. Modify the title
4. Click "Save Changes"

### Completing a Todo
1. Click the checkbox next to a task
2. Task is marked as completed (struck through)
3. Progress bar updates automatically

### Deleting a Todo
1. Click the delete icon (🗑️) on any task
2. Confirm deletion in the popup
3. Task is removed permanently

### Searching Todos
1. Use the search box with magnifying glass icon
2. Type to filter tasks by title (real-time)
3. Results update as you type
4. Click X button or clear search to reset

### Filtering Todos
Click filter buttons:
- **All** - Show all tasks
- **Pending** - Show incomplete tasks
- **Completed** - Show completed tasks

### Dark Mode
Click the moon/sun icon in the top-right corner to toggle dark mode. Your preference is saved automatically.

## 🏗️ API Endpoints

### HTML Routes (Form-based)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Main page with all todos |
| POST | `/add` | Add new todo (form submission) |
| POST | `/edit/<id>` | Edit existing todo (form submission) |
| GET | `/delete/<id>` | Delete todo |
| GET | `/toggle/<id>` | Toggle todo completion |

### API Routes (JSON/AJAX)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/todos` | Get all todos (with filter query param) |
| POST | `/api/add` | Add new todo (JSON) |
| PUT | `/api/edit/<id>` | Edit todo (JSON) |
| DELETE | `/api/delete/<id>` | Delete todo (JSON) |
| PUT | `/api/toggle/<id>` | Toggle todo completion (JSON) |
| GET | `/api/search?q=query` | Search todos |

### Query Parameters
- **Filter**: `/api/todos?filter=all|pending|completed`
- **Search**: `/api/search?q=task+title`

## 📊 MongoDB Database Schema

### Collection: `todos`

```json
{
  "_id": ObjectId,
  "title": "String (max 200 chars)",
  "completed": Boolean,
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### Example Document
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Complete project documentation",
  "completed": false,
  "created_at": "2024-05-17T10:30:00.000Z",
  "updated_at": "2024-05-17T10:30:00.000Z"
}
```

## 🛠️ Technology Stack

### Backend
- **Flask 2.3.3** - Web framework
- **Flask-PyMongo 2.3.0** - MongoDB integration
- **PyMongo 4.5.0** - MongoDB driver
- **python-dotenv 1.0.0** - Environment variables
- **Werkzeug 2.3.7** - WSGI utilities

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Advanced styling with CSS Grid/Flexbox
- **JavaScript (ES6+)** - Modern frontend logic
- **Jinja2** - Template engine

### Database
- **MongoDB** - NoSQL database

### Design Patterns
- **Glassmorphism** - Modern UI design
- **Dark Mode Support** - Theme switching
- **AJAX** - Asynchronous requests
- **RESTful API** - Clean API design

## 🎨 Customization

### Colors
Edit CSS variables in `static/css/style.css`:

```css
:root {
    --primary: #6366f1;
    --secondary: #ec4899;
    --success: #10b981;
    --danger: #ef4444;
}
```

### Dark Mode
Colors automatically adjust. Customize dark mode colors in the same file.

### Animations
Modify animation durations in CSS:

```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Typography
Change fonts in body CSS rule:

```css
font-family: 'Your Font', sans-serif;
```

## 🔒 Security Features

- ✅ Environment variable protection (sensitive data in .env)
- ✅ Input validation (server and client-side)
- ✅ XSS prevention (HTML escaping)
- ✅ CSRF protection ready (add CSRF token in production)
- ✅ ObjectId validation for MongoDB queries
- ✅ SQL Injection prevention (using PyMongo)

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search box |
| `Escape` | Close modal |
| `Enter` | Add todo (when focused on input) |
| `Enter` | Save todo (when in edit modal) |

## 🐛 Troubleshooting

### MongoDB Connection Error
```
pymongo.errors.ServerSelectionTimeoutError
```
**Solution**: Ensure MongoDB is running and URI is correct in `.env`

### Port 5000 Already in Use
```bash
# Change port in app.py
app.run(port=5001)
```

### Virtual Environment Issues
```bash
# Deactivate and reactivate
deactivate
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### Dependencies Not Installed
```bash
pip install -r requirements.txt --upgrade
```

## 📦 Deployment

### Production Checklist
- [ ] Set `FLASK_ENV=production`
- [ ] Set `FLASK_DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Configure CORS if needed
- [ ] Use production WSGI server (Gunicorn, Waitress)

### Deploy to Heroku

```bash
# Install Heroku CLI
# heroku create todo-app
# heroku config:set MONGO_URI=your_mongodb_uri
# git push heroku main
```

### Deploy to AWS, Google Cloud, etc.
1. Install and configure cloud CLI
2. Set environment variables
3. Deploy using respective platform's deployment method

## 📈 Performance Tips

- Use MongoDB Atlas for production (distributed, scalable)
- Implement pagination for large todo lists
- Add caching headers for static assets
- Use CDN for CSS/JS files
- Optimize images
- Enable gzip compression

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created as a professional full-stack todo application example.

## 📞 Support

For issues, questions, or suggestions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include steps to reproduce for bugs

## 🙏 Acknowledgments

- Flask documentation: https://flask.palletsprojects.com/
- MongoDB documentation: https://docs.mongodb.com/
- Font Awesome icons: https://fontawesome.com/

## 📚 Additional Resources

- [Flask Tutorial](https://flask.palletsprojects.com/tutorial/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Python Conventions](https://pep8.org/)
- [RESTful API Best Practices](https://restfulapi.net/)
- [Web Accessibility](https://www.w3.org/WAI/)

---

**Version**: 1.0.0  
**Last Updated**: May 2024  
**Status**: Production Ready ✅

Enjoy your professional Todo Application! 🚀
