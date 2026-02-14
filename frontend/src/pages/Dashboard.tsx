import { useEffect, useState } from "react";
import { Upload, Trash2, Eye, Sparkles } from "lucide-react";
import { meetingApi } from "../services/meetingApi";
import { Meeting } from "../types/meeting";
import MeetingModal from "../components/MeetingModal";
import DeleteModal from "../components/DeleteModal";
import Toast, { ToastType } from "../components/Toast";

export default function Dashboard() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Meeting | null>(null);

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
        message: "",
        type: "success",
        isVisible: false,
    });

    // Delete Modal State
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type, isVisible: true });
    };

    const gradients = [
        "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/50",
        "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
        "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
        "bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20 hover:border-rose-500/50",
        "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50",
    ];

    const fetchMeetings = async () => {
        const data = await meetingApi.getAll();
        setMeetings(data);
    };

    useEffect(() => {
        fetchMeetings();
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            await meetingApi.upload(file);
            setFile(null);
            await fetchMeetings();
            showToast("Meeting uploaded and processed successfully", "success");
        } catch (error) {
            console.error("Upload failed:", error);
            showToast("Failed to upload meeting. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await meetingApi.delete(deleteId);
            fetchMeetings();
            showToast("Meeting deleted successfully", "success");
            setDeleteId(null);
        } catch (error) {
            console.error("Delete failed:", error);
            showToast("Failed to delete meeting", "error");
        } finally {
            setIsDeleting(false);
        }
    };


    const handleView = async (id: number) => {
        const data = await meetingApi.getById(id);
        setSelected(data);
    };

    return (
        <div className="h-screen bg-[#0f1115] p-6 flex flex-col overflow-hidden text-slate-200 selection:bg-indigo-500/30">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col h-full px-4 sm:px-6 lg:px-8">
                <div className="shrink-0">
                    <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-2">
                        Meeting Intelligence
                        <Sparkles className="text-cyan-400" />
                    </h1>

                    {/* Upload Section */}
                    {/* Upload Section */}
                    <div
                        className={`
                        relative group
                        bg-[#1a1d24] border-2 border-dashed border-[#2f3542] hover:border-indigo-500/50 hover:bg-[#20242c]
                        rounded-3xl p-12 mb-8 transition-all duration-300
                        flex flex-col items-center justify-center text-center cursor-pointer shadow-lg shadow-black/20
                        ${loading ? "opacity-50 pointer-events-none" : ""}
                    `}
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept=".mp3,.wav"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                    setFile(f);
                                    // Auto upload on select for smoother UX, or state set
                                    // For now, let's just set it and trigger upload if we want, 
                                    // but the prompt implies a design. Let's keep the button separate or auto-upload?
                                    // The design usually implies "drop and it goes" or "drop then click".
                                    // Let's simplify: User clicks box -> selects file -> we show selected state -> user clicks upload.
                                    // Actually, let's persist the 'file' state and show a different UI if file is selected.
                                }
                            }}
                        />

                        {file ? (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in">
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 text-indigo-400 ring-1 ring-indigo-500/20">
                                    <Upload size={32} />
                                </div>
                                <p className="text-lg font-medium text-slate-200 mb-2">
                                    {file.name}
                                </p>
                                <p className="text-slate-400 text-sm mb-6">
                                    Ready to process
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUpload();
                                    }}
                                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
                                >
                                    {loading ? "Processing..." : "Start Upload"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                {/* Icons Pile */}
                                <div className="mb-6 relative">
                                    <Upload className="w-12 h-12 text-slate-600 opacity-50" />
                                </div>

                                <h3 className="text-xl font-medium text-slate-200 mb-2">
                                    Upload file .mp3 or .wav
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    Click to browse or drag and drop
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Meetings List */}
                    {/* Meetings List */}
                </div>

                {/* Meetings List */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-4 pr-2 pb-4">
                    <h2 className="text-xl font-semibold mb-4 text-slate-200 px-2" >
                        Recent Meetings
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20" >
                        {meetings.map((m, i) => (
                            <div
                                key={m.id}
                                className={`group relative p-5 rounded-2xl border transition-all flex flex-col justify-between h-48 shadow-sm hover:shadow-md ${gradients[i % gradients.length]} ${loading
                                        ? "opacity-50 cursor-not-allowed grayscale pointer-events-none"
                                        : "cursor-pointer"
                                    }`}
                                onClick={() => !loading && handleView(m.id)}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-black/20 text-slate-200 border border-white/10">
                                            #{m.id}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg text-slate-100 mb-2 leading-tight group-hover:text-white transition-colors">
                                        Meeting Recording
                                    </h3>
                                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed group-hover:text-slate-300" >
                                        {m.summary || "No summary available yet..."}
                                    </p>
                                </div>

                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!loading) handleView(m.id);
                                        }}
                                        disabled={loading}
                                        className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-colors ring-1 ring-blue-500/20 shadow-lg backdrop-blur-sm"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!loading) setDeleteId(m.id);
                                        }}
                                        disabled={loading}
                                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors ring-1 ring-rose-500/20 shadow-lg backdrop-blur-sm"
                                        title="Delete Meeting"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {meetings.length === 0 && (
                            <div className="text-center py-12 text-slate-600">
                                <p>No meetings found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            < MeetingModal
                meeting={selected}
                onClose={() => setSelected(null)}
            />

            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}