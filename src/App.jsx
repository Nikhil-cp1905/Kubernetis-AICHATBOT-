import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  // Safely parse HTML response from backend
  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  // Handler for New Chat button
  const handleNewChat = () => {
    window.location.reload();
  };

  const handleAsk = async () => {
    if (!query.trim()) return;

    const userMessage = { type: "user", text: query };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const response = await fetch("https://kubernetes-failure-predictor.onrender.com/k8s-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: query }),
      });

      const data = await response.json();
      // Process the response to ensure it's properly displayed
      const botMessage = { 
        type: "bot", 
        text: data.reply || "No response received." 
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = { type: "bot", text: "Error contacting backend." };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Left sidebar */}
      <div className="sidebar left-sidebar">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleNewChat}>
            <span className="plus-icon">+</span> New chat
          </button>
        </div>
        <div className="sidebar-content k8s-info">
          <h3 className="sidebar-title">Kubernetes Basics</h3>
          <div className="k8s-info-item">
            <h4>What is Kubernetes?</h4>
            <p>An open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.</p>
          </div>
          <div className="k8s-info-item">
            <h4>Key Components</h4>
            <ul>
              <li>Pods</li>
              <li>Nodes</li>
              <li>Deployments</li>
              <li>Services</li>
              <li>ConfigMaps</li>
            </ul>
          </div>
          <div className="k8s-info-item">
            <h4>Common Issues</h4>
            <ul>
              <li>Pod evictions</li>
              <li>Image pull failures</li>
              <li>Resource constraints</li>
              <li>Network policies</li>
              <li>Volume mounting errors</li>
            </ul>
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="sidebar-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Import data
          </button>
          <button className="sidebar-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Export data
          </button>
          <button className="sidebar-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 8.5A5.5 5.5 0 0113 8.5M3 12.5A9.5 9.5 0 0113 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Settings
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="main-content">
        {chatHistory.length === 0 ? (
          <div className="welcome-screen">
            <h1>Welcome to Kubernetes ChatBot UI</h1>
            <p>Ask questions about Kubernetes issues and get helpful troubleshooting advice.</p>
          </div>
        ) : (
          <div className="chat-messages">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.type}-message`}>
                <div className="message-avatar">
                  {msg.type === "user" ? "🧑‍💻" : "🤖"}
                </div>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="input-area">
          <div className="input-container">
            <input
              type="text"
              placeholder="Ask a Kubernetes question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button 
              className="send-button" 
              onClick={handleAsk} 
              disabled={loading || !query.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 8L1 15V1L15 8Z" stroke="currentColor" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div className="input-footer">
            <p className="disclaimer">Kubernetes ChatBot is a specialized assistant for troubleshooting K8s issues.</p>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="sidebar right-sidebar">
        
        <div className="sidebar-content k8s-animation">
          <h3 className="sidebar-title">Kubernetes Visualization</h3>
          <div className="animation-container">
            <div className="k8s-wheel">
              <div className="wheel-segment s1"></div>
              <div className="wheel-segment s2"></div>
              <div className="wheel-segment s3"></div>
              <div className="wheel-segment s4"></div>
              <div className="wheel-segment s5"></div>
              <div className="wheel-segment s6"></div>
              <div className="wheel-segment s7"></div>
              <div className="hub"></div>
            </div>
            <div className="pod-container">
              <div className="pod p1"></div>
              <div className="pod p2"></div>
              <div className="pod p3"></div>
            </div>
          </div>
          <div className="animation-info">
            <p>This visualization represents the Kubernetes container orchestration system. The wheel symbolizes the control plane, while the floating pods represent containerized applications being managed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
