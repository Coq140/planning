import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertSchedule } from "@shared/schema";

export function useSchedule() {
  return useQuery({
    queryKey: [api.schedule.list.path],
    queryFn: async () => {
      const res = await fetch(api.schedule.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch schedule");
      return api.schedule.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateScheduleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSchedule) => {
      const validated = api.schedule.create.input.parse(data);
      const res = await fetch(api.schedule.create.path, {
        method: api.schedule.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create schedule item");
      return api.schedule.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.schedule.list.path] }),
  });
}

export function useUpdateScheduleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertSchedule>) => {
      const validated = api.schedule.update.input.parse(updates);
      const url = buildUrl(api.schedule.update.path, { id });
      const res = await fetch(url, {
        method: api.schedule.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update schedule item");
      return api.schedule.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.schedule.list.path] }),
  });
}

export function useDeleteScheduleItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.schedule.delete.path, { id });
      const res = await fetch(url, { method: api.schedule.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete schedule item");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.schedule.list.path] }),
  });
}
