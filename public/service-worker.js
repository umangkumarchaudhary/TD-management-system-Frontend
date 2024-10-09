// service-worker.js

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received:', data);
    
    const options = {
      body: data.body,
      icon: '/path-to-your-icon.png', // Optional: path to an icon
      badge: '/path-to-your-badge.png' // Optional: path to a badge
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  