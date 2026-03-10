import React from 'react';

function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.errorCode}>404</h1>
        <div style={styles.divider}></div>
        <h2 style={styles.title}>  សរសេរ រ៉ោត ខុសហើយប្រូ  </h2>
        <h2 style={styles.title}>  ចង់រកអីគេ ?  </h2>
        <p style={styles.text}>
          The page you're looking for has vanished into the void. 
          Don't worry, even the best explorers get lost sometimes.
        </p>
        <a href="/" style={styles.button}>
          Take Me Home
        </a>
      </div>
      {/* Decorative blurred circles for that "cool" vibe */}
      <div style={styles.glow}></div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontFamily: 'system-ui, sans-serif',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    textAlign: 'center',
    zIndex: 2,
    padding: '20px',
  },
  errorCode: {
    fontSize: '8rem',
    fontWeight: '900',
    margin: 0,
    background: 'linear-gradient(to bottom, #fff, #444)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  divider: {
    height: '2px',
    width: '60px',
    backgroundColor: '#3b82f6', // Bright blue accent
    margin: '20px auto',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  text: {
    color: '#a3a3a3',
    maxWidth: '400px',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    color: '#000',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    display: 'inline-block',
  },
  glow: {
    position: 'absolute',
    width: '40vw',
    height: '40vw',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    filter: 'blur(100px)',
    borderRadius: '50%',
    zIndex: 1,
  }
};

export default NotFound;