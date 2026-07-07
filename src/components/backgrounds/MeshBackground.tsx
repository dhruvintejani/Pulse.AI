import { motion } from 'framer-motion';

const MeshBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-[#F8F4EC]" />
      
      {/* Mesh gradients */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 15% 50%, rgba(233,162,76,0.2) 0%, transparent 45%),
            radial-gradient(ellipse at 85% 20%, rgba(215,185,142,0.15) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 85%, rgba(233,162,76,0.1) 0%, transparent 45%)
          `,
        }}
        animate={{
          opacity: [0.8, 1, 0.9, 0.8],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moving orb 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(233,162,76,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{
          x: ['10vw', '60vw', '30vw', '10vw'],
          y: ['10vh', '40vh', '70vh', '10vh'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moving orb 2 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(215,185,142,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          x: ['70vw', '20vw', '80vw', '70vw'],
          y: ['60vh', '20vh', '80vh', '60vh'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
      />

      {/* Light beams */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '2px',
              height: '100vh',
              background: 'linear-gradient(180deg, transparent, rgba(233,162,76,0.4), transparent)',
              left: `${25 + i * 25}%`,
              top: 0,
              filter: 'blur(3px)',
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleX: [0.5, 2, 0.5],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Line grid */}
      <div className="absolute inset-0 line-grid opacity-30" />
    </div>
  );
};

export default MeshBackground;
