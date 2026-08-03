import { motion } from 'framer-motion';

// ===== VARIANTES DE ANIMACIÓN =====
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// ===== COMPONENTES CON ANIMACIÓN =====
export const AnimatedSection = ({ children, animation = fadeInUp, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animation}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCard = ({ children, className = "", onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.3 }}
      className={`transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedButton = ({ children, onClick, className = "", variant = "primary" }) => {
  const variants = {
    primary: "bg-club-green hover:bg-club-green-light text-white",
    secondary: "bg-club-orange hover:bg-club-orange-light text-white",
    danger: "bg-club-red hover:bg-club-red-light text-white",
    outline: "border-2 border-club-green text-club-green hover:bg-club-green hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${variants[variant] || variants.primary} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export const LoadingSpinner = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-club-green border-t-transparent rounded-full"
    />
  );
};