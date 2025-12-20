import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { SessionData } from "@/store/sessionStore";

export interface HistoryItemDto {
    id: string;
    language: string;
    status: "Success" | "Failed" | "Max attempts reached" | null;
    snippet: string;
    timestamp: string;
}

const api = axios.create({
    baseURL: "/api",
});

function normalizeHistoryResponse(data: unknown): HistoryItemDto[] {
    if (Array.isArray(data)) return data as HistoryItemDto[];
    if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        const candidates = [obj.history, obj.data, obj.items, obj.sessions];
        for (const c of candidates) {
            if (Array.isArray(c)) return c as HistoryItemDto[];
        }
    }
    return [];
}

export function useHistoryList() {
    return useQuery<HistoryItemDto[]>({
        queryKey: ["history"],
        queryFn: async () => {
            const res = await api.get("/history");
            return normalizeHistoryResponse(res.data);
        },
    });
}

export function useHistorySession() {
    return useMutation({
        mutationKey: ["session"],
        mutationFn: async (id: string) => {
            const res = await api.get<SessionData>(`/session/${id}`);
            return res.data;
        },
    });
}

export function useDeleteHistoryItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/history/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },
    });
}

export function useClearHistory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await api.delete("/history");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["history"] });
        },
    });
}
