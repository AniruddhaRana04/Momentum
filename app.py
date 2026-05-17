"""
Professional Todo Application - Flask Backend with MongoDB
Author: Full-Stack Developer
Description: RESTful API for Todo management with MongoDB persistence
"""

from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv

try:
    from zoneinfo import ZoneInfo
    IST_ZONE = ZoneInfo('Asia/Kolkata')
except Exception:
    IST_ZONE = None

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/todo_db')
# Ensure a database name is available when MONGO_URI does not include one
app.config['MONGO_DBNAME'] = os.getenv('MONGO_DBNAME', 'todo_db')

# Initialize PyMongo
mongo = PyMongo(app)

# If PyMongo couldn't infer the database from the URI (e.g. URI ends with '/'),
# fall back to using the explicit `MONGO_DBNAME` value.
try:
    if getattr(mongo, 'db', None) is None:
        from pymongo import MongoClient
        client = MongoClient(app.config['MONGO_URI'])
        mongo.db = client[app.config.get('MONGO_DBNAME', 'todo_db')]
        print(f"[INFO] Using fallback DB name: {app.config.get('MONGO_DBNAME')}")
    else:
        print(f"[INFO] Connected to MongoDB database: {getattr(mongo.db, 'name', 'unknown')}")
except Exception as e:
    print(f"[WARN] Could not verify MongoDB db object: {e}")

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_db_stats():
    """Get statistics about todos"""
    try:
        todos = list(mongo.db.todos.find())
        total = len(todos)
        completed = sum(1 for todo in todos if todo.get('completed', False))
        pending = total - completed
        return {
            'total': total,
            'completed': completed,
            'pending': pending
        }
    except Exception as e:
        print(f"Error getting stats: {e}")
        return {'total': 0, 'completed': 0, 'pending': 0}

def to_kolkata_time(dt):
    if dt is None:
        dt = datetime.utcnow()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    if IST_ZONE:
        return dt.astimezone(IST_ZONE)
    return dt.astimezone(timezone(timedelta(hours=5, minutes=30)))


def format_todo(todo):
    """Format todo document for frontend"""
    created_at = todo.get('created_at', datetime.utcnow())
    updated_at = todo.get('updated_at', created_at)
    created_at = to_kolkata_time(created_at)
    updated_at = to_kolkata_time(updated_at)
    created_at_display = created_at.strftime('%b %d, %Y %I:%M %p IST')
    updated_at_display = updated_at.strftime('%b %d, %Y %I:%M %p IST')
    return {
        'id': str(todo['_id']),
        'title': todo.get('title', ''),
        'completed': todo.get('completed', False),
        'created_at': created_at_display,
        'updated_at': updated_at_display,
        'created_at_iso': created_at.isoformat(),
        'updated_at_iso': updated_at.isoformat()
    }

# ============================================================================
# ROUTES - HOME PAGE
# ============================================================================

@app.route('/')
def index():
    """Main page - Display all todos"""
    try:
        todos = list(mongo.db.todos.find().sort('created_at', -1))
        stats = get_db_stats()
        todos = [format_todo(todo) for todo in todos]
        current_time = to_kolkata_time(datetime.utcnow()).strftime('%b %d, %Y %I:%M:%S %p IST')
        return render_template('index.html', todos=todos, stats=stats, current_time=current_time)
    except Exception as e:
        print(f"Error loading todos: {e}")
        flash('Error loading todos. Please try again.', 'error')
        current_time = to_kolkata_time(datetime.utcnow()).strftime('%b %d, %Y %I:%M:%S %p IST')
        return render_template('index.html', todos=[], stats={'total': 0, 'completed': 0, 'pending': 0}, current_time=current_time)

# ============================================================================
# ROUTES - API ENDPOINTS
# ============================================================================

