import type { User, UserRole } from "@/lib/types";
import { sleep } from "./client";

const DEMO_USER: User = {
  id: "USR-ADMIN-01",
  name: "Dr. Sarah Kimani",
  email: "sarah.kimani@demo.trustline.io",
  organization: "Trustline Evaluation Sandbox",
  role: "admin",
  status: "active",
  lastLogin: new Date().toISOString(),
};

const STORAGE_KEY = "trustline_auth_session";

function getStoredUser(): User | null {
  if (typeof window === "undefined") return DEMO_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEMO_USER; // Default to demo session for instant sandbox access
    return JSON.parse(raw) as User;
  } catch {
    return DEMO_USER;
  }
}

export const authApi = {
  async getCurrentUser(): Promise<User | null> {
    await sleep(60);
    return getStoredUser();
  },

  async login(email?: string, _password?: string): Promise<User> {
    await sleep(200);
    const user: User = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async loginDemo(role: UserRole = "admin"): Promise<User> {
    await sleep(120);
    const user: User = {
      ...DEMO_USER,
      role,
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async setRole(role: UserRole): Promise<User> {
    const current = getStoredUser() || DEMO_USER;
    const updated = { ...current, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async logout(): Promise<void> {
    await sleep(100);
    localStorage.removeItem(STORAGE_KEY);
  },
};
