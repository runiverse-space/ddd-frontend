import { ref, onUnmounted } from "vue";

const notifications = ref([]);
let eventSource = null;

export function useNotificationStream() {
  const connect = (userId) => {
    if (eventSource) return;

    eventSource = new EventSource(`http://localhost:8080/api/project-activity/subscribe?userId=${userId}`);

    eventSource.addEventListener("project-participation", (event) => {
      notifications.value.push(JSON.parse(event.data));
    });

    eventSource.addEventListener("participation-response", (event) => {
      notifications.value.push(JSON.parse(event.data));
    });

    eventSource.addEventListener("project-invitation", (event) => {
      notifications.value.push(JSON.parse(event.data));
    });

    // eventSource.addEventListener("schedule-assignment", (event) => {
    //   notifications.value.push(JSON.parse(event.data));
    // });

    eventSource.onerror = (e) => {
      console.error("SSE 오류:", e);
      eventSource.close();
      eventSource = null;
    };
  };

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return { notifications, connect, disconnect };
}
