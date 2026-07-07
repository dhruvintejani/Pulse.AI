import { motion } from 'framer-motion';

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 6 + 2,
  duration: Math.random() * 10 + 8,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.4 + 0.1,
}));

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-[#F8F4EC]" />
      
      {/* Gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(233,162,76,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.id % 3 === 0
              ? `rgba(233, 162, 76, ${p.opacity})`
              : p.id % 3 === 1
              ? `rgba(215, 185, 142, ${p.opacity})`
              : `rgba(212, 133, 58, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 3}px rgba(233, 162, 76, ${p.opacity * 0.5})`,
          }}
          animate={{
            y: [0, -40, 20, -30, 0],
            x: [0, 20, -15, 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity * 0.5, p.opacity * 1.5, p.opacity],
            scale: [1, 1.3, 0.8, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* Large soft orbs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(233,162,76,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '20%',
          left: '10%',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-0 dot-grid opacity-25" />
    </div>
  );
};

export default ParticleBackground;
