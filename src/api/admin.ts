import type { AuditEvent, HealthComponent, User, UserRole } from "@/lib/types";
import { auditEvents, organizations, users } from "@/data/dataset";
import { sleep } from "./client";

let userStore = [...users];
let auditStore = [...auditEvents];

export const adminApi = {
  async getUsers(): Promise<User[]> {
    await sleep(120);
    return [...userStore];
  },

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    await sleep(150);
    const index = userStore.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    userStore[index] = { ...userStore[index]!, role };

    auditStore.unshift({
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Dr. Sarah Kimani",
      action: `Updated role for ${userStore[index]!.name} to ${role.toUpperCase()}`,
      entity: "User",
      entityId: id,
      result: "success",
    });

    return userStore[index]!;
  },

  async toggleUserStatus(id: string): Promise<User> {
    await sleep(150);
    const index = userStore.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    const newStatus = userStore[index]!.status === "active" ? "suspended" : "active";
    userStore[index] = { ...userStore[index]!, status: newStatus };

    auditStore.unshift({
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Dr. Sarah Kimani",
      action: `Changed status for ${userStore[index]!.name} to ${newStatus.toUpperCase()}`,
      entity: "User",
      entityId: id,
      result: "success",
    });

    return userStore[index]!;
  },

  async inviteUser(data: { name: string; email: string; organization: string; role: UserRole }): Promise<User> {
    await sleep(200);
    const newUser: User = {
      id: `USR-${String(userStore.length + 1).padStart(3, "0")}`,
      name: data.name,
      email: data.email,
      organization: data.organization,
      role: data.role,
      status: "invited",
      lastLogin: new Date().toISOString(),
    };
    userStore.push(newUser);

    auditStore.unshift({
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Dr. Sarah Kimani",
      action: `Invited new user ${newUser.name} (${newUser.email})`,
      entity: "User",
      entityId: newUser.id,
      result: "success",
    });

    return newUser;
  },

  async getOrganizations() {
    await sleep(100);
    return [...organizations];
  },

  async getSystemHealth(): Promise<HealthComponent[]> {
    await sleep(120);
    return [
      { name: "Inference API Gateway", status: "operational", latencyMs: 24, detail: "FastAPI inference layer healthy" },
      { name: "Credit Risk Scoring Engine", status: "operational", latencyMs: 38, detail: "XGBoost v1.4.0 active" },
      { name: "PostgreSQL Data Store", status: "operational", latencyMs: 12, detail: "Replica lag 0.02s" },
      { name: "Alternative Data Ingestion Bus", status: "operational", latencyMs: 45, detail: "M-Pesa & banking feeds synchronized" },
      { name: "Automated Report Generator", status: "operational", latencyMs: 18, detail: "Worker pool idle" },
    ];
  },

  async getAuditEvents(params?: { search?: string; entity?: string }): Promise<AuditEvent[]> {
    await sleep(150);
    let filtered = [...auditStore];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.action.toLowerCase().includes(q) ||
          e.user.toLowerCase().includes(q) ||
          e.entityId.toLowerCase().includes(q),
      );
    }

    if (params?.entity && params.entity !== "all") {
      filtered = filtered.filter((e) => e.entity === params.entity);
    }

    return filtered;
  },
};