@app.route('/api/todos', methods=['GET'])
def get_todos_api():
    """Get all todos via API (JSON)"""
    try:
        filter_type = request.args.get('filter', 'all')
        
        if filter_type == 'completed':
            todos = list(mongo.db.todos.find({'completed': True}).sort('created_at', -1))
        elif filter_type == 'pending':
            todos = list(mongo.db.todos.find({'completed': False}).sort('created_at', -1))
        else:
            todos = list(mongo.db.todos.find().sort('created_at', -1))
        
        todos = [format_todo(todo) for todo in todos]
        stats = get_db_stats()
        
        return jsonify({
            'success': True,
            'todos': todos,
            'stats': stats
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/add', methods=['POST'])
def add_todo():
    """Add a new todo"""
    try:
        title = request.form.get('title', '').strip()
        
        # Validate input
        if not title:
            flash('Todo title cannot be empty!', 'error')
            return redirect(url_for('index'))
        
        if len(title) > 200:
            flash('Todo title is too long! (Max 200 characters)', 'error')
            return redirect(url_for('index'))
        
        # Create todo document
        todo_doc = {
            'title': title,
            'completed': False,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Insert into MongoDB
        result = mongo.db.todos.insert_one(todo_doc)
        
        flash('✓ Todo added successfully!', 'success')
        print(f"[SUCCESS] Todo added with ID: {result.inserted_id}")
        
        return redirect(url_for('index'))
    
    except Exception as e:
        print(f"[ERROR] Add todo failed: {e}")
        flash(f'Error adding todo: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/api/add', methods=['POST'])
def add_todo_api():
    """Add a new todo via API (AJAX)"""
    try:
        data = request.get_json()
        title = data.get('title', '').strip()
        
        # Validate input
        if not title:
            return jsonify({'success': False, 'error': 'Title cannot be empty'}), 400
        
        if len(title) > 200:
            return jsonify({'success': False, 'error': 'Title too long (max 200 characters)'}), 400
        
        # Create todo document
        todo_doc = {
            'title': title,
            'completed': False,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Insert into MongoDB
        result = mongo.db.todos.insert_one(todo_doc)
        
        return jsonify({
            'success': True,
            'todo': format_todo({**todo_doc, '_id': result.inserted_id}),
            'message': 'Todo added successfully!'
        }), 201
    
    except Exception as e:
        print(f"[ERROR] API add todo failed: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/edit/<todo_id>', methods=['POST'])
def edit_todo(todo_id):
    """Edit an existing todo"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(todo_id):
            flash('Invalid todo ID!', 'error')
            return redirect(url_for('index'))
        
        title = request.form.get('title', '').strip()
        
        # Validate input
        if not title:
            flash('Todo title cannot be empty!', 'error')
            return redirect(url_for('index'))
        
        if len(title) > 200:
            flash('Todo title is too long! (Max 200 characters)', 'error')
            return redirect(url_for('index'))
        
        # Update in MongoDB
        result = mongo.db.todos.update_one(
            {'_id': ObjectId(todo_id)},
            {'$set': {
                'title': title,
                'updated_at': datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            flash('Todo not found!', 'error')
        else:
            flash('✓ Todo updated successfully!', 'success')
            print(f"[SUCCESS] Todo {todo_id} updated")
        
        return redirect(url_for('index'))
    
    except Exception as e:
        print(f"[ERROR] Edit todo failed: {e}")
        flash(f'Error editing todo: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/api/edit/<todo_id>', methods=['PUT'])
def edit_todo_api(todo_id):
    """Edit an existing todo via API (AJAX)"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(todo_id):
            return jsonify({'success': False, 'error': 'Invalid todo ID'}), 400
        
        data = request.get_json()
        title = data.get('title', '').strip()
        
        # Validate input
        if not title:
            return jsonify({'success': False, 'error': 'Title cannot be empty'}), 400
        
        if len(title) > 200:
            return jsonify({'success': False, 'error': 'Title too long (max 200 characters)'}), 400
        
        # Update in MongoDB
        result = mongo.db.todos.update_one(
            {'_id': ObjectId(todo_id)},
            {'$set': {
                'title': title,
                'updated_at': datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({'success': False, 'error': 'Todo not found'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Todo updated successfully!'
        }), 200
    
    except Exception as e:
        print(f"[ERROR] API edit todo failed: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/delete/<todo_id>', methods=['GET'])
def delete_todo(todo_id):
    """Delete a todo"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(todo_id):
            flash('Invalid todo ID!', 'error')
            return redirect(url_for('index'))
        
        # Delete from MongoDB
        result = mongo.db.todos.delete_one({'_id': ObjectId(todo_id)})
        
        if result.deleted_count == 0:
            flash('Todo not found!', 'error')
        else:
            flash('✓ Todo deleted successfully!', 'delete')
            print(f"[SUCCESS] Todo {todo_id} deleted")
        
        return redirect(url_for('index'))
    
    except Exception as e:
        print(f"[ERROR] Delete todo failed: {e}")
        flash(f'Error deleting todo: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/api/delete/<todo_id>', methods=['DELETE'])
def delete_todo_api(todo_id):
    """Delete a todo via API (AJAX)"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(todo_id):
            return jsonify({'success': False, 'error': 'Invalid todo ID'}), 400
        
        # Delete from MongoDB
        result = mongo.db.todos.delete_one({'_id': ObjectId(todo_id)})
        
        if result.deleted_count == 0:
            return jsonify({'success': False, 'error': 'Todo not found'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Todo deleted successfully!'
        }), 200
    
    except Exception as e:
        print(f"[ERROR] API delete todo failed: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/toggle/<todo_id>', methods=['GET'])
def toggle_todo(todo_id):
    """Toggle todo completion status"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(todo_id):
            flash('Invalid todo ID!', 'error')
            return redirect(url_for('index'))
        
        # Get current todo
        todo = mongo.db.todos.find_one({'_id': ObjectId(todo_id)})
        
        if not todo:
            flash('Todo not found!', 'error')
            return redirect(url_for('index'))
        
        # Toggle completion status
        new_status = not todo.get('completed', False)
        
        # Update in MongoDB
        mongo.db.todos.update_one(
            {'_id': ObjectId(todo_id)},
            {'$set': {
                'completed': new_status,
                'updated_at': datetime.utcnow()
            }}
        )
        
        status_text = 'completed' if new_status else 'pending'
        flash(f'✓ Todo marked as {status_text}!', 'success')
        print(f"[SUCCESS] Todo {todo_id} toggled to {status_text}")
        
        return redirect(url_for('index'))
    
    except Exception as e:
        print(f"[ERROR] Toggle todo failed: {e}")
        flash(f'Error toggling todo: {str(e)}', 'error')
        return redirect(url_for('index'))

@app.route('/api/toggle/<todo_id>', methods=['PUT'])
def toggle_todo_api(todo_id):
    """Toggle todo completion status via API (AJAX)"""
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(todo_id):
            return jsonify({'success': False, 'error': 'Invalid todo ID'}), 400
        
        # Get current todo
        todo = mongo.db.todos.find_one({'_id': ObjectId(todo_id)})
        
        if not todo:
            return jsonify({'success': False, 'error': 'Todo not found'}), 404
        
        # Toggle completion status
        new_status = not todo.get('completed', False)
        
        # Update in MongoDB
        mongo.db.todos.update_one(
            {'_id': ObjectId(todo_id)},
            {'$set': {
                'completed': new_status,
                'updated_at': datetime.utcnow()
            }}
        )
        
        return jsonify({
            'success': True,
            'completed': new_status,
            'message': f'Todo marked as {"completed" if new_status else "pending"}!'
        }), 200
    
    except Exception as e:
        print(f"[ERROR] API toggle todo failed: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_todos():
    """Search todos by title"""
    try:
        query = request.args.get('q', '').strip()
        
        if not query:
            todos = list(mongo.db.todos.find().sort('created_at', -1))
        else:
            # MongoDB text search
            todos = list(mongo.db.todos.find(
                {'title': {'$regex': query, '$options': 'i'}}
            ).sort('created_at', -1))
        
        todos = [format_todo(todo) for todo in todos]
        stats = get_db_stats()
        
        return jsonify({
            'success': True,
            'todos': todos,
            'stats': stats,
            'query': query
        })
    
    except Exception as e:
        print(f"[ERROR] Search failed: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors"""
    flash('Page not found!', 'error')
    return redirect(url_for('index'))

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    print(f"[ERROR] Internal server error: {error}")
    flash('An internal error occurred. Please try again.', 'error')
    return redirect(url_for('index'))

# ============================================================================
# APPLICATION ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print("Todo Application - Flask Backend")
    print("=" * 60)
    print(f"Environment: {os.getenv('FLASK_ENV', 'production')}")
    print(f"MongoDB URI: {os.getenv('MONGO_URI', 'Not configured')}")
    print("=" * 60)
    
    # Run Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=os.getenv('FLASK_DEBUG', False)
    )
