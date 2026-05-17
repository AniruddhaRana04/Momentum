# 📋 Momentum Todo Website

A modern Todo application called **Momentum** built with Flask and MongoDB. This website offers a polished responsive interface, dark mode, live location-based Kolkata time, toast notifications, and fast AJAX interactions.

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.3-green?style=flat-square&logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## ✨ Momentum Features

### Core Todo Features
- ✅ **Add Task** - Create new todos with validation and live feedback
- ✏️ **Edit Task** - Update task titles in a modal dialog
- 🗑️ **Delete Task** - Remove tasks cleanly
- ☑️ **Toggle Complete** - Mark tasks done or pending
- 🔍 **Search Tasks** - Search instantly by title
- 📊 **Filter Tasks** - Show All, Pending, or Completed tasks
- 💾 **MongoDB Storage** - Persistent data storage for todos

### UI/UX Highlights
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Layout** - Optimized for desktop, tablet, and mobile
- 🔔 **Toast Notifications** - Bottom-right flash messages for actions
- 🕒 **Live Kolkata Clock** - Header displays current IST time
- 📈 **Progress Dashboard** - Real-time totals and completion progress
- ⚡ **AJAX Experience** - Smooth UI updates without page reloads
- ✨ **Modern Styling** - Clean cards, soft shadows, and refined controls

### Quality Improvements
- ✅ **Input Validation** - Client and server validation for task titles
- 🎯 **Character Counter** - Shows title length in real time
- ⌨️ **Keyboard Shortcuts** - Search focus and modal close support
- ♿ **Accessible Controls** - Friendly buttons and visible state
- 📦 **JSON API** - AJAX-friendly backend endpoints

## 🧩 Project Structure

```
Momentum/
│
├── app.py                        # Flask backend application
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
│
├── static/
│   ├── css/
│   │   └── style.css             # Main responsive stylesheet
│   └── js/
│       └── script.js             # Frontend JavaScript logic
│
├── templates/
│   └── index.html                # Jinja2 main template
└── README.md                     # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- MongoDB Atlas connection
- pip package manager

### Install Steps

```bash
cd d:\Projects python websites\To_do normal
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Setup

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/todo_db?retryWrites=true&w=majority
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-key
```

### Run the Site

```bash
python app.py
```

Then open:

```bash
http://localhost:5000
```