self.addEventListener('sync', event => {
	if (event.tag === 'sync-data') {
		event.waitUntil(syncDataAndNotify());
	}
});

self.addEventListener('notificationclick', event => {
	event.notification.close();
	// event.waitUntil(clients.openWindow('/'));
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

async function getLastNotificationFromStore() {
	const db = await openDatabase();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(['notifications'], 'readonly');
		const store = transaction.objectStore('notifications');
		const request = store.get('lastNotificationTime');

		request.onsuccess = event => {
			resolve(event.target.result);
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

async function showNotification(poolTempNow) {
	const options = {
		body: `La piscine est à ${poolTempNow}`,
		icon: '/img/favicon.ico',
		badge: '/img/favicon.ico',
	};

	await self.registration.showNotification('PiPool', options);
	await updateLastNotificationTime(poolTempNow);
}

async function shouldNotificationGetShown(poolTempNow) {
	/*
	// If the current url contains "laptop0072", then we are on dev, so we ALWAYS show the notifications
	if (self.location.href.includes('laptop0072')) {
		return true;
	}
	*/

	// Time check
	const minHour = self.location.href.includes('laptop0072') ? 7 : 9;
	const maxHour = 22;
	const now = new Date();
	const hour = now.getHours();
	if (hour < minHour || hour >= maxHour) {
		return false;
	}

	const thresholdToReceiveNotifications = 22;

	// Too cold to even bother
	if (poolTempNow <= thresholdToReceiveNotifications) {
		return false;
	}

	const lastNotification = await getLastNotificationFromStore();
	// When the user has never received a notification, we want to show one
	if (!lastNotification) {
		return true;
	}

	const lastNotificationTime = lastNotification.timestamp;
	const lastTemp = lastNotification.temp;

	const lastDate = new Date(lastNotificationTime);
	const today = new Date();
	// if the days are different, we want to show the notification
	if (lastDate.getDate() !== today.getDate()) {
		return true;
	}

	// If the temp did not even go up by 0.5 degree, we don't want to spam the user
	return poolTempNow - lastTemp >= 0.5;
}

async function syncDataAndNotify() {
	const poolTempResponse = await fetch('/data/pool?rangeToDisplay=4hours');
	const poolTemp = await poolTempResponse.json();
	const poolTempNow = poolTemp[poolTemp.length - 1].temp;

	if (await shouldNotificationGetShown(poolTempNow)) {
		await showNotification(poolTempNow);
	}
}