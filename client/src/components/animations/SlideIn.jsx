import { motion } from "framer-motion";

export default function SlideIn({ children, direction = "left", delay = 0 }) {
  const directions = {
    left: { x: -50 },
    right: { x: 50 },
    up: { y: 50 },
    down: { y: -50 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.6, -0.05, 0.01, 0.99],
      }}
    >
      {children}
    </motion.div>
  );
}

