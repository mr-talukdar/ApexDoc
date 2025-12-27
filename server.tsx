import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';

/**
 * Server-side render function.
 * This function renders the App component to an HTML string.
 * It is intended to be used by a Node.js server or a build script
 * to pre-populate the 'index.html' file before serving it to clients.
 */
export function render() {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}