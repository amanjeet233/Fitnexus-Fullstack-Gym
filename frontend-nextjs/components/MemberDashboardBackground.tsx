"use client";

import { motion } from "framer-motion";
import { memo } from "react";
import { User, Trophy, Calendar, TrendingUp, Dumbbell, Activity, Target, Heart, Flame, Award, BarChart3, Sparkles, Zap } from "lucide-react";

const MemberDashboardBackground = memo(function MemberDashboardBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Member-themed Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(135deg, #e6f1ff 0%, #b3d9ff 25%, #ffffff 50%, #f0f9ff 75%, #e0f2fe 100%)",
            "linear-gradient(225deg, #dbeafe 0%, #bfdbfe 25%, #ffffff 50%, #e6f1ff 75%, #b3d9ff 100%)",
            "linear-gradient(315deg, #f0f9ff 0%, #e0f2fe 25%, #ffffff 50%, #dbeafe 75%, #bfdbfe 100%)",
            "linear-gradient(45deg, #e6f1ff 0%, #b3d9ff 25%, #ffffff 50%, #f0f9ff 75%, #e0f2fe 100%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "background" }}
      />
      
      {/* Member-themed Gym Icons - Enhanced */}
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
        { icon: User, size: 100, color: "rgba(0, 115, 230, 0.35)", x: "85%", y: "55%", delay: 5.5 },
        { icon: Calendar, size: 90, color: "rgba(0, 115, 230, 0.3)", x: "60%", y: "15%", delay: 6 },
        { icon: Dumbbell, size: 80, color: "rgba(0, 115, 230, 0.3)", x: "40%", y: "75%", delay: 6.5 },
        { icon: Activity, size: 90, color: "rgba(34, 197, 94, 0.3)", x: "65%", y: "80%", delay: 7 },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={`member-icon-${i}`}
            className="absolute"
            style={{
              left: item.x,
              top: item.y,
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
              delay: item.delay,
            }}
          >
            <Icon
              size={item.size}
              style={{
                color: item.color,
                filter: `drop-shadow(0 0 ${item.size / 2}px ${item.color}) drop-shadow(0 0 ${item.size / 4}px ${item.color})`,
                opacity: 1,
              }}
            />
          </motion.div>
        );
      })}
      
      {/* Floating Shapes */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute rounded-full opacity-10 blur-2xl"
          style={{
            width: `${120 + i * 50}px`,
            height: `${120 + i * 50}px`,
            background: `radial-gradient(circle, rgba(0, 115, 230, ${0.2 - i * 0.05}) 0%, transparent 70%)`,
            left: `${20 + i * 20}%`,
            top: `${15 + i * 20}%`,
            willChange: "transform",
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 25 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
      
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 115, 230, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 115, 230, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
});

export default MemberDashboardBackground;

