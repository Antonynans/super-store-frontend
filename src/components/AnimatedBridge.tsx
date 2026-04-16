import { motion, AnimatePresence } from "framer-motion";

const AnimatedBadge = ({ value }: { value: number }) => {
  return (
    <AnimatePresence mode="wait">
      {value > 0 && (
        <motion.span
          key={value} 
          initial={{ scale: 0.5, opacity: 0, y: -5 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {value}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export default AnimatedBadge;