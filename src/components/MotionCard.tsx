"use client";

import { motion } from "framer-motion";

type MotionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function MotionCard({ children, className }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}