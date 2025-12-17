"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { Dumbbell, Activity, Target, Zap, Users, Trophy, Calendar, TrendingUp, Heart, Flame, Award, BarChart3, Sparkles, Circle } from "lucide-react";

const EnhancedAnimatedBackground = memo(function EnhancedAnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Enhanced Dynamic Gradient Background - Blue/White/Green theme */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #e6f1ff 0%, #b3d9ff 25%, #ffffff 50%, #f0f9ff 75%, #e0f2fe 100%)",
            "linear-gradient(225deg, #dbeafe 0%, #bfdbfe 25%, #ffffff 50%, #e6f1ff 75%, #b3d9ff 100%)",
            "linear-gradient(315deg, #f0fdf4 0%, #dcfce7 25%, #ffffff 50%, #f0fdf4 75%, #dcfce7 100%)",
            "linear-gradient(45deg, #e6f1ff 0%, #b3d9ff 25%, #ffffff 50%, #f0f9ff 75%, #e0f2fe 100%)",
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "background" }}
      />
      
      {/* Gym Equipment Icons - Floating - Highly Visible */}
      {[
        { icon: Dumbbell, size: 120, color: "rgba(0, 115, 230, 0.5)", x: "5%", y: "15%", delay: 0 },
        { icon: Activity, size: 110, color: "rgba(34, 197, 94, 0.5)", x: "90%", y: "20%", delay: 1 },
        { icon: Target, size: 115, color: "rgba(0, 115, 230, 0.45)", x: "10%", y: "70%", delay: 2 },
        { icon: Zap, size: 105, color: "rgba(34, 197, 94, 0.45)", x: "92%", y: "65%", delay: 0.5 },
        { icon: Heart, size: 100, color: "rgba(239, 68, 68, 0.4)", x: "45%", y: "5%", delay: 1.5 },
        { icon: Trophy, size: 110, color: "rgba(34, 197, 94, 0.4)", x: "52%", y: "88%", delay: 2.5 },
        { icon: Flame, size: 95, color: "rgba(0, 115, 230, 0.4)", x: "20%", y: "40%", delay: 3 },
        { icon: TrendingUp, size: 100, color: "rgba(34, 197, 94, 0.4)", x: "78%", y: "48%", delay: 3.5 },
        { icon: Award, size: 90, color: "rgba(0, 115, 230, 0.35)", x: "30%", y: "25%", delay: 4 },
        { icon: BarChart3, size: 95, color: "rgba(34, 197, 94, 0.35)", x: "70%", y: "30%", delay: 4.5 },
        { icon: Sparkles, size: 85, color: "rgba(168, 85, 247, 0.35)", x: "15%", y: "55%", delay: 5 },
        { icon: Users, size: 100, color: "rgba(0, 115, 230, 0.35)", x: "85%", y: "55%", delay: 5.5 },
        { icon: Dumbbell, size: 80, color: "rgba(0, 115, 230, 0.3)", x: "60%", y: "15%", delay: 6 },
        { icon: Activity, size: 90, color: "rgba(34, 197, 94, 0.3)", x: "40%", y: "75%", delay: 6.5 },
        { icon: Target, size: 85, color: "rgba(0, 115, 230, 0.3)", x: "65%", y: "80%", delay: 7 },
      ].map((equipment, i) => {
        const Icon = equipment.icon;
        return (
          <motion.div
            key={`enhanced-icon-${i}`}
            className="absolute"
            style={{
              left: equipment.x,
              top: equipment.y,
              willChange: "transform",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.9, 1.2, 0.9],
              rotate: [0, 25, -25, 0],
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 12 + i * 1.5,
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
      
      {/* Floating Shapes - Enhanced */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`enhanced-shape-${i}`}
          className="absolute rounded-full opacity-10 blur-3xl"
          style={{
            width: `${140 + i * 70}px`,
            height: `${140 + i * 70}px`,
            background: `radial-gradient(circle, rgba(0, 115, 230, ${0.15 - i * 0.05}) 0%, transparent 70%)`,
            left: `${18 + i * 30}%`,
            top: `${12 + i * 25}%`,
            willChange: "transform",
          }}
          animate={{
            x: [0, 45, -35, 0],
            y: [0, -38, 28, 0],
            scale: [1, 1.15, 0.92, 1],
          }}
          transition={{
            duration: 30 + i * 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2.5,
          }}
        />
      ))}
      
      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 115, 230, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 115, 230, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "65px 65px",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "65px 65px"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
});

export default EnhancedAnimatedBackground;

