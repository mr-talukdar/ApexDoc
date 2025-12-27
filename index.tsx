import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Check if the root has child nodes (content rendered by server)
// and ensure it's not just the placeholder comment.
const hasContent = rootElement.hasChildNodes() && 
                   !(rootElement.childNodes.length === 1 && rootElement.childNodes[0].nodeType === 8); // 8 is COMMENT_NODE

if (hasContent) {
  // Hydrate the static HTML with React interactivity
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Client-side render fallback
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}