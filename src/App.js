// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard';
import CompleteListOfBookings from './components/CompleteListOfBookings';
import TestDriveDashboard from './pages/TestDriveDashboard';
import Header from './components/Header';

const App = () => {

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);

    const askNotificationPermission = () => {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                subscribeUserToPush();
            }
        });
    };

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeUserToPush = () => {
        navigator.serviceWorker.ready.then(registration => {
            const vapidPublicKey = 'BH2URV2TQMM_Q8nRvoW5Ic4lC_hZges1aCfkLf5V_cg1fDFUIraa3j3hccOAZ2bbfqoOvKENYgEzDM7m0tJBFbA'; // Replace with actual VAPID public key
            const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            }).then(subscription => {
                console.log('User is subscribed:', subscription);
                // Send subscription to backend
                sendSubscriptionToBackend(subscription);
            }).catch(err => console.error('Subscription failed:', err));
        });
    };

    const sendSubscriptionToBackend = (subscription) => {
        fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
        }).then(response => response.json())
        .then(data => console.log('Subscription saved:', data))
        .catch(err => console.error('Subscription failed:', err));
    };

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<BookingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/complete-list" element={<CompleteListOfBookings />} />
                <Route path="/test-drive-dashboard" element={<TestDriveDashboard />} />
            </Routes>
            <button onClick={askNotificationPermission}>Enable Notifications</button>
        </Router>
    );
};

export default App;
