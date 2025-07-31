"use client"
import { useState, useEffect } from 'react';

// Particle component
interface ParticleProps {
  size: number;
  positionX: number;
  positionY: number;
  duration: number;
  delay: number;
}

const Particle: React.FC<ParticleProps> = ({ size, positionX, positionY, duration, delay }) => {
  const animationStyle = {
    width: `${size}px`,
    height: `${size}px`,
    left: `${positionX}%`,
    top: `${positionY}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  };

  return (
    <div 
      className="absolute rounded-full bg-white bg-opacity-20 animate-float"
      style={animationStyle}
    />
  );
};

// SVG wave path as a constant
const wavePath = "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,160C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

// Wave component for the animated waves
const Wave: React.FC<{ delay: number, opacity: number, bottom: number }> = ({ delay, opacity, bottom }) => {
  const svgString = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'><path fill='white' fill-opacity='0.1' d='${wavePath}'></path></svg>`;

  return (
    <div 
      className="absolute w-full h-24 bg-repeat-x animate-wave"
      style={{ 
        backgroundImage: `url("${svgString}")`,
        backgroundSize: '1440px 100px',
        opacity: opacity,
        bottom: `${bottom}%`,
        animationDelay: `${delay}s`, 
        animationDirection: delay === 0 ? 'normal' : 'reverse'
      }}
    />
  );
};

// Main App component
const SkillBridgeWelcome = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    const particleCount = 50;
    const newParticles: ParticleProps[] = Array.from({ length: particleCount }).map(() => ({
      size: Math.random() * 15 + 5,
      positionX: Math.random() * 100,
      positionY: Math.random() * 100,
      duration: Math.random() * 30 + 15,
      delay: Math.random() * 15
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 relative">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
        }
        @keyframes wave {
          0% { background-position-x: 0; }
          100% { background-position-x: 1440px; }
        }
        .animate-float { 
          animation: float 20s linear infinite; 
        }
        .animate-wave { 
          animation: wave 20s linear infinite; 
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 1s ease-out forwards;
        }
        .animate-fadeIn-delay {
          animation: fadeIn 1s ease-out 0.5s forwards;
          opacity: 0;
        }
        .animate-fadeUp {
          animation: fadeUp 1s ease-out 1s forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Wave delay={0} opacity={0.3} bottom={0} />
      <Wave delay={5} opacity={0.5} bottom={10} />
      <Wave delay={8} opacity={0.2} bottom={5} />

      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <Particle 
            key={index}
            size={particle.size}
            positionX={particle.positionX}
            positionY={particle.positionY}
            duration={particle.duration}
            delay={particle.delay}
          />
        ))}
      </div>

      <div className="relative z-10 text-center p-8">
        <div className="inline-block text-4xl font-bold tracking-wider mb-2 animate-fadeIn">
          Skill<span className="text-yellow-400">Bridge</span>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-6 animate-slideUp">
          Welcome
        </h1>

        <p className="text-2xl font-light text-white mb-12 animate-fadeIn-delay">
          Your journey to mastery begins here
        </p>

        <button className="px-14 py-5 text-xl font-semibold bg-yellow-400 text-gray-800 rounded uppercase tracking-wider shadow-lg transform transition duration-300 opacity-0 translate-y-5 animate-fadeUp hover:translate-y-1 hover:shadow-xl relative overflow-hidden group">
          Get Started
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute -left-full top-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform transition-all duration-1000 ease-out group-hover:left-full" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SkillBridgeWelcome;