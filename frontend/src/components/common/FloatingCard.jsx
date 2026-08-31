import { motion } from 'framer-motion';

/**
 * Anti-Gravity FloatingCard Component
 * Implements ultra-smooth levitation and spring-loaded hover reactions
 */
export const FloatingCard = ({
  children,
  className = '',
  duration = 5,
  delay = 0,
  glow = false,
  interactiveHover = true,
  isStatic = false, // If true, disable constant floating loop but keep hover
}) => {
  return (
    <motion.div
      animate={
        isStatic
          ? undefined
          : {
              y: [-8, 8, -8],
            }
      }
      transition={
        isStatic
          ? undefined
          : {
              duration: duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: delay,
            }
      }
      whileHover={
        interactiveHover
          ? {
              y: -10,
              scale: 1.02,
              transition: { type: 'spring', stiffness: 300 },
            }
          : undefined
      }
      className={`
        relative bg-white rounded-3xl p-8
        border border-slate-100
        shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]
        hover:shadow-[0_30px_60px_rgba(20,_184,_166,_0.12)]
        transition-shadow duration-300
        ${glow ? 'ring-2 ring-teal-400/20' : ''}
        ${className}
      `}
    >
      {glow && (
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/10 via-emerald-400/10 to-teal-400/10 rounded-3xl blur-xl -z-10 pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
};

export default FloatingCard;
