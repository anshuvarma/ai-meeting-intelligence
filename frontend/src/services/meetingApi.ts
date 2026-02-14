import { Meeting } from "../types/meeting";

const API_BASE = "http://localhost:5000/api/meetings";

export const meetingApi = {
    async getAll(): Promise<Meeting[]> {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error("Failed to fetch meetings");
        return res.json();
    },

    async getById(id: number): Promise<Meeting> {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch meeting");
        return res.json();
    },

    async upload(file: File): Promise<void> {
        const formData = new FormData();
        formData.append("meetingAudio", file);

        const res = await fetch(`${API_BASE}/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
    },

    async delete(id: number): Promise<void> {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error("Delete failed");
    },
};
