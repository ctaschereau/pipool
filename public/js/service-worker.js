self.addEventListener('sync', event => {
	if (event.tag === 'sync-data') {
		event.waitUntil(syncDataAndNotify());
	}
});

async function syncDataAndNotify() {
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
		// icon: '/path/to/icon.png', // Optional
		// badge: '/path/to/badge.png', // Optional
	};

	await self.registration.showNotification('Threshold Exceeded!', options);
}

self.addEventListener('notificationclick', event => {
	event.notification.close();
	event.waitUntil(clients.openWindow('/'));
});