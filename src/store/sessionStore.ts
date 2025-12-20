import { create } from "zustand";

export type SessionStatus = "Success" | "Failed" | "Max attempts reached" | null;

export interface SessionStep {
    attempt_index: number;
    scanner_output: string;
    fixer_output: {
        fixed_code: string;
        change_log: string;
    };
    validator_output: {
        status: "VALID" | "INVALID";
        reasons: string[];
        suggested_feedback_for_fixer: string;
        confidence: number;
    };
    created_at: string;
}

export interface SessionData {
    id: string;
    code: string;
    language: string;
    userDescription?: string;
    terminalError?: string;
    status: SessionStatus;
    steps: SessionStep[];
    initialErrors: {
        id: string;
        line: number | null;
        category: string;
        explanation: string;
        criticality: "low" | "medium" | "high";
    }[];
    validatorFeedback: string;
    finalFix: string;
    createdAt: string;
}

interface SessionState {
    currentSessionId: string | null;
    loadingSession: boolean;
    data: SessionData | null;
    setLoading: (loading: boolean) => void;
    loadSession: (session: SessionData) => void;
    setCurrentSessionId: (id: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    currentSessionId: null,
    loadingSession: false,
    data: null,
    setLoading: (loading) => set({ loadingSession: loading }),
    setCurrentSessionId: (id) => set({ currentSessionId: id }),
    loadSession: (session) => set({
        currentSessionId: session.id,
        data: session,
        loadingSession: false,
    }),
}));
