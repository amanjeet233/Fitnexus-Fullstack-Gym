"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI, attendanceAPI, workoutAPI, progressAPI, feedbackAPI } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  DollarSign,
  TrendingUp,
  LogOut,
  CreditCard,
  Clock,
  ClipboardCheck,
  Award,
  MessageSquare,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import MemberDashboardBackground from "@/components/MemberDashboardBackground";

export default function MemberDashboardPage() {
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [attendanceStats, setAttendanceStats] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadMemberData = useCallback(async (memberId: string) => {
    try {
      setLoading(true);
      if (!memberId || memberId.trim() === "") {
        console.error("Member ID is missing or empty");
        setMember(null);
        setLoading(false);
        return;
      }

      const [memberRes, statsRes, workoutsRes, progressRes, feedbackRes] = await Promise.all([
        memberAPI.getById(memberId).catch(err => {
          console.error("Error fetching member:", err);
          return { data: null };
        }),
        attendanceAPI.getStats(memberId).catch(() => ({ data: null })),
        workoutAPI.getByMember(memberId).catch(() => ({ data: [] })),
        progressAPI.getByMember(memberId).catch(() => ({ data: [] })),
        feedbackAPI.getByMember(memberId).catch(() => ({ data: [] })),
      ]);

      if (memberRes.data) {
        setMember(memberRes.data);
        setAttendanceStats(statsRes.data);
        setWorkouts(workoutsRes.data || []);
        setProgressEntries(progressRes.data || []);
        setFeedbacks(feedbackRes.data || []);
      } else {
        console.error("Member not found with ID:", memberId);
        setMember(null);
      }
    } catch (error) {
      console.error("Error loading member data:", error);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const memberId = localStorage.getItem("memberId");

    if (isAuthenticated !== "true") {
      router.push("/login");
      return;
    }

    // If not a member, redirect to appropriate dashboard
    if (role !== "member") {
      if (role === "admin") {
        router.push("/dashboard");
      } else if (role === "trainer") {
        router.push("/trainer/dashboard");
      } else {
        router.push("/login");
      }
      return;
    }

    // If member but no memberId, redirect to login
    if (!memberId) {
      console.error("Member ID not found in localStorage");
      localStorage.clear();
      router.push("/login");
      return;
    }

    loadMemberData(memberId);
  }, [router, loadMemberData]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <MemberDashboardBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 border-4 border-neo-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-neo-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!member && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <MemberDashboardBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <Card className="p-8 max-w-md">
            <CardContent className="space-y-4">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-accent-600 mb-2">Member not found</h2>
              <p className="text-secondary-600 mb-4">
                Your member account could not be found. Please contact the administrator.
              </p>
              <Button onClick={handleLogout} className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const daysUntilExpiry = member.expiryDate
    ? Math.ceil(
        (new Date(member.expiryDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <MemberDashboardBackground />
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-neo-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-neo-600 via-neo-500 to-neo-400 bg-clip-text text-transparent"
            >
              My Dashboard
            </motion.h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-neo-500 to-neo-600 text-white border-0 shadow-neo-lg">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">
                Welcome, {member.name || `${member.firstName} ${member.lastName}`}!
              </h2>
              <p className="text-primary-100">
                Member ID: {member.id} | Plan: {member.memberType}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-primary-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plan Type</CardTitle>
                <User className="h-5 w-5 text-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{member.memberType || "N/A"}</div>
                <p className="text-xs text-secondary-500 mt-1">Membership Plan</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-success-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Days Attended</CardTitle>
                <TrendingUp className="h-5 w-5 text-success-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {attendanceStats?.presentDays || member.attendanceCount || 0}
                </div>
                <p className="text-xs text-secondary-500 mt-1">Total attendance</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-accent-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plan Expiry</CardTitle>
                <Calendar className="h-5 w-5 text-accent-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {daysUntilExpiry > 0 ? `${daysUntilExpiry}` : "0"}
                </div>
                <p className="text-xs text-secondary-500 mt-1">
                  {daysUntilExpiry > 0 ? "Days remaining" : "Expired"}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-secondary-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                <DollarSign className="h-5 w-5 text-secondary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {member.feesStatus === "Paid" ? "Paid" : "Unpaid"}
                </div>
                <p className="text-xs text-secondary-500 mt-1">Fee status</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>My Plan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-secondary-500">Plan Type</p>
                  <p className="font-semibold">{member.memberType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Amount</p>
                  <p className="font-semibold">${member.amountPay?.toFixed(2) || "0.00"}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Registration Date</p>
                  <p className="font-semibold">
                    {member.dateRegistered
                      ? format(new Date(member.dateRegistered), "MMM dd, yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Expiry Date</p>
                  <p className="font-semibold">
                    {member.expiryDate
                      ? format(new Date(member.expiryDate), "MMM dd, yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/member/profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => router.push("/member/plan")}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Renew Plan
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/member/progress")}
                  >
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-secondary-500">Present</p>
                    <p className="text-2xl font-bold text-success-600">
                      {attendanceStats?.presentDays || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Absent</p>
                    <p className="text-2xl font-bold text-accent-600">
                      {attendanceStats?.absentDays || 0}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Total Days This Month</p>
                  <p className="text-2xl font-bold">
                    {attendanceStats?.totalDays || 0}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/member/attendance")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View Attendance History
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Card className="shadow-lg border-2 border-neo-200 bg-gradient-to-br from-neo-50 to-white">
            <CardHeader 
              className="bg-gradient-to-r from-neo-100 to-secondary-100 cursor-pointer hover:from-neo-200 hover:to-secondary-200 transition-all"
              onClick={() => setShowAllFeedbacks(!showAllFeedbacks)}
            >
              <CardTitle className="flex items-center justify-between text-neo-700">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Feedback from Admin
                  {feedbacks.filter((f: any) => f.status === "unread").length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      {feedbacks.filter((f: any) => f.status === "unread").length} New
                    </span>
                  )}
                </div>
                {feedbacks.length > 0 && (
                  <motion.div
                    animate={{ rotate: showAllFeedbacks ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-neo-600" />
                  </motion.div>
                )}
              </CardTitle>
            </CardHeader>
            {showAllFeedbacks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-6">
                  {feedbacks.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                      <p className="text-secondary-500">No feedback received yet.</p>
                      <p className="text-sm text-secondary-400 mt-1">Admin feedback will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {feedbacks.map((feedback: any, index: number) => (
                        <motion.div
                          key={feedback.feedbackId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-lg border-2 ${
                            feedback.status === "unread"
                              ? "bg-blue-50 border-blue-200 shadow-md"
                              : "bg-white border-neo-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-neo-700">{feedback.subject}</h4>
                                {feedback.status === "unread" && (
                                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-secondary-500 mb-2">
                                {feedback.createdAt
                                  ? format(new Date(feedback.createdAt), "MMM dd, yyyy 'at' HH:mm")
                                  : "Recently"}
                              </p>
                            </div>
                          </div>
                          <p className="text-secondary-700 whitespace-pre-wrap">{feedback.message}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
            {!showAllFeedbacks && feedbacks.length > 0 && (
              <CardContent className="pt-2 pb-4">
                <p className="text-sm text-secondary-500 text-center">
                  Click to view {feedbacks.length} feedback{feedbacks.length > 1 ? 's' : ''}
                </p>
              </CardContent>
            )}
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg border border-primary-100">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="flex items-center gap-2 text-primary-700">
                  <Calendar className="w-5 h-5" />
                  Upcoming Workout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workouts.length === 0 ? (
                  <p className="text-secondary-500 text-sm">Your trainer has not scheduled a workout yet.</p>
                ) : (
                  <div className="border border-primary-100 rounded-lg p-4 bg-white shadow-sm">
                    <p className="text-sm text-secondary-500">
                      {workouts[0].sessionDate ? format(new Date(workouts[0].sessionDate), "MMM dd, yyyy") : "TBD"}
                    </p>
                    <p className="font-semibold text-primary-700">{workouts[0].title || "Personal Training"}</p>
                    <p className="text-sm text-secondary-600">Focus: {workouts[0].focusArea || "General"}</p>
                    {(workouts[0].startTime || workouts[0].endTime) && (
                      <p className="text-sm text-secondary-500 mt-1">
                        {workouts[0].startTime || "--"} {workouts[0].endTime ? `- ${workouts[0].endTime}` : ""}
                      </p>
                    )}
                    {workouts[0].notes && (
                      <p className="text-sm text-secondary-500 mt-2">{workouts[0].notes}</p>
                    )}
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => router.push("/member/progress")}
                    >
                      View Full Schedule
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="shadow-lg border border-success-100">
              <CardHeader className="bg-gradient-to-r from-success-50 to-secondary-50">
                <CardTitle className="flex items-center gap-2 text-success-700">
                  <Award className="w-5 h-5" />
                  Latest Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {progressEntries.length === 0 ? (
                  <p className="text-secondary-500 text-sm">No progress logs yet. Check back after your next session.</p>
                ) : (
                  <div className="border border-success-100 rounded-lg p-4 bg-white shadow-sm">
                    <p className="text-sm text-secondary-500">
                      {progressEntries[0].recordedAt
                        ? format(new Date(progressEntries[0].recordedAt), "MMM dd, yyyy HH:mm")
                        : "Just now"}
                    </p>
                    <p className="font-semibold text-success-700">{progressEntries[0].metric}</p>
                    {progressEntries[0].value && (
                      <p className="text-sm text-secondary-600">Value: {progressEntries[0].value}</p>
                    )}
                    {progressEntries[0].notes && (
                      <p className="text-sm text-secondary-500 mt-2">{progressEntries[0].notes}</p>
                    )}
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => router.push("/member/progress")}
                    >
                      View All Progress
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

