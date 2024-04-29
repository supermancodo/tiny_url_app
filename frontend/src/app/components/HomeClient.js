"use client"

import styles from './HomeClient.module.css';
import { useState } from 'react';
import axios from 'axios';

export default function HomeClient() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/shorten`, { originalUrl });
      setShortenedUrl(response.data.shortUrl);
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  const handleCopy = async () => {
    if (!shortenedUrl) return;
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('Failed to copy URL');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>URL Shortener</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Enter URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Shorten</button>
      </form>
      {shortenedUrl && (
        <div className={styles.result}>
          <p>Shortened URL:</p>
          <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl}</a>
          <button onClick={handleCopy} className={styles.button}>Copy URL</button>
        </div>
      )}
    </div>
  );
}
