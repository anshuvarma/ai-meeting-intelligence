import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error";

interface Props {
    message: string | null;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: Props) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000); // Auto hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && message && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-6 left-6 z-50 flex items-center gap-4 p-4 pr-12 rounded-2xl shadow-2xl backdrop-blur-md border min-w-[320px] max-w-md"
                    style={{
                        backgroundColor: type === "success" ? "rgba(6, 78, 59, 0.9)" : "rgba(127, 29, 29, 0.9)", // Dark Green / Dark Red
                        borderColor: type === "success" ? "rgba(52, 211, 153, 0.2)" : "rgba(248, 113, 113, 0.2)"
                    }}
                >
                    <div className="shrink-0">
                        {type === "success" ? (
                            <CheckCircle2 size={24} className="text-emerald-400" />
                        ) : (
                            <XCircle size={24} className="text-rose-400" />
                        )}
                    </div>

                    <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${type === "success" ? "text-emerald-100" : "text-rose-100"}`}>
                            {type === "success" ? "Success" : "Error"}
                        </h4>
                        <p className={`text-xs mt-0.5 ${type === "success" ? "text-emerald-200/80" : "text-rose-200/80"}`}>
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>

                    {/* Progress Bar (Optional nice-to-have visual) */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className={`absolute bottom-0 left-0 h-1 ${type === "success" ? "bg-emerald-400" : "bg-rose-400"}`}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
