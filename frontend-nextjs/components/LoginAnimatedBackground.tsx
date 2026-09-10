"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { Dumbbell, Activity, Target, Zap } from "lucide-react";

const LoginAnimatedBackground = memo(function LoginAnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Dynamic Gradient Background - Clean Premium Blue & Slate Gym Theme (Zero Yellow) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #2563eb 70%, #60a5fa 100%)",
            "linear-gradient(225deg, #0284c7 0%, #1e40af 40%, #0f172a 100%)",
            "linear-gradient(315deg, #0f172a 0%, #1e3a8a 40%, #0284c7 80%, #38bdf8 100%)",
            "linear-gradient(45deg, #0f172a 0%, #1e3a8a 35%, #2563eb 70%, #60a5fa 100%)",
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "background" }}
      />
      
      {/* Gym Equipment Icons - Floating with crisp blue/cyan glow */}
      {[
        { icon: Dumbbell, size: 120, color: "rgba(56, 189, 248, 0.4)", x: "10%", y: "20%", delay: 0 },
        { icon: Activity, size: 110, color: "rgba(96, 165, 250, 0.4)", x: "80%", y: "30%", delay: 1 },
        { icon: Target, size: 115, color: "rgba(14, 165, 233, 0.35)", x: "15%", y: "70%", delay: 2 },
        { icon: Zap, size: 105, color: "rgba(129, 140, 248, 0.35)", x: "85%", y: "65%", delay: 0.5 },
        { icon: Dumbbell, size: 100, color: "rgba(56, 189, 248, 0.3)", x: "50%", y: "10%", delay: 1.5 },
        { icon: Activity, size: 95, color: "rgba(96, 165, 250, 0.3)", x: "45%", y: "80%", delay: 2.5 },
        { icon: Target, size: 90, color: "rgba(14, 165, 233, 0.3)", x: "70%", y: "15%", delay: 3 },
        { icon: Zap, size: 85, color: "rgba(129, 140, 248, 0.3)", x: "25%", y: "50%", delay: 3.5 },
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
              opacity: [0.25, 0.55, 0.25],
              scale: [0.9, 1.15, 0.9],
              rotate: [0, 360],
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: equipment.delay,
            }}
          >
            <Icon
              size={equipment.size}
              style={{
                color: equipment.color,
                filter: `drop-shadow(0 0 ${equipment.size / 3}px ${equipment.color})`,
                opacity: 1,
              }}
            />
          </motion.div>
        );
      })}
      
      {/* Animated Gym Shapes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`weight-${i}`}
          className="absolute rounded-full opacity-20 blur-2xl"
          style={{
            width: `${100 + i * 60}px`,
            height: `${100 + i * 60}px`,
            background: `radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)`,
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
            background: "rgba(56, 189, 248, 0.6)",
            left: `${15 + (i * 12)}%`,
            top: `${20 + (i * 10)}%`,
            boxShadow: `0 0 ${6 + i * 2}px rgba(56, 189, 248, 0.8)`,
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
      
      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.3) 2px, transparent 2px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.3) 2px, transparent 2px)
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
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60" />
    </div>
  );
});

export default LoginAnimatedBackground;
