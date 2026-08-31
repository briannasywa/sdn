import { motion } from 'framer-motion';

/**
 * Re-usable Anti-Gravity Floating Card Component
 * Creates smooth weightless levitation effect with soft ambient shadows
 */
export const FloatingCard = ({
  children,
  className = '',
  duration = 5,
  delay = 0,
  glow = false,
  interactiveHover = true,
  yDistance = -10,
}) => {
  return (
    <motion.div
      animate={{
        y: [0, yDistance, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: delay,
      }}
      whileHover={
        interactiveHover
          ? {
              y: yDistance - 6,
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' },
            }
          : undefined
      }
      className={`
        relative bg-white/90 backdrop-blur-md rounded-2xl p-6
        border border-emerald-100/60
        shadow-float hover:shadow-float-lg
        transition-all duration-300
        ${glow ? 'ring-2 ring-emerald-400/30 shadow-glow' : ''}
        ${className}
      `}
    >
      {/* Decorative anti-gravity subtle glow aura */}
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-lg -z-10 pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
};

export default FloatingCard;
