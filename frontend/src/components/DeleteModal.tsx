import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, isDeleting }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#1a1d24] w-full max-w-md rounded-2xl shadow-2xl shadow-black/50 border border-[#2f3542] p-6 relative overflow-hidden"
                    >
                        {/* Background Gradient Blob */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-rose-500/20">
                                <Trash2 size={32} className="text-rose-500" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-100 mb-2">
                                Delete Meeting?
                            </h3>

                            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                                Are you sure you want to delete this meeting? This action cannot be undone and all associated data will be lost.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-500 transition-colors shadow-lg shadow-rose-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
