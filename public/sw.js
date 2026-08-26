self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
    let data = {};

    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            data = { body: event.data.text() };
        }
    }

    const options = {
        body: data.body || 'Você tem uma nova notificação',
        icon: '/icons/shield-check.svg',
        badge: '/icons/shield-check.svg',
        tag: data.tag || 'default',
        data: {
            url: data.url || '/',
            ...data,
        },
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
        actions: [
            { action: 'open', title: 'Abrir' },
            { action: 'close', title: 'Fechar' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title || 'Notificação',
            options,
        ),
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true,
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            }),
    );
});

self.addEventListener('notificationclose', (event) => {
    console.error('❌ Notificação fechada:', event);
});
