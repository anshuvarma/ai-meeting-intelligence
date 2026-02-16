import { Meeting } from "../types/meeting";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    meeting: Meeting | null;
    onClose: () => void;
}

export default function MeetingModal({ meeting, onClose }: Props) {
    return (
        <AnimatePresence>
            {meeting && (
                <motion.div
                    initial={{ opacity: 0 }
                    }
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#1a1d24] w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl shadow-black/50 border border-[#2f3542] flex flex-col relative overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#2f3542] flex items-center justify-between shrink-0 bg-[#1a1d24] z-10">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                {(() => {
                                    // Format: Meeting-DD/MM/YYYY
                                    const dateObj = meeting.created_at ? new Date(meeting.created_at) : new Date();
                                    const day = String(dateObj.getDate()).padStart(2, '0');
                                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                                    const year = dateObj.getFullYear();

                                    return `Meeting-${day}/${month}/${year}`;
                                })()}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-[#252a33] text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-8 space-y-8 text-sm overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-slate-500 font-bold mb-3 uppercase text-xs tracking-wider">Summary</p>
                                    <div className="p-5 rounded-xl bg-[#0f1115] border border-[#2f3542] text-slate-300 leading-relaxed shadow-inner text-base">
                                        {meeting.summary}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-slate-500 font-bold mb-3 uppercase text-xs tracking-wider">Action Items</p>
                                    <div className="p-5 rounded-xl bg-[#0f1115] border border-[#2f3542] text-slate-300 shadow-inner h-full">
                                        <ul className="list-none pl-1 space-y-3">
                                            {(meeting.action_items || []).map((a, i) => (
                                                <li key={i} className="flex gap-3 items-start">
                                                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5" />
                                                    <span className="text-base">{a}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-slate-500 font-bold mb-3 uppercase text-xs tracking-wider">Transcript</p>
                                <div className="p-6 rounded-xl bg-[#0f1115] border border-[#2f3542] text-slate-400 leading-relaxed font-mono text-sm shadow-inner whitespace-pre-wrap">
                                    {meeting.transcript}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}