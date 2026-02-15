export interface Meeting {
    id: number;
    file_path?: string;
    transcript?: string;
    summary?: string;
    action_items?: string[];
    created_at?: string;
    status: "processing" | "completed" | "failed";
}