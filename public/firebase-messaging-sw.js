self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const targetUrl = getNotificationTargetUrl(data);

  event.waitUntil(openClientWindow(targetUrl));
});

function getNotificationTargetUrl(data) {
  if (data.paperId) return `/dashboard/papers/${data.paperId}`;
  if (data.journalId) return `/dashboard/journals/${data.journalId}`;
  if (data.topicId) return `/dashboard/topics/${data.topicId}`;

  return "/dashboard/notifications";
}

async function openClientWindow(path) {
  const targetUrl = new URL(path, self.location.origin).href;
  const windows = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of windows) {
    if ("focus" in client) {
      await client.focus();
      if ("navigate" in client) return client.navigate(targetUrl);
      return client;
    }
  }

  return clients.openWindow(targetUrl);
}
