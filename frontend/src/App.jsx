import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'; // NEW: Import QR Tool
import './App.css'

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]); 

  // 1. Load History from LocalStorage
  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem('myLinks')) || [];
    setHistory(savedLinks);
    savedLinks.forEach(link => fetchStats(link.shortId));
  }, []);

  // 2. Fetch Click Counts
  const fetchStats = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/stats/${id}`);
      const data = await res.json();
      setHistory(prev => prev.map(item => 
        item.shortId === id ? { ...item, clicks: data.clicks } : item
      ));
    } catch (err) { console.error(err); }
  };

  const handleShorten = async () => {
    setShortUrl(null); setError(null); setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      });
      const data = await response.json();

      if (data.status === "Unsafe") {
        setError(data.message);
      } else {
        const fullShortUrl = data.shortUrl;
        const shortId = fullShortUrl.split('/').pop(); 
        
        setShortUrl(fullShortUrl);
        
        // 3. Save to History
        const newLink = { shortId, fullShortUrl, originalUrl: url, clicks: 0 };
        const newHistory = [newLink, ...history];
        setHistory(newHistory);
        localStorage.setItem('myLinks', JSON.stringify(newHistory)); 
      }
    } catch (err) {
      setError("Server Error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#4285F4' }}>SafeLink 🛡️</h1>
      
      {/* INPUT */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '30px', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="Paste a long link..." 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '15px', width: '60%', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleShorten}
          disabled={loading}
          style={{ padding: '15px 30px', borderRadius: '8px', border: 'none', backgroundColor: '#4285F4', color: 'white', cursor: 'pointer' }}
        >
          {loading ? 'Scanning...' : 'Shorten'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>⚠️ {error}</div>}
      
      {/* SUCCESS + QR CODE */}
      {shortUrl && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <h3 style={{ margin: 0, color: '#2E7D32' }}>Link Ready!</h3>
          
          {/* QR CODE DISPLAY */}
          <div style={{ background: 'white', padding: '10px', borderRadius: '8px' }}>
             <QRCodeSVG value={shortUrl} size={128} />
          </div>

          <a href={shortUrl} target="_blank" style={{ fontSize: '20px', fontWeight: 'bold' }}>{shortUrl}</a>
        </div>
      )}

      {/* DASHBOARD */}
      {history.length > 0 && (
        <div style={{ marginTop: '50px', textAlign: 'left' }}>
          <h2>📊 Your History</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '10px' }}>Short Link</th>
                <th style={{ padding: '10px' }}>Original</th>
                <th style={{ padding: '10px' }}>Clicks 🔥</th>
                <th style={{ padding: '10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((link) => (
                <tr key={link.shortId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <a href={link.fullShortUrl} target="_blank" onClick={() => setTimeout(() => fetchStats(link.shortId), 1000)}>
                      {link.shortId}
                    </a>
                  </td>
                  <td style={{ padding: '10px', color: '#666', maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {link.originalUrl}
                  </td>
                  <td style={{ padding: '10px', fontWeight: 'bold', color: '#E65100' }}>
                    {link.clicks}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => fetchStats(link.shortId)} style={{ cursor: 'pointer' }}>🔄 Refresh</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App