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

		setInterval(() => {
			registration.sync.register('sync-data');
		}, 15 * 60 * 1000);
	}
}