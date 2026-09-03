import type { Notification } from "@/lib/types";
import { notifications } from "@/data/dataset";
import { sleep } from "./client";

let notificationsStore = [...notifications];

export const notificationsApi = {
  async getNotifications(): Promise<Notification[]> {
    await sleep(80);
    return [...notificationsStore];
  },

  async markAsRead(id: string): Promise<void> {
    await sleep(50);
    const index = notificationsStore.findIndex((n) => n.id === id);
    if (index !== -1) {
      notificationsStore[index] = { ...notificationsStore[index]!, read: true };
    }
  },

  async markAllAsRead(): Promise<void> {
    await sleep(80);
    notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
  },
};
