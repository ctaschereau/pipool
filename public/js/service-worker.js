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
			const lastNotification = event.target.result;
			if (!lastNotification) {
				resolve(false);
				return;
			}
			const lastNotificationTime = event.target.result?.timestamp;
			const lastTemp = event.target.result?.temp;

			// If the temp did not even go up by 1 degree, we don't want to spam the user
			if (Math.floor(lastTemp) >= Math.floor(poolTempNow)) {
				resolve(true);
				return;
			}

			const lastDate = new Date(lastNotificationTime);
			const today = new Date();
			resolve(lastDate.getDay() === today.getDay());
		};

		request.onerror = event => {
			reject(event.target.error);
		};
	});
}

async function updateLastNotificationTime(poolTempNow) {
	const db = await openDatabase();
	const now = new Date().getTime();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['notifications'], 'readwrite');
		const store = transaction.objectStore('notifications');
		const request = store.put({
			id: 'lastNotificationTime',
			timestamp: now,
			temp: poolTempNow,
		});

		request.onsuccess = () => resolve();
		request.onerror = event => reject(event.target.error);
	});
}

async function syncDataAndNotify() {
	// Quit early if NOT between 9am and 10pm
	const now = new Date();
	const hour = now.getHours();
	if (hour < 9 || hour >= 22) return;

	const poolTempResponse = await fetch('/data/pool?rangeToDisplay=4hours');
	const poolTemp = await poolTempResponse.json();
	const poolTempNow = poolTemp[poolTemp.length - 1].temp;

	const threshold = 22;

	if (poolTempNow > threshold) {
		await showNotification(poolTempNow);
	}
}

async function showNotification(poolTempNow) {
	if (false && await wasNotificationShownToday(poolTempNow)) return;

	const options = {
		body: `La piscine est à ${poolTempNow}`,
		icon: '/img/favicon.ico',
		badge: '/img/favicon.ico',
	};


	await self.registration.showNotification('PiPool', options);
	await updateLastNotificationTime(poolTempNow);
}

self.addEventListener('notificationclick', event => {
	event.notification.close();
	event.waitUntil(clients.openWindow('/'));
});