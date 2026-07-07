import { motion } from 'framer-motion';

const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#F8F4EC]" />
      
      {/* Aurora blob 1 */}
      <motion.div
        className="absolute"
        style={{
          width: '70vw',
          height: '70vw',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(233,162,76,0.18) 0%, rgba(215,185,142,0.08) 50%, transparent 70%)',
          top: '-20%',
          left: '-10%',
          filter: 'blur(40px)',
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 60, 30, 0],
          scale: [1, 1.2, 0.9, 1],
          rotate: [0, 30, -15, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Aurora blob 2 */}
      <motion.div
        className="absolute"
        style={{
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(215,185,142,0.15) 0%, rgba(233,162,76,0.06) 50%, transparent 70%)',
          top: '30%',
          right: '-15%',
          filter: 'blur(50px)',
        }}
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 40, -50, 0],
          scale: [1, 0.85, 1.15, 1],
          rotate: [0, -20, 40, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Aurora blob 3 */}
      <motion.div
        className="absolute"
        style={{
          width: '50vw',
          height: '50vw',
          borderRadius: '40%',
          background: 'radial-gradient(ellipse, rgba(233,162,76,0.12) 0%, rgba(248,244,236,0) 70%)',
          bottom: '-10%',
          left: '20%',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.3, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-40" />
    </div>
  );
};

export default AuroraBackground;
