import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:8080/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showRegister, setShowRegister] = useState(true);
  const [viewMode, setViewMode] = useState("home"); 
  
  const [authData, setAuthData] = useState({ username: '', password: '', email: '' });
  const [userData, setUserData] = useState({ username: '', email: '' });
  
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({ userName: '', location: '', issue: '', description: '' });

  const fetchAllData = () => {
    axios.get(`${API_BASE}/complaints`)
      .then(res => setComplaints(res.data))
      .catch(err => console.log("Fetch Error:", err));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData({ username: '', email: '' });
    setViewMode("home");
    setAuthData({ username: '', password: '', email: '' });
    alert("Logged out successfully!");
  };

  const handleResolve = (id) => {
    axios.put(`${API_BASE}/complaints/${id}`, { status: "Issue Solved by Maintenance Team" })
      .then(() => {
        alert("✅ Status Updated!");
        fetchAllData();
      })
      .catch(() => alert("Error updating status."));
  };

  const handleCancel = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`${API_BASE}/complaints/${id}`)
        .then(() => {
          alert("🗑️ Deleted Successfully!");
          fetchAllData();
        })
        .catch(() => alert("Error deleting record."));
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const endpoint = showRegister ? 'register' : 'login';
    axios.post(`${API_BASE}/users/${endpoint}`, authData)
      .then(res => {
        if (showRegister) {
            alert("✅ Registration Success! Please Login.");
            setShowRegister(false);
            setAuthData({ username: '', password: '', email: '' });
        } else {
          if (res.data.status === "success" || res.data === "Login Success") {
            setUserData({ username: authData.username, email: authData.email || `${authData.username.toLowerCase()}@watercare.com` });
            setIsLoggedIn(true);
            setShowAuth(false);
            setFormData(prev => ({ ...prev, userName: authData.username }));
          } else {
            alert("❌ Invalid Credentials!");
          }
        }
      }).catch(() => alert("Connection Error"));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("⚠️ Please Register or Login first!");
      setShowAuth(true);
      return;
    }
    axios.post(`${API_BASE}/complaints`, { ...formData, status: 'PENDING' })
      .then(() => {
        alert("Report Submitted Successfully!");
        setFormData({ ...formData, location: '', issue: '', description: '' });
        fetchAllData();
        setViewMode("all_list");
      });
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* AUTH MODAL */}
      {showAuth && (
        <div style={styles.authWrapper}>
          <div style={styles.authCard}>
            <h2 style={{color: '#0ea5e9'}}>{showRegister ? 'Join WaterCare' : 'Welcome Back'}</h2>
            <form onSubmit={handleAuthSubmit}>
              <input style={styles.inputField} placeholder="Username" value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} required />
              {showRegister && (
                <input style={styles.inputField} type="email" placeholder="Email Address" value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} required />
              )}
              <input style={styles.inputField} type="password" placeholder="Password" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} required />
              <button style={styles.primaryBtn} type="submit">{showRegister ? 'Register' : 'Login'}</button>
            </form>
            <button style={styles.cancelBtn} onClick={() => setShowAuth(false)}>Close</button>
            <p style={styles.switchText} onClick={() => setShowRegister(!showRegister)}>
              {showRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </p>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand} onClick={() => setViewMode("home")}>
          <span style={{ fontSize: '28px' }}>💧</span>
          <h2 style={{ margin: 0, color: '#0ea5e9', letterSpacing:'1px' }}>WaterCare</h2>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <span style={styles.navLink} onClick={() => setViewMode("home")}>Home</span>
          <span style={styles.navLink} onClick={() => setViewMode("all_list")}>Global Records</span>
          {isLoggedIn ? (
             <button style={styles.profileBtn} onClick={() => setViewMode("profile")}>👤 {userData.username}</button>
          ) : (
             <button style={styles.loginBtn} onClick={() => { setShowRegister(false); setShowAuth(true); }}>Login</button>
          )}
        </div>
      </nav>

      {/* HOME VIEW */}
      {viewMode === "home" && (
        <div>
          <header style={styles.heroSection}>
            <div style={{maxWidth:'900px', margin:'0 auto'}}>
              <h1 style={styles.heroTitle}>Water Quality & Complaint Management System</h1>
              <p style={styles.heroSubtitle}>Real-time tracking of water safety, pollution, and supply management for a healthier community.</p>
              <div style={{display:'flex', gap:'15px', justifyContent:'center'}}>
                <button style={styles.heroCta} onClick={() => document.getElementById('report-form').scrollIntoView({behavior:'smooth'})}>Report an Issue</button>
                <button style={styles.heroSecondaryCta} onClick={() => setViewMode("all_list")}>View Live Status</button>
              </div>
            </div>
          </header>

          <div style={styles.featureBar}>
              <div style={styles.featItem}>📊 <span>Real-time Data</span></div>
              <div style={styles.featItem}>🔍 <span>Purity Checks</span></div>
              <div style={styles.featItem}>🛰️ <span>GPS Tracking</span></div>
              <div style={styles.featItem}>📢 <span>Instant Alerts</span></div>
          </div>

          <div style={styles.aboutSection}>
              <div style={{maxWidth:'1000px', margin:'0 auto', textAlign:'center'}}>
                <h2 style={{color:'#1e293b', fontSize:'32px'}}>Why Monitor Water Quality?</h2>
                <p style={{color:'#64748b', fontSize:'18px', lineHeight:'1.6'}}>Our system ensures that every citizen has access to safe drinking water by providing a platform to report contaminations, leakages, and shortages directly to the maintenance teams.</p>
              </div>
          </div>

          <div id="report-form" style={styles.formSection}>
            <div style={styles.formCard}>
              <h3 style={{textAlign:'center', marginBottom:'25px', color:'#1e293b'}}>Submit Quality Report</h3>
              <form onSubmit={handleFormSubmit}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Reporter Name</label>
                  <input 
                    style={{...styles.inputField, background: isLoggedIn ? '#f1f5f9' : 'white'}} 
                    value={isLoggedIn ? userData.username : formData.userName} 
                    readOnly={isLoggedIn}
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                   <label style={styles.label}>Location / Area</label>
                   <input style={styles.inputField} placeholder="e.g. Sector 4, MG Road" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div style={styles.inputGroup}>
                   <label style={styles.label}>Type of Issue</label>
                   <select style={styles.inputField} value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})} required>
                      <option value="">Select Issue</option>
                      <option value="Water Contamination">Water Contamination (Dirty Water)</option>
                      <option value="Pipe Leakage">Pipe Leakage</option>
                      <option value="No Water Supply">No Water Supply</option>
                      <option value="Low Pressure">Low Water Pressure</option>
                      <option value="Bad Odor">Bad Odor in Water</option>
                   </select>
                </div>
                <div style={styles.inputGroup}>
                   <label style={styles.label}>Description</label>
                   <textarea style={{...styles.inputField, height: '100px'}} placeholder="Provide more details about the problem..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                </div>
                <button style={styles.submitBtn} type="submit">Send Report to Maintenance</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL RECORDS VIEW */}
      {viewMode === "all_list" && (
          <div style={{padding:'40px 60px'}}>
              <h2 style={{color:'#1e293b', marginBottom:'30px', textAlign:'center', fontWeight:'bold'}}>Public Complaint Registry</h2>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead style={{background:'#0ea5e9', color:'white'}}>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Reporter</th>
                            <th style={styles.th}>Location</th>
                            <th style={styles.th}>Issue</th>
                            <th style={styles.th}>Description</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((c, index) => (
                            <tr key={c.id} style={{borderBottom:'1px solid #f1f5f9', textAlign:'center'}}>
                                <td style={styles.td}>{index + 1}</td>
                                <td style={styles.td}>{c.userName}</td>
                                <td style={styles.td}>{c.location}</td>
                                <td style={styles.td}>{c.issue}</td>
                                <td style={styles.td}>{c.description}</td>
                                <td style={{...styles.td, color: c.status?.includes('Solved') ? '#059669' : '#d97706', fontWeight:'bold'}}>{c.status || 'PENDING'}</td>
                                <td style={styles.td}>
                                    <div style={{display:'flex', gap:'8px', justifyContent:'center'}}>
                                        <button onClick={() => handleResolve(c.id)} disabled={c.status?.includes('Solved')} style={{...styles.resBtn, opacity: c.status?.includes('Solved') ? 0.5 : 1}}>Resolve</button>
                                        <button onClick={() => handleCancel(c.id)} style={styles.canBtn}>Cancel</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
          </div>
      )}

      {/* PROFILE VIEW */}
      {viewMode === "profile" && (
        <div style={{padding:'50px'}}>
          <div style={{display:'flex', justifyContent:'center', marginBottom:'50px'}}>
            <div style={styles.profileCard}>
              <div style={styles.avatar}>{userData.username.charAt(0).toUpperCase()}</div>
              <h2 style={{margin:'10px 0'}}>{userData.username}</h2>
              <p style={{color:'#64748b'}}>{userData.email}</p>
              <button style={styles.logoutBtn} onClick={handleLogout}>Logout Account</button>
            </div>
          </div>

          <h3 style={{textAlign:'center', color:'#1e293b', marginBottom:'20px'}}>My Submitted Reports</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={{background:'#475569', color:'white'}}>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Issue</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.filter(c => c.userName === userData.username).map((c, index) => (
                  <tr key={c.id} style={{borderBottom:'1px solid #eee', textAlign:'center'}}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{c.userName}</td>
                    <td style={styles.td}>{c.location}</td>
                    <td style={styles.td}>{c.issue}</td>
                    <td style={styles.td}>{c.description}</td>
                    <td style={{...styles.td, color: '#0ea5e9', fontWeight:'600'}}>{c.status || 'PENDING'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', padding: '15px 80px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position:'sticky', top:0, zIndex:100 },
  navBrand: { display: 'flex', alignItems: 'center', gap: '12px', cursor:'pointer' },
  navLink: { cursor: 'pointer', color: '#475569', fontWeight: '600', transition:'0.3s' },
  loginBtn: { background: '#0ea5e9', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '30px', cursor: 'pointer', fontWeight:'bold' },
  profileBtn: { background: '#f1f5f9', color: '#0ea5e9', border: '1px solid #0ea5e9', padding: '10px 25px', borderRadius: '30px', cursor: 'pointer', fontWeight:'bold' },
  
  heroSection: { background: 'linear-gradient(rgba(14, 165, 233, 0.85), rgba(37, 99, 235, 0.9)), url("https://images.unsplash.com/photo-1548932813-71ede5af220d?auto=format&fit=crop&w=1500&q=80")', backgroundSize:'cover', backgroundPosition:'center', padding: '120px 20px', textAlign: 'center', color: 'white' },
  heroTitle: { fontSize: '54px', fontWeight:'900', marginBottom:'15px', textShadow:'2px 2px 4px rgba(0,0,0,0.2)' },
  heroSubtitle: { fontSize: '22px', marginBottom:'40px', opacity:'0.9', maxWidth:'700px', margin:'0 auto 40px' },
  heroCta: { padding:'15px 40px', background:'white', color:'#0ea5e9', border:'none', borderRadius:'30px', fontSize:'18px', fontWeight:'bold', cursor:'pointer', boxShadow:'0 4px 15px rgba(0,0,0,0.1)' },
  heroSecondaryCta: { padding:'15px 40px', background:'transparent', color:'white', border:'2px solid white', borderRadius:'30px', fontSize:'18px', fontWeight:'bold', cursor:'pointer', marginLeft:'10px' },
  
  featureBar: { display:'flex', justifyContent:'center', gap:'40px', padding:'40px', background:'white', boxShadow:'0 5px 25px rgba(0,0,0,0.05)', flexWrap:'wrap' },
  featItem: { fontSize:'18px', fontWeight:'600', color:'#475569', display:'flex', alignItems:'center', gap:'10px', padding:'10px 20px', background:'#f8fafc', borderRadius:'10px' },

  aboutSection: { padding: '80px 20px', background: '#f8fafc' },

  formSection: { padding:'80px 20px', display: 'flex', justifyContent: 'center', background: 'white' },
  formCard: { background: 'white', padding: '40px', borderRadius: '25px', width: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', border:'1px solid #f1f5f9' },
  inputGroup: { marginBottom:'20px', textAlign:'left' },
  label: { display:'block', marginBottom:'8px', fontWeight:'600', color:'#475569', fontSize:'14px' },
  inputField: { width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', boxSizing: 'border-box', outline:'none', fontSize:'15px' },
  submitBtn: { width: '100%', padding: '16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize:'18px', marginTop:'10px', boxShadow:'0 10px 20px rgba(14, 165, 233, 0.3)' },

  tableWrapper: { background:'white', borderRadius:'15px', overflow:'hidden', boxShadow:'0 10px 25px rgba(0,0,0,0.05)', maxWidth:'1200px', margin:'0 auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '18px', fontSize:'15px', textTransform:'uppercase', letterSpacing:'1px' },
  td: { padding: '15px', fontSize:'15px', color:'#475569' },
  resBtn: { background:'#10b981', color:'white', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontWeight:'600' },
  canBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight:'600' },
  
  profileCard: { background: 'white', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '380px', boxShadow: '0 25px 50px rgba(0,0,0,0.1)' },
  avatar: { width: '100px', height: '100px', background: '#0ea5e9', color: 'white', fontSize: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', boxShadow:'0 10px 20px rgba(14, 165, 233, 0.2)' },
  logoutBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer', marginTop: '25px', width:'100%', fontWeight:'bold' },
  
  authWrapper: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'rgba(15, 23, 42, 0.9)', position:'fixed', width:'100%', top:0, zIndex:1000 },
  authCard: { background: 'white', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '380px', boxShadow:'0 30px 60px rgba(0,0,0,0.2)' },
  primaryBtn: { width: '100%', padding: '14px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight:'bold', marginTop:'15px', fontSize:'16px' },
  cancelBtn: { marginTop: '15px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' },
  switchText: { cursor: 'pointer', marginTop: '20px', color: '#2563eb', fontWeight:'600' }
};

export default App;