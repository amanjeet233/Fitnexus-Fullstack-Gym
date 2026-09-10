"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { Users, UserCheck, ClipboardCheck, Award, Dumbbell, Activity, Target, Zap, Heart, Flame, Trophy, BarChart3, Sparkles, TrendingUp } from "lucide-react";

const TrainerDashboardBackground = memo(function TrainerDashboardBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Clean Trainer-Themed Gradient Background (Zero Yellow) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #ffffff 60%, #f8fafc 100%)",
            "linear-gradient(225deg, #e0f2fe 0%, #bae6fd 30%, #ffffff 60%, #f0f9ff 100%)",
            "linear-gradient(315deg, #f8fafc 0%, #e0f2fe 40%, #ffffff 70%, #f0f9ff 100%)",
            "linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 30%, #ffffff 60%, #f8fafc 100%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "background" }}
      />
      
      {/* Gym Icons - Crisp Blue / Slate Palettes */}
      {[
        { icon: Dumbbell, size: 120, color: "rgba(14, 165, 233, 0.25)", x: "5%", y: "15%", delay: 0 },
        { icon: Activity, size: 110, color: "rgba(2, 132, 199, 0.25)", x: "90%", y: "20%", delay: 1 },
        { icon: Target, size: 115, color: "rgba(14, 165, 233, 0.22)", x: "10%", y: "70%", delay: 2 },
        { icon: Zap, size: 105, color: "rgba(56, 189, 248, 0.22)", x: "92%", y: "65%", delay: 0.5 },
        { icon: Users, size: 100, color: "rgba(14, 165, 233, 0.2)", x: "45%", y: "5%", delay: 1.5 },
        { icon: Trophy, size: 110, color: "rgba(2, 132, 199, 0.2)", x: "52%", y: "88%", delay: 2.5 },
        { icon: Flame, size: 95, color: "rgba(14, 165, 233, 0.2)", x: "20%", y: "40%", delay: 3 },
        { icon: TrendingUp, size: 100, color: "rgba(2, 132, 199, 0.2)", x: "78%", y: "48%", delay: 3.5 },
        { icon: Award, size: 90, color: "rgba(14, 165, 233, 0.18)", x: "30%", y: "25%", delay: 4 },
        { icon: BarChart3, size: 95, color: "rgba(2, 132, 199, 0.18)", x: "70%", y: "30%", delay: 4.5 },
        { icon: Sparkles, size: 85, color: "rgba(99, 102, 241, 0.18)", x: "15%", y: "55%", delay: 5 },
        { icon: UserCheck, size: 100, color: "rgba(14, 165, 233, 0.18)", x: "85%", y: "55%", delay: 5.5 },
        { icon: ClipboardCheck, size: 90, color: "rgba(2, 132, 199, 0.16)", x: "60%", y: "15%", delay: 6 },
        { icon: Dumbbell, size: 80, color: "rgba(14, 165, 233, 0.16)", x: "40%", y: "75%", delay: 6.5 },
        { icon: Activity, size: 90, color: "rgba(2, 132, 199, 0.16)", x: "65%", y: "80%", delay: 7 },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={`trainer-icon-${i}`}
            className="absolute"
            style={{
              left: item.x,
              top: item.y,
              willChange: "transform",
            }}
            animate={{
              opacity: [0.2, 0.45, 0.2],
              scale: [0.95, 1.1, 0.95],
              rotate: [0, -15, 15, 0],
              y: [0, -25, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 12 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: item.delay,
            }}
          >
            <Icon
              size={item.size}
              style={{
                color: item.color,
                filter: `drop-shadow(0 0 ${item.size / 4}px ${item.color})`,
                opacity: 1,
              }}
            />
          </motion.div>
        );
      })}
      
      {/* Floating Shapes */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`trainer-shape-${i}`}
          className="absolute rounded-full opacity-15 blur-3xl"
          style={{
            width: `${130 + i * 60}px`,
            height: `${130 + i * 60}px`,
            background: `radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, transparent 70%)`,
            left: `${15 + i * 25}%`,
            top: `${10 + i * 25}%`,
            willChange: "transform",
          }}
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 25 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
      
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />
    </div>
  );
});

export default TrainerDashboardBackground;
