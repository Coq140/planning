import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertBadge } from "@shared/schema";

export function useBadges() {
  return useQuery({
    queryKey: [api.badges.list.path],
    queryFn: async () => {
      const res = await fetch(api.badges.list.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch badges");
      return api.badges.list.responses[200].parse(await res.json());
    },
  });
}

export function useBadge(id: string) { // For public view using qrCodeId
  // Note: The API uses :id in the path, but logic implies looking up by qrCodeId 
  // or ID depending on context. The schema says qrCodeId is unique.
  // Assuming the route /api/badges/:id actually handles the lookup correctly.
  return useQuery({
    queryKey: [api.badges.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.badges.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch badge");
      return api.badges.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBadge) => {
      const validated = api.badges.create.input.parse(data);
      const res = await fetch(api.badges.create.path, {
        method: api.badges.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.badges.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create badge");
      }
      return api.badges.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.badges.list.path] }),
  });
}

export function useScanBadge() {
  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.badges.scan.path, { id });
      const res = await fetch(url, { method: api.badges.scan.method });
      if (!res.ok) throw new Error("Failed to register scan");
      return api.badges.scan.responses[200].parse(await res.json());
    },
  });
}
