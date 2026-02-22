// src/utils/notifications.js

export const triggerHubbleNotif = (title, message) => {
  // 1. Get existing data
  const saved = JSON.parse(localStorage.getItem('hubble_notifs') || '[]');
  
  // 2. Create new entry
  const newEntry = {
    id: Date.now(),
    title,
    message,
    read: false,
    timestamp: new Date().toISOString()
  };
  
  // 3. Save back to localStorage
  localStorage.setItem('hubble_notifs', JSON.stringify([newEntry, ...saved]));
  
  // 4. Dispatch the custom event so TopBar hears it
  window.dispatchEvent(new Event('hubble_update'));
  
  console.log("🚀 Notification Triggered:", title);
};