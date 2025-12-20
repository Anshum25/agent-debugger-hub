import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2, Code2 } from "lucide-react";
import type { HistoryItemDto } from "@/hooks/useHistory";

interface HistoryCardProps {
    item: HistoryItemDto;
    isActive: boolean;
    isDeleting: boolean;
    onSelect: () => void;
    onDelete: () => void;
}

const languageLabel: Record<string, string> = {
    python: "PY",
    javascript: "JS",
    typescript: "TS",
    java: "JAVA",
    csharp: "C#",
    go: "GO",
    rust: "RS",
};

const formatRelativeTime = (iso: string) => {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (Number.isNaN(diffSec)) return "Unknown";

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const getStatusClasses = (status: HistoryItemDto["status"]) => {
    if (status === "Success") return "bg-success/10 text-success border-success/30";
    if (status === "Failed") return "bg-destructive/10 text-destructive border-destructive/30";
    if (status === "Max attempts reached") return "bg-warning/10 text-warning border-warning/30";
    return "bg-secondary text-muted-foreground border-border";
};

const HistoryCard = memo(({ item, isActive, isDeleting, onSelect, onDelete }: HistoryCardProps) => {
    const lang = item.language?.toLowerCase?.() ?? "";
    const langLabel = (languageLabel[lang] ?? lang.toUpperCase()) || "CODE";

    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                "group relative w-full rounded-xl border px-3 py-2 text-left transition-colors",
                "bg-card border-border hover:bg-secondary/60 hover:border-muted-foreground/30",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                isActive && "border-primary/60 bg-secondary/40 shadow-inner",
            )}
        >
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] uppercase">
                        <Code2 className="h-3 w-3 text-muted-foreground" />
                        <span>{langLabel}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{formatRelativeTime(item.timestamp)}</span>
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        "h-5 px-1.5 text-[10px] font-medium border",
                        "bg-transparent",
                        getStatusClasses(item.status),
                    )}
                >
                    {item.status ?? "Unknown"}
                </Badge>
            </div>

            <p className="line-clamp-1 text-[11px] text-muted-foreground font-mono">
                {item.snippet || "No preview available"}
            </p>

            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-1.5 top-1.5 h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                disabled={isDeleting}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </button>
    );
});

HistoryCard.displayName = "HistoryCard";

export default HistoryCard;
