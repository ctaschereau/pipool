self.addEventListener('sync', event => {
	if (event.tag === 'sync-data') {
		event.waitUntil(syncDataAndNotify());
	}
});

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

async function syncDataAndNotify() {
	// TODO : ...
	if (false && wasNotificationShownToday()) return;

	const poolTempResponse = await fetch('/data/pool');
	const poolTemp = await poolTempResponse.json();
	const poolTempNow = poolTemp[poolTemp.length - 1][1];

	const threshold = 22;

	if (poolTempNow > threshold) {
		await showNotification(poolTempNow);
	}
}

async function showNotification(poolTempNow) {
	// if (wasNotificationShownToday()) return;

	const options = {
		body: `La piscine est à ${poolTempNow}`,
		icon: '/img/favicon.ico',
		// badge: '/path/to/badge.png', // Optional
	};

	updateLastNotificationTime();

	await self.registration.showNotification('PiPool', options);
}

self.addEventListener('notificationclick', event => {
	event.notification.close();
	event.waitUntil(clients.openWindow('/'));
});