
import { useEffect, useMemo, useState } from "react";
import { Clock, Loader2, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHistoryList, useHistorySession, useDeleteHistoryItem, useClearHistory, type HistoryItemDto } from "@/hooks/useHistory";
import { useSessionStore } from "@/store/sessionStore";
import HistoryCard from "./HistoryCard";
import { cn } from "@/lib/utils";

const DRAWER_STORAGE_KEY = "mad-history-drawer-open";

interface HistoryDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const HistoryDrawer = ({ isOpen, onOpenChange }: HistoryDrawerProps) => {
    const [search, setSearch] = useState("");

    const { currentSessionId, loadingSession, setLoading, loadSession, setCurrentSessionId } = useSessionStore();

    const { data, isLoading, isError } = useHistoryList();
    const loadSessionMutation = useHistorySession();
    const deleteMutation = useDeleteHistoryItem();
    const clearMutation = useClearHistory();

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.setItem(DRAWER_STORAGE_KEY, String(isOpen));
        } catch {
            // ignore
        }
    }, [isOpen]);

    const filtered = useMemo(() => {
        const items = Array.isArray(data) ? data : [];
        if (!search.trim()) return items;
        const q = search.toLowerCase();
        return items.filter((item: HistoryItemDto) => {
            const lang = item.language?.toLowerCase?.() ?? "";
            return (
                lang.includes(q) ||
                item.snippet.toLowerCase().includes(q) ||
                item.status?.toLowerCase?.().includes(q)
            );
        });
    }, [data, search]);

    const handleSelect = (item: HistoryItemDto) => {
        setCurrentSessionId(item.id);
        setLoading(true);
        loadSessionMutation.mutate(item.id, {
            onSuccess: (session) => {
                loadSession(session);
            },
            onSettled: () => {
                setLoading(false);
            },
        });
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const handleClearAll = () => {
        clearMutation.mutate();
    };

    return (
        <aside
            className={cn(
                "h-full border-l border-border bg-card text-foreground flex flex-col transition-transform duration-300",
                isOpen ? "translate-x-0" : "translate-x-full",
            )}
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-semibold tracking-wide uppercase text-foreground">
                        History
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary"
                    onClick={() => onOpenChange(false)}
                >
                    <span className="text-xs">×</span>
                </Button>
            </div>

            <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by language or code..."
                            className="h-8 pl-7 pr-2 bg-secondary border-border text-xs placeholder:text-muted-foreground font-mono"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={handleClearAll}
                        disabled={clearMutation.isPending || (data?.length ?? 0) === 0}
                        title="Clear all sessions"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <div className="relative flex-1">
                {(isLoading || loadingSession) && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <p className="text-xs text-muted-foreground">
                            {loadingSession ? "Loading session..." : "Loading history..."}
                        </p>
                    </div>
                )}

                <ScrollArea className="h-full px-3 py-3">
                    {isError && (
                        <div className="flex h-40 flex-col items-center justify-center text-center text-xs text-destructive">
                            <p>Failed to load history.</p>
                            <p className="text-muted-foreground mt-1">Check your connection or try again later.</p>
                        </div>
                    )}

                    {!isError && (filtered?.length ?? 0) === 0 && !isLoading && !loadingSession && (
                        <div className="flex h-40 flex-col items-center justify-center text-center">
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                                <Clock className="h-6 w-6" />
                            </div>
                            <p className="text-xs font-medium text-foreground">No bugs fixed yet.</p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                                Start your first debugging session to see it appear here.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        {Array.isArray(filtered) && filtered.map((item) => (
                            <HistoryCard
                                key={item.id}
                                item={item}
                                isActive={item.id === currentSessionId}
                                isDeleting={deleteMutation.isPending}
                                onSelect={() => handleSelect(item)}
                                onDelete={() => handleDelete(item.id)}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </aside>
    );
};

export default HistoryDrawer;
