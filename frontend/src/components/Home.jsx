import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getGeoData, historyAPI } from "../utils/api";
import "./Home.css";

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  //State for geo data
  const [currentGeo, setCurrentGeo] = useState(null);
  const [userIp, setUserIp] = useState("");

  //State for search
  const [searchIp, setSearchIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for history
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState([]);

  // Load user IP and history on mount

  useEffect(() => {
    loadUserGeo();
    loadHistory();
  }, []);

  // Fetch current user IP and geo data
  const loadUserGeo = async (params) => {
    try {
      setLoading(true);
      const data = await getGeoData();
      setCurrentGeo(data);
      setUserIp(data.ip);
      setError("");
    } catch (err) {
      setError("Failed to load location");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await historyAPI.getHistory();
      console.log("History data received:", data);
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const isValidIp = (ip) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;

    const parts = ip.split(".");
    return parts.every((p) => {
      const num = parseInt(p);
      return num >= 0 && num <= 255;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!searchIp.trim()) {
      setError("Please enter an IP address");
      return;
    }

    if (!isValidIp(searchIp)) {
      setError("Invalid IP address format");
      return;
    }

    try {
      setLoading(true);
      const data = await getGeoData(searchIp);
      setCurrentGeo(data);
      
      // Save to history
      await historyAPI.saveHistory(searchIp, data);
      
      // Reload history to show new entry
      await loadHistory();
    } catch (err) {
      setError("Failed to fetch geolocation data");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchIp("");
    setError("");
    loadUserGeo();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleHistorySelection = (id) => {
    setSelectedHistory(prev=>{
        if (prev.includes(id)) {
            return prev.filter(item => item !== id);
        } else {
            return [...prev, id];
        }
    });
  };

  const handleDeleteHistory = async () => {
    // To Do
  }

  const handleHistoryClick = async (ip) => {
    try{
        setLoading(true);
        setSearchIp(ip);
        const data = await getGeoData(ip);
        setCurrentGeo(data);
        setError('');
    }catch(err){
        setError('Failed to fetch geolocation data')
    }finally {
        setLoading(false);
    }
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>IP Geolocation Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="home-content">
        <div className="search-section">
          <h2>Search IP Address</h2>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
              placeholder="Enter IP address (e.g., 10.0.0.0)"
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
            <button type="button" onClick={handleClear} disabled={loading}>
              Clear
            </button>
          </form>
          {error && <div className="error-msg">{error}</div>}
        </div>

        {/* {Display Geo Data} */}
        {currentGeo && (
          <section className="geo-section">
            <h2>Location Information</h2>
            <div className="geo-card">
              <div className="geo-item">
                <strong>IP Address: </strong>
                {currentGeo.ip}
              </div>
              <div className="geo-item">
                <strong>City: </strong> {currentGeo.city || "N/A"}
              </div>
              <div className="geo-item">
                <strong>Region:</strong> {currentGeo.region || "N/A"}
              </div>
              <div className="geo-item">
                <strong>Country:</strong> {currentGeo.country || "N/A"}
              </div>
              <div className="geo-item">
                <strong>Location:</strong> {currentGeo.loc || "N/A"}
              </div>
              <div className="geo-item">
                <strong>Postal:</strong> {currentGeo.postal || "N/A"}
              </div>
              <div className="geo-item">
                <strong>Timezone:</strong> {currentGeo.timezone || "N/A"}
              </div>
            </div>
            {currentGeo.ip === userIp && (
              <p className="curr-ip-label">This is your current IP</p>
            )}
          </section>
        )}

        {/* History Section */}
        <section className="history-section">
          <header className="history-header">
            <h2>Search History</h2>
            {selectedHistory.length > 0 && (
              <button onClick={handleDeleteHistory} className="delete-btn">
                Delete
              </button>
            )}
          </header>

          {history.length === 0 ? (
            <p className="no-history">
                No Search History Yet
            </p>
          ) : (
            <div className="history-list">
                {history.map((item) => (
                    <div key={item.id} className="history-item">
                        <input 
                        type="checkbox"
                        checked={selectedHistory.includes(item.id)}
                        onChange={()=>toggleHistorySelection(item.id)} 
                        />
                        <div 
                        className="history-content"
                        onClick={() => handleHistoryClick(item.ip_address)}
                        >
                            <strong>{item.ip_address}</strong>
                            <span className="history-location">
                                {item.geo_data?.city}, {item.geo_data?.country}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Home;
