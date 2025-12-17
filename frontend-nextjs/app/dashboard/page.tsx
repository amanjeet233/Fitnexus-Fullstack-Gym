"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI, paymentAPI, trainerAPI } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  UserCheck,
  TrendingUp,
  LogOut,
  UserPlus,
  List,
  CreditCard,
  UserCog,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import EnhancedAnimatedBackground from "@/components/EnhancedAnimatedBackground";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPayments: 0,
    activeTrainers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [membersRes, paymentsRes, trainersRes] = await Promise.all([
        memberAPI.getAll(),
        paymentAPI.getAll(),
        trainerAPI.getAll(),
      ]);

      const members = membersRes.data;
      const payments = paymentsRes.data;
      const trainers = trainersRes.data;

      const revenue = payments.reduce(
        (sum: number, p: any) => sum + (p.amountPay || 0),
        0
      );

      setStats({
        totalMembers: members.length,
        totalPayments: payments.length,
        activeTrainers: trainers.length,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    
    if (isAuthenticated !== "true") {
      router.push("/login");
      return;
    }
    
    // Redirect based on role - only admin should see this dashboard
    if (role === "member") {
      router.push("/member/dashboard");
      return;
    } else if (role === "trainer") {
      router.push("/trainer/dashboard");
      return;
    }

    // Only load stats for admin
    loadStats();
  }, [router, loadStats]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const menuItems = [
    {
      title: "Add Member",
      emoji: "➕",
      description: "Register a new gym member",
      icon: UserPlus,
      href: "/members/new",
      color: "bg-gradient-to-br from-neo-400 to-neo-500",
      hoverColor: "hover:from-neo-500 hover:to-neo-600 hover:shadow-neo-lg",
    },
    {
      title: "Member List",
      emoji: "📋",
      description: "View all registered members",
      icon: List,
      href: "/members",
      color: "bg-gradient-to-br from-neo-500 to-neo-600",
      hoverColor: "hover:from-neo-600 hover:to-neo-700 hover:shadow-neo-lg",
    },
    {
      title: "Manage Member",
      emoji: "✏️",
      description: "Edit or update member details",
      icon: UserCog,
      href: "/members",
      color: "bg-gradient-to-br from-neo-600 to-neo-700",
      hoverColor: "hover:from-neo-700 hover:to-neo-800 hover:shadow-neo-lg",
    },
    {
      title: "Payment",
      emoji: "💳",
      description: "Manage member payments",
      icon: CreditCard,
      href: "/payments",
      color: "bg-gradient-to-br from-neo-500 to-neo-600",
      hoverColor: "hover:from-neo-600 hover:to-neo-700 hover:shadow-neo-lg",
    },
    {
      title: "Trainer",
      emoji: "👨‍🏫",
      description: "Manage trainers",
      icon: UserCheck,
      href: "/trainers",
      color: "bg-gradient-to-br from-neo-600 to-neo-700",
      hoverColor: "hover:from-neo-700 hover:to-neo-800 hover:shadow-neo-lg",
    },
    {
      title: "Feedback",
      emoji: "💬",
      description: "Send feedback to members and trainers",
      icon: MessageSquare,
      href: "/feedback",
      color: "bg-gradient-to-br from-neo-500 to-neo-600",
      hoverColor: "hover:from-neo-600 hover:to-neo-700 hover:shadow-neo-lg",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <EnhancedAnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <motion.div
            className="w-16 h-16 border-4 border-neo-200 border-t-neo-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-neo-600 font-semibold text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedAnimatedBackground />

      {/* Header */}
      <motion.header 
        className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-neo-200/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-neo-500 to-neo-600 flex items-center justify-center shadow-neo-md"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                <span className="text-2xl">💪</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-neo-600 via-neo-500 to-neo-400 bg-clip-text text-transparent"
              >
                FitNexus
              </motion.h1>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 border-neo-300 hover:bg-neo-50 hover:border-neo-400 hover:shadow-neo-md transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="relative border-l-4 border-l-neo-500 hover:shadow-neo-lg transition-all duration-300 overflow-hidden group bg-white/90 backdrop-blur-sm">
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary-700">
                  Total Members
                </CardTitle>
                <Users className="h-5 w-5 text-neo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neo-600">
                  {stats.totalMembers}
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  Active members
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="relative border-l-4 border-l-success-500 hover:shadow-lg transition-all duration-300 overflow-hidden group bg-white/90 backdrop-blur-sm">
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary-700">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-5 w-5 text-success-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success-600">
                  ₹{stats.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  Total Revenue (INR)
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="relative border-l-4 border-l-neo-500 hover:shadow-neo-lg transition-all duration-300 overflow-hidden group bg-white/90 backdrop-blur-sm">
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary-700">
                  Payments
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-neo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neo-600">
                  {stats.totalPayments}
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  Total transactions
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="relative border-l-4 border-l-secondary-500 hover:shadow-lg transition-all duration-300 overflow-hidden group bg-white/90 backdrop-blur-sm">
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-secondary-700">
                  Trainers
                </CardTitle>
                <UserCheck className="h-5 w-5 text-secondary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-600">
                  {stats.activeTrainers}
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  Active trainers
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="h-1 w-12 bg-gradient-to-r from-neo-500 to-neo-400 rounded-full"
              animate={{
                width: [48, 96, 48],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary-800 to-neo-600 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <motion.div
              className="h-1 flex-1 bg-gradient-to-r from-neo-400 to-transparent rounded-full"
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.6 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                >
                  <Card
                    className="relative cursor-pointer hover:shadow-neo-lg active:shadow-neo-xl transition-all duration-300 border-2 hover:border-neo-400 active:border-neo-500 overflow-hidden group bg-white/90 backdrop-blur-sm"
                    onClick={() => router.push(item.href)}
                  >
                    {/* Simple Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardHeader className="relative">
                      <div
                        className={`${item.color} ${item.hoverColor} w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-neo-lg transition-all duration-300 relative overflow-hidden`}
                      >
                        <span className="text-3xl mr-2 relative z-10">{item.emoji}</span>
                        <Icon className="w-7 h-7 text-white relative z-10" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-secondary-800 group-hover:text-neo-600 transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-base mt-2 text-secondary-600">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-neo-600 font-semibold group-hover:text-neo-700 transition-colors">
                        Open Now
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

