import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';

// API Configuration - Your Spring Boot backend URL
const API_BASE_URL = 'http://localhost:8080/student';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Main App Component
function StudentManagementApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [studentForm, setStudentForm] = useState({ name: '', email: '', branch: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      fetchStudentsFromSpringBoot();
    }
  }, []);

  // ==================== LOGIN - admin/admin ====================
  const handleLogin = async () => {
    setError('');
    setLoading(true);

    // Hardcoded validation: admin/admin
    if (loginForm.username === 'admin' && loginForm.password === 'admin') {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setLoginForm({ username: '', password: '' });
      setSuccess('✅ Login successful!');
      setTimeout(() => setSuccess(''), 2000);
      
      // Fetch students after successful login
      fetchStudentsFromSpringBoot();
    } else {
      setError('❌ Invalid credentials! Use username: admin, password: admin');
    }
    
    setLoading(false);
  };

  // ==================== READ - GET /student ====================
  const fetchStudentsFromSpringBoot = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching students from Spring Boot...');
      const response = await api.get('');
      
      console.log('Students fetched:', response.data);
      setStudents(response.data);
      
    } catch (err) {
      console.error('Fetch Error:', err);
      
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError('⚠️ Cannot connect to Spring Boot API at ' + API_BASE_URL);
      } else {
        setError('Failed to fetch students: ' + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== CREATE - POST /student ====================
  const createStudent = async () => {
    // Validation
    if (!studentForm.name || !studentForm.email || !studentForm.branch) {
      setError('❌ Please fill in all fields (Name, Email, Branch)');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Creating student:', studentForm);
      
      // POST request to Spring Boot
      const response = await api.post('', {
        name: studentForm.name,
        email: studentForm.email,
        branch: studentForm.branch
      });
      
      console.log('Student created:', response.data);
      
      setSuccess('✅ Student added successfully to database!');
      
      // Refresh the students list
      fetchStudentsFromSpringBoot();
      
      setShowForm(false);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Create Error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('⚠️ Cannot connect to Spring Boot API');
      } else {
        setError('Failed to create student: ' + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== UPDATE - PUT /student/{id} ====================
  const updateStudent = async (roln) => {
    // Validation
    if (!studentForm.name || !studentForm.email || !studentForm.branch) {
      setError('❌ Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      console.log('Updating student:', roln, studentForm);
      
      // PUT request to Spring Boot
      const response = await api.put(`/${roln}`, {
        name: studentForm.name,
        email: studentForm.email,
        branch: studentForm.branch
      });
      
      console.log('Student updated:', response.data);
      
      setSuccess('✅ Student updated successfully in database!');
      
      // Refresh the students list
      fetchStudentsFromSpringBoot();
      
      setShowForm(false);
      setEditingStudent(null);
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Update Error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('⚠️ Cannot connect to Spring Boot API');
      } else {
        setError('Failed to update student: ' + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== DELETE - DELETE /student/{id} ====================
  const deleteStudent = async (roln) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this student from database?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Deleting student:', roln);
      
      // DELETE request to Spring Boot
      const response = await api.delete(`/${roln}`);
      
      console.log('Delete response:', response.data);
      
      setSuccess('✅ Student deleted successfully from database!');
      
      // Refresh the students list
      fetchStudentsFromSpringBoot();
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      console.error('Delete Error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('⚠️ Cannot connect to Spring Boot API');
      } else {
        setError('Failed to delete student: ' + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (editingStudent) {
      updateStudent(editingStudent.roln);
    } else {
      createStudent();
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setStudentForm({ 
      name: student.name, 
      email: student.email, 
      branch: student.branch
    });
    setShowForm(true);
    setError('');
  };

  const resetForm = () => {
    setStudentForm({ name: '', email: '', branch: '' });
    setEditingStudent(null);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setStudents([]);
    setLoginForm({ username: '', password: '' });
    setSuccess('👋 Logged out successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // ==================== LOGIN PAGE ====================
  if (!isLoggedIn) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <div style={styles.icon}>🎓</div>
            <h1 style={styles.title}>Student Management System</h1>
            <p style={styles.subtitle}>Admin Login Portal</p>
          </div>
          
          {error && <div style={styles.errorBox}>{error}</div>}
          {success && <div style={styles.successBox}>{success}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={styles.input}
              placeholder="Enter username"
              autoFocus
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              style={styles.input}
              placeholder="Enter password"
            />
          </div>

          <button onClick={handleLogin} disabled={loading} style={styles.loginButton}>
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>

          <div style={styles.credentials}>
            <p style={{fontSize: '13px', color: '#666', marginTop: '15px'}}>
              Use these credentials:
            </p>
            <p style={{fontSize: '15px', fontWeight: 'bold', color: '#667eea', marginTop: '8px'}}>
              Username: <span style={{background: '#f0f0f0', padding: '4px 12px', borderRadius: '4px'}}>admin</span>
            </p>
            <p style={{fontSize: '15px', fontWeight: 'bold', color: '#667eea', marginTop: '5px'}}>
              Password: <span style={{background: '#f0f0f0', padding: '4px 12px', borderRadius: '4px'}}>admin</span>
            </p>
            <p style={{fontSize: '12px', color: '#999', marginTop: '15px', borderTop: '1px solid #e0e0e0', paddingTop: '10px'}}>
              🔌 API: {API_BASE_URL}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD PAGE ====================
  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>🎓 Student Management </h1>
          <p style={{color: '#666', fontSize: '14px', marginTop: '5px'}}>
            Logged in as: <strong style={{color: '#667eea'}}>Admin</strong> | 
            🔌 Connected to: <strong>{API_BASE_URL}</strong>
          </p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          🚪 Logout
        </button>
      </div>

      <div style={styles.container}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        {/* Action Buttons */}
        <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'}}>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            style={styles.addButton}
          >
            {showForm ? '❌ Cancel' : '➕ Add New Student'}
          </button>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <button
              onClick={fetchStudentsFromSpringBoot}
              disabled={loading}
              style={{...styles.addButton, background: '#48bb78'}}
            >
              {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
            </button>
            <div style={{fontSize: '14px', color: '#666', padding: '10px 15px', background: 'white', borderRadius: '8px', border: '2px solid #667eea', fontWeight: 'bold'}}>
              Total Students: {students.length}
            </div>
          </div>
        </div>

        {/* ==================== INSERT/UPDATE FORM ==================== */}
        {showForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>
              {editingStudent ? '✏️ Edit Student (Update in Database)' : '➕ Add New Student (Insert to Database)'}
            </h2>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  style={styles.input}
                  placeholder="Enter student name"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  style={styles.input}
                  placeholder="Enter email address"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Branch *</label>
                <input
                  type="text"
                  value={studentForm.branch}
                  onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                  style={styles.input}
                  placeholder="Enter branch (e.g., CSE, ECE, MECH)"
                />
              </div>
            </div>
            <button onClick={handleSubmit} disabled={loading} style={styles.submitButton}>
              {loading ? '⏳ Saving...' : editingStudent ? '✅ Update in Database' : '✅ Save to Database'}
            </button>
          </div>
        )}

        {/* ==================== STUDENTS TABLE ==================== */}
        <div style={styles.tableCard}>
          <div style={{padding: '20px', borderBottom: '2px solid #e2e8f0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', margin: 0}}>
              📋 All Students from Database (Table: student11)
            </h2>
            <p style={{fontSize: '13px', marginTop: '5px', opacity: 0.9}}>
              Data fetched from Spring Boot API
            </p>
          </div>
          <div style={{overflowX: 'auto'}}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Roll No</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Branch</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyCell}>
                      ⏳ Loading students from database...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={styles.emptyCell}>
                      📭 No students found in database.<br/>
                      Click "Add New Student" to insert records!
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.roln} style={styles.tableRow}>
                      <td style={{...styles.td, fontWeight: 'bold', color: '#667eea'}}>{student.roln}</td>
                      <td style={{...styles.td, fontWeight: '600', color: '#2d3748'}}>{student.name}</td>
                      <td style={styles.td}>{student.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          background: '#667eea',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {student.branch}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button 
                          onClick={() => handleEdit(student)} 
                          style={styles.editButton}
                          title="Edit Student"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => deleteStudent(student.roln)} 
                          style={styles.deleteButton}
                          title="Delete Student"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Operations Summary */}
        
      </div>
    </div>
  );
}

// ==================== INLINE STYLES ====================
const styles = {
  loginContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  loginCard: {
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    padding: '50px',
    maxWidth: '480px',
    width: '100%'
  },
  loginHeader: { textAlign: 'center', marginBottom: '35px' },
  icon: { fontSize: '72px', marginBottom: '15px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#333', margin: '10px 0' },
  subtitle: { color: '#667eea', fontSize: '17px', fontWeight: '600', marginTop: '5px' },
  dashboard: { minHeight: '100vh', background: '#f5f7fa' },
  header: {
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '25px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px'
  },
  headerTitle: { fontSize: '26px', fontWeight: 'bold', color: '#333' },
  container: { maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s'
  },
  loginButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  },
  logoutButton: {
    padding: '12px 24px',
    background: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'background 0.3s'
  },
  addButton: {
    padding: '14px 28px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s'
  },
  formCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    padding: '35px',
    marginBottom: '25px',
    border: '2px solid #667eea'
  },
  formTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '25px', color: '#333' },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '25px'
  },
  submitButton: {
    padding: '14px 32px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)',
    transition: 'all 0.3s'
  },
  tableCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    border: '2px solid #667eea'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#f7fafc', borderBottom: '2px solid #e2e8f0' },
  th: { 
    padding: '18px 16px', 
    textAlign: 'left', 
    fontSize: '13px', 
    fontWeight: '700', 
    color: '#4a5568', 
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: { 
    borderBottom: '1px solid #e2e8f0',
    transition: 'background 0.2s'
  },
  td: { padding: '18px 16px', fontSize: '14px', color: '#4a5568' },
  emptyCell: { padding: '60px 20px', textAlign: 'center', color: '#718096', fontSize: '15px' },
  editButton: {
    padding: '8px 16px',
    background: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '10px',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background 0.3s'
  },
  deleteButton: {
    padding: '8px 16px',
    background: '#f56565',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background 0.3s'
  },
  errorBox: {
    background: '#fed7d7',
    border: '2px solid #fc8181',
    color: '#c53030',
    padding: '14px 18px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontWeight: '500',
    fontSize: '14px'
  },
  successBox: {
    background: '#c6f6d5',
    border: '2px solid #68d391',
    color: '#22543d',
    padding: '14px 18px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontWeight: '500',
    fontSize: '14px'
  },
  credentials: {
    textAlign: 'center',
    marginTop: '25px',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '10px',
    border: '1px solid #e2e8f0'
  }
};

// ==================== RENDER APP ====================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StudentManagementApp />
  </React.StrictMode>
);