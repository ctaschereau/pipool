function wasNotificationShownToday() {
	const lastNotificationTime = localStorage.getItem('lastNotificationTime');
	if (!lastNotificationTime) return false;

	const lastDate = new Date(parseInt(lastNotificationTime, 10));
	const today = new Date();

	return lastDate.toDateString() === today.toDateString();
}

function updateLastNotificationTime() {
	const now = new Date().getTime();
	localStorage.setItem('lastNotificationTime', now.toString());
}

async function showNotification(poolTempNow) {
	// if (wasNotificationShownToday()) return;

	const options = {
		body: `La piscine est à ${poolTempNow}`,
		// icon: '/path/to/icon.png', // Optional
		// badge: '/path/to/badge.png', // Optional
	};

	const reg = await navigator.serviceWorker.getRegistration();
	if (reg) {
		await reg.showNotification('Threshold Exceeded!', options);
	} else {
		new Notification('Threshold Exceeded!', options);
	}
	updateLastNotificationTime();
}

async function askPermission() {
	try {
		const permissionResult = await Notification.requestPermission();
		if (permissionResult !== 'granted') {
			throw new Error('Notification permission not granted.');
		}
	} catch (error) {
		console.error('Notification permission request failed:', error);
	}
}

const getNotifications = async function() {
	if ('serviceWorker' in navigator && 'SyncManager' in window) {
		const registration = await navigator.serviceWorker.register('/js/service-worker.js');
		console.log('Service Worker registered with scope:', registration.scope);

		await askPermission();

		registration.sync.register('sync-data');
	}
}