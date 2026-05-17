/**
 * TODO APPLICATION - PROFESSIONAL JAVASCRIPT
 * Frontend Logic, AJAX, Theme Toggle, and Interactions
 */

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Initialize theme
    initializeTheme();
    
    // Event listeners
    setupEventListeners();
    
    // Initial data
    updateStats();
    
    // Live clock display
    startCurrentTime();
    
    console.log('✓ Todo App Initialized Successfully');
}

// ============================================================================
// LIVE CLOCK

function formatKolkataTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(date);
}

function updateCurrentTime() {
    const timestampElement = document.querySelector('.header-timestamp strong');
    if (!timestampElement) {
        return;
    }

    const now = new Date();
    timestampElement.textContent = formatKolkataTime(now);
}

function startCurrentTime() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        disableDarkMode();
        localStorage.setItem('theme', 'light');
    } else {
        enableDarkMode();
        localStorage.setItem('theme', 'dark');
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Add todo form (regular form submission)
    const addTodoForm = document.getElementById('addTodoForm');
    if (addTodoForm) {
        addTodoForm.addEventListener('submit', handleAddTodoSubmit);
    }
    
    // Character counter
    const todoInput = document.getElementById('todoInput');
    if (todoInput) {
        todoInput.addEventListener('input', updateCharCount);
    }
    
    // Edit form
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }
    
    // Edit modal character counter
    const editTodoTitle = document.getElementById('editTodoTitle');
    if (editTodoTitle) {
        editTodoTitle.addEventListener('input', updateEditCharCount);
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Close modal on background click
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
}

// ============================================================================
// ADD TODO HANDLING
// ============================================================================

function handleAddTodoSubmit(e) {
    e.preventDefault();
    
    const titleInput = document.getElementById('todoInput');
    const title = titleInput.value.trim();
    
    if (!title) {
        showFlashMessage('Please enter a task title', 'error');
        return;
    }
    
    if (title.length > 200) {
        showFlashMessage('Task title is too long (max 200 characters)', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Use AJAX to add todo
    fetch('/api/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            // Clear input
            titleInput.value = '';
            updateCharCount();
            
            // Refresh todos
            loadTodos();
            
            // Show success message
            showFlashMessage('✓ Task added successfully!', 'success');
        } else {
            showFlashMessage('Error: ' + data.error, 'error');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error adding todo:', error);
        showFlashMessage('Error adding task. Please try again.', 'error');
    });
}

// ============================================================================
// EDIT TODO HANDLING
// ============================================================================

function editTodo(todoId, title) {
    document.getElementById('editTodoId').value = todoId;
    document.getElementById('editTodoTitle').value = title;
    updateEditCharCount();
    
    const modal = document.getElementById('editModal');
    modal.classList.add('show');
    document.getElementById('editTodoTitle').focus();
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const todoId = document.getElementById('editTodoId').value;
    const title = document.getElementById('editTodoTitle').value.trim();
    
    if (!title) {
        showFlashMessage('Task title cannot be empty', 'error');
        return;
    }
    
    if (title.length > 200) {
        showFlashMessage('Task title is too long (max 200 characters)', 'error');
        return;
    }
    
    showLoading();
    
    fetch(`/api/edit/${todoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            closeModal();
            loadTodos();
            showFlashMessage('✓ Task updated successfully!', 'success');
        } else {
            showFlashMessage('Error: ' + data.error, 'error');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error updating todo:', error);
        showFlashMessage('Error updating task. Please try again.', 'error');
    });
}

// ============================================================================
// DELETE TODO HANDLING
// ============================================================================

function deleteTodo(todoId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    showLoading();
    
    fetch(`/api/delete/${todoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            loadTodos();
            showFlashMessage('✓ Task deleted successfully!', 'delete');
        } else {
            showFlashMessage('Error: ' + data.error, 'error');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error deleting todo:', error);
        showFlashMessage('Error deleting task. Please try again.', 'error');
    });
}

// ============================================================================
// TOGGLE TODO COMPLETION
// ============================================================================

function toggleTodo(todoId, checkbox) {
    showLoading();
    
    fetch(`/api/toggle/${todoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            loadTodos();
            const status = data.completed ? 'completed' : 'pending';
            showFlashMessage(`✓ Task marked as ${status}!`, 'success');
        } else {
            checkbox.checked = !checkbox.checked; // Revert checkbox
            showFlashMessage('Error: ' + data.error, 'error');
        }
    })
    .catch(error => {
        hideLoading();
        checkbox.checked = !checkbox.checked; // Revert checkbox
        console.error('Error toggling todo:', error);
        showFlashMessage('Error updating task. Please try again.', 'error');
    });
}

// ============================================================================
// FILTER HANDLING
// ============================================================================

function handleFilterClick(e) {
    const filterType = e.currentTarget.dataset.filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Clear search
    document.getElementById('searchInput').value = '';
    
    // Load filtered todos
    loadTodos(filterType);
}

// ============================================================================
// SEARCH HANDLING
// ============================================================================

function handleSearch(e) {
    const query = e.target.value.trim();
    
    if (!query) {
        // If search is empty, reload all todos
        loadTodos();
        return;
    }
    
    showLoading();
    
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            renderTodos(data.todos);
            updateStatsFromData(data.stats);
        } else {
            showFlashMessage('Error: ' + data.error, 'error');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error searching todos:', error);
        showFlashMessage('Error searching tasks. Please try again.', 'error');
    });
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadTodos();
}

// ============================================================================
// LOAD AND RENDER TODOS
// ============================================================================

function loadTodos(filter = 'all') {
    showLoading();
    
    const url = filter === 'all' ? '/api/todos' : `/api/todos?filter=${filter}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (data.success) {
            renderTodos(data.todos);
            updateStatsFromData(data.stats);
        } else {
            showFlashMessage('Error loading tasks', 'error');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error loading todos:', error);
        showFlashMessage('Error loading tasks. Please try again.', 'error');
    });
}

function renderTodos(todos) {
    const todosList = document.getElementById('todosList');
    const emptyState = document.getElementById('emptyState');
    const container = document.querySelector('.todos-container');
    
    if (!todos || todos.length === 0) {
        // Show empty state
        if (todosList) {
            todosList.remove();
        }
        
        if (!emptyState) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.id = 'emptyState';
            empty.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-inbox"></i>
                </div>
                <h2>No tasks yet</h2>
                <p>Create your first task to get started!</p>
            `;
            container.appendChild(empty);
        }
        return;
    }
    
    // Remove empty state if exists
    if (emptyState) {
        emptyState.remove();
    }
    
    // Create or update todos list
    let list = todosList;
    if (!list) {
        list = document.createElement('div');
        list.className = 'todos-list';
        list.id = 'todosList';
        container.appendChild(list);
    }
    
    // Clear existing items
    list.innerHTML = '';
    
    // Render todos
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        list.appendChild(todoElement);
    });
}

function createTodoElement(todo) {
    const item = document.createElement('div');
    item.className = 'todo-item';
    if (todo.completed) {
        item.classList.add('completed');
    }
    item.dataset.id = todo.id;
    item.dataset.completed = todo.completed;
    
    const timeText = todo.created_at || formatDate(todo.created_at_iso || todo.created_at);

    item.innerHTML = `
        <div class="todo-checkbox">
            <input 
                type="checkbox" 
                class="checkbox-input" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo('${todo.id}', this)"
            >
            <span class="checkbox-custom"></span>
        </div>
        <div class="todo-content">
            <p class="todo-title ${todo.completed ? 'completed' : ''}">${escapeHtml(todo.title)}</p>
            <small class="todo-time">
                <i class="fas fa-clock"></i>
                ${escapeHtml(timeText)}
            </small>
        </div>
        <div class="todo-actions">
            <button class="btn-icon btn-edit" onclick="editTodo('${todo.id}', '${escapeHtml(todo.title).replace(/'/g, "\\'")}');" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="deleteTodo('${todo.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return item;
}

// ============================================================================
// STATS UPDATE
// ============================================================================

function updateStats() {
    fetch('/api/todos')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateStatsFromData(data.stats);
        }
    })
    .catch(error => console.error('Error updating stats:', error));
}

