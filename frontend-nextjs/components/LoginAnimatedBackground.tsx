"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { Dumbbell, Activity, Target, Zap } from "lucide-react";

const LoginAnimatedBackground = memo(function LoginAnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Dynamic Gradient Background - Gym themed colors */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)",
            "linear-gradient(225deg, #e6f1ff 0%, #b3d9ff 25%, #ffffff 50%, #f0f9ff 75%, #e0f2fe 100%)",
            "linear-gradient(315deg, #065f46 0%, #10b981 25%, #34d399 50%, #6ee7b7 75%, #a7f3d0 100%)",
            "linear-gradient(45deg, #1e3a8a 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "background" }}
      />
      
      {/* Gym Equipment Icons - Floating - Highly Visible */}
      {[
        { icon: Dumbbell, size: 120, color: "rgba(59, 130, 246, 0.6)", x: "10%", y: "20%", delay: 0 },
        { icon: Activity, size: 110, color: "rgba(34, 197, 94, 0.6)", x: "80%", y: "30%", delay: 1 },
        { icon: Target, size: 115, color: "rgba(16, 185, 129, 0.6)", x: "15%", y: "70%", delay: 2 },
        { icon: Zap, size: 105, color: "rgba(168, 85, 247, 0.6)", x: "85%", y: "65%", delay: 0.5 },
        { icon: Dumbbell, size: 100, color: "rgba(59, 130, 246, 0.5)", x: "50%", y: "10%", delay: 1.5 },
        { icon: Activity, size: 95, color: "rgba(34, 197, 94, 0.5)", x: "45%", y: "80%", delay: 2.5 },
        { icon: Target, size: 90, color: "rgba(16, 185, 129, 0.5)", x: "70%", y: "15%", delay: 3 },
        { icon: Zap, size: 85, color: "rgba(168, 85, 247, 0.5)", x: "25%", y: "50%", delay: 3.5 },
      ].map((equipment, i) => {
        const Icon = equipment.icon;
        return (
          <motion.div
            key={`equipment-${i}`}
            className="absolute"
            style={{
              left: equipment.x,
              top: equipment.y,
              willChange: "transform",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [0.9, 1.2, 0.9],
              rotate: [0, 360],
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: equipment.delay,
            }}
          >
            <Icon
              size={equipment.size}
              style={{
                color: equipment.color,
                filter: `drop-shadow(0 0 ${equipment.size / 2}px ${equipment.color}) drop-shadow(0 0 ${equipment.size / 4}px ${equipment.color})`,
                opacity: 1,
              }}
            />
          </motion.div>
        );
      })}
      
      {/* Animated Gym Equipment Shapes - Weights/Dumbbells */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`weight-${i}`}
          className="absolute rounded-full opacity-20 blur-2xl"
          style={{
            width: `${100 + i * 60}px`,
            height: `${100 + i * 60}px`,
            background: `radial-gradient(circle, ${
              i === 0 ? "rgba(59, 130, 246, 0.4)" : i === 1 ? "rgba(34, 197, 94, 0.4)" : "rgba(16, 185, 129, 0.4)"
            } 0%, transparent 70%)`,
            left: `${10 + i * 35}%`,
            top: `${15 + i * 25}%`,
            willChange: "transform",
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
      
      {/* Floating Energy Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
            background: i % 2 === 0 ? "rgba(59, 130, 246, 0.6)" : "rgba(34, 197, 94, 0.6)",
            left: `${15 + (i * 12)}%`,
            top: `${20 + (i * 10)}%`,
            boxShadow: `0 0 ${6 + i * 2}px ${i % 2 === 0 ? "rgba(59, 130, 246, 0.8)" : "rgba(34, 197, 94, 0.8)"}`,
            willChange: "transform",
          }}
          animate={{
            y: [0, -100, -200, -300],
            x: [0, Math.sin(i) * 30, Math.cos(i) * 30, 0],
            opacity: [0.6, 1, 0.8, 0],
            scale: [1, 1.5, 1.2, 0.5],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.5,
          }}
        />
      ))}
      
      {/* Animated Grid Pattern - Fitness Theme */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 2px, transparent 2px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 2px, transparent 2px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "50px 50px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
    </div>
  );
});

export default LoginAnimatedBackground;

