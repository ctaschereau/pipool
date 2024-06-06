self.addEventListener('sync', event => {
	if (event.tag === 'sync-data') {
		event.waitUntil(syncDataAndNotify());
	}
});

function openDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('notification-store', 1);
		request.onupgradeneeded = event => {
			const db = event.target.result;
			db.createObjectStore('notifications', { keyPath: 'id' });
		};
		request.onsuccess = event => {
			resolve(event.target.result);
		};
		request.onerror = event => {
			reject(event.target.error);
		};
	});
}

async function wasNotificationShownToday(poolTempNow) {
	const db = await openDatabase();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['notifications'], 'readonly');
		const store = transaction.objectStore('notifications');
		const request = store.get('lastNotificationTime');

		request.onsuccess = event => {
			const lastNotificationTime = event.target.result?.timestamp;
			if (!lastNotificationTime) return resolve(false);

			const lastDate = new Date(lastNotificationTime);
			const today = new Date();

			resolve(lastDate.toDateString() === today.toDateString());
		};

		request.onerror = event => {
			reject(event.target.error);
		};
	});
}

async function updateLastNotificationTime() {
	const db = await openDatabase();
	const now = new Date().getTime();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['notifications'], 'readwrite');
		const store = transaction.objectStore('notifications');
		const request = store.put({ id: 'lastNotificationTime', timestamp: now });

		request.onsuccess = () => resolve();
		request.onerror = event => reject(event.target.error);
	});
}

async function syncDataAndNotify() {
	const poolTempResponse = await fetch('/data/pool?rangeToDisplay=4hours');
	const poolTemp = await poolTempResponse.json();
	const poolTempNow = poolTemp[poolTemp.length - 1].temp;

	const threshold = 22;

	if (poolTempNow > threshold) {
		await showNotification(poolTempNow);
	}
}

async function showNotification(poolTempNow) {
	if (await wasNotificationShownToday(poolTempNow)) return;

	const options = {
		body: `La piscine est à ${poolTempNow}`,
		icon: '/img/favicon.ico',
		badge: '/img/favicon.ico',
	};


	await self.registration.showNotification('PiPool', options);
	await updateLastNotificationTime();
}

self.addEventListener('notificationclick', event => {
	event.notification.close();
	event.waitUntil(clients.openWindow('/'));
});