function updateStatsFromData(stats) {
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statCompleted').textContent = stats.completed;
    document.getElementById('statPending').textContent = stats.pending;
    
    // Update progress bar
    const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    if (progressText) {
        progressText.textContent = percentage + '%';
    }
}

// ============================================================================
// MODAL HANDLING
// ============================================================================

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
}

// ============================================================================
// CHARACTER COUNTER
// ============================================================================

function updateCharCount() {
    const input = document.getElementById('todoInput');
    const counter = document.querySelector('.char-count');
    if (input && counter) {
        counter.textContent = input.value.length + '/200';
    }
}

function updateEditCharCount() {
    const input = document.getElementById('editTodoTitle');
    const counter = document.querySelector('.char-count-edit');
    if (input && counter) {
        counter.textContent = input.value.length + '/200';
    }
}

// ============================================================================
// FLASH MESSAGES
// ============================================================================

function showFlashMessage(message, category = 'success') {
    const alertsContainer = document.getElementById('flashToastContainer') || document.querySelector('.content-section');
    
    if (!alertsContainer) {
        console.warn('Alerts container not found');
        return;
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${category}`;
    alert.setAttribute('role', 'alert');
    
    let icon = 'exclamation-circle';
    if (category === 'success') {
        icon = 'check-circle';
    } else if (category === 'delete') {
        icon = 'trash-alt';
    } else if (category === 'info') {
        icon = 'info-circle';
    } else if (category === 'warning') {
        icon = 'exclamation-triangle';
    }
    
    alert.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove();">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Insert after header
    const header = alertsContainer.querySelector('.header');
    if (header) {
        header.insertAdjacentElement('afterend', alert);
    } else {
        alertsContainer.insertBefore(alert, alertsContainer.firstChild);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// ============================================================================
// LOADING INDICATOR
// ============================================================================

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function to delay execution
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Escape HTML characters to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('editModal');
        if (modal && modal.classList.contains('show')) {
            closeModal();
        }
    }
    
    // Enter to add todo (if input is focused)
    if (e.key === 'Enter' && e.target.id === 'todoInput') {
        if (!e.shiftKey) {
            e.preventDefault();
            document.getElementById('addTodoForm').dispatchEvent(new Event('submit'));
        }
    }
});

// ============================================================================
// PAGE VISIBILITY - REFRESH ON RETURN
// ============================================================================

document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        console.log('Page is visible, refreshing todos...');
        loadTodos();
        updateStats();
    }
});

console.log('✓ Todo App JavaScript Loaded Successfully');
