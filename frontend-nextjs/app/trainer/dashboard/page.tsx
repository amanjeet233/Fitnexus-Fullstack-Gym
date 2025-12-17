"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI, trainerAPI, workoutAPI, progressAPI, feedbackAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserCheck,
  LogOut,
  CheckCircle,
  Calendar,
  MessageSquare,
  Bell,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import TrainerDashboardBackground from "@/components/TrainerDashboardBackground";

export default function TrainerDashboardPage() {
  const router = useRouter();
  const [trainer, setTrainer] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [progressUpdates, setProgressUpdates] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [showAllFeedbacks, setShowAllFeedbacks] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const trainerId = localStorage.getItem("trainerId");

    if (isAuthenticated !== "true" || role !== "trainer" || !trainerId) {
      router.push("/login");
      return;
    }

    loadTrainerData(trainerId);
  }, [router]);

  const loadTrainerData = async (trainerId: string) => {
    try {
      setLoading(true);
      const [trainerRes, membersRes, workoutsRes, progressRes, feedbackRes] = await Promise.all([
        trainerAPI.getById(trainerId),
        memberAPI.getAll(),
        workoutAPI.getByTrainer(trainerId),
        progressAPI.getByTrainer(trainerId),
        feedbackAPI.getByTrainer(trainerId),
      ]);

      setTrainer(trainerRes.data);
      // Filter members assigned to this trainer
      const assignedMembers = membersRes.data.filter(
        (m: any) => m.trainerId === trainerId
      );
      setMembers(assignedMembers);
      setWorkouts(workoutsRes.data || []);
      setProgressUpdates(progressRes.data || []);
      setFeedbacks(feedbackRes.data || []);
    } catch (error) {
      console.error("Error loading trainer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleMarkAttendance = (memberId: string) => {
    router.push(`/trainer/attendance?memberId=${memberId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <TrainerDashboardBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            className="w-16 h-16 border-4 border-neo-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-neo-600 font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TrainerDashboardBackground />
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-neo-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
            >
              Trainer Dashboard
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
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">
                Welcome, {trainer?.name || "Trainer"}!
              </h2>
              <p className="text-primary-100">
                Trainer ID: {trainer?.id} | Specialization: {trainer?.specialization}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-primary-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assigned Members</CardTitle>
                <Users className="h-5 w-5 text-primary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
                <p className="text-xs text-secondary-500 mt-1">Total members</p>
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
                <CardTitle className="text-sm font-medium">Experience</CardTitle>
                <UserCheck className="h-5 w-5 text-success-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trainer?.experience || 0}</div>
                <p className="text-xs text-secondary-500 mt-1">Years</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-secondary-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Calendar className="h-5 w-5 text-secondary-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workouts.length}
                </div>
                <p className="text-xs text-secondary-500 mt-1">Scheduled workouts</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="border border-primary-100 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🗓️</span>
                <div>
                  <p className="text-sm text-secondary-500">Workout Schedule</p>
                  <p className="font-semibold text-primary-700">Plan upcoming sessions</p>
                </div>
              </div>
              <Button onClick={() => router.push("/trainer/workouts")}>
                Manage Schedule
              </Button>
            </CardContent>
          </Card>
          <Card className="border border-success-100 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📈</span>
                <div>
                  <p className="text-sm text-secondary-500">Progress Tracking</p>
                  <p className="font-semibold text-success-700">Record member milestones</p>
                </div>
              </div>
              <Button onClick={() => router.push("/trainer/progress")}>
                Record Progress
              </Button>
            </CardContent>
          </Card>
          <Card className="border border-secondary-100 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📋</span>
                <div>
                  <p className="text-sm text-secondary-500">Attendance</p>
                  <p className="font-semibold text-secondary-700">Mark daily presence</p>
                </div>
              </div>
              <Button onClick={() => router.push("/trainer/attendance")}>Mark Attendance</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assigned Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>My Assigned Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Plan Type</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-secondary-500">
                          No members assigned
                        </TableCell>
                      </TableRow>
                    ) : (
                      members.map((member, index) => (
                        <motion.tr
                          key={member.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TableCell className="font-medium">{member.id}</TableCell>
                          <TableCell>
                            {member.name ||
                              `${member.firstName} ${member.lastName}`}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                member.memberType === "Premium"
                                  ? "bg-primary-100 text-primary-700"
                                  : member.memberType === "Plus"
                                  ? "bg-success-100 text-success-700"
                                  : "bg-secondary-100 text-secondary-700"
                              }`}
                            >
                              {member.memberType}
                            </span>
                          </TableCell>
                          <TableCell>{member.attendanceCount || 0} days</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                member.status === "active"
                                  ? "bg-success-100 text-success-700"
                                  : "bg-accent-100 text-accent-700"
                              }`}
                            >
                              {member.status || "active"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => router.push(`/trainer/member/${member.id}`)}
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleMarkAttendance(member.id)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Attendance
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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

        {/* Workout Schedule Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
        >
          <Card className="shadow-md border border-primary-100">
            <CardHeader>
              <CardTitle>Upcoming Workouts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workouts.length === 0 ? (
                <p className="text-secondary-500 text-sm">
                  No workouts scheduled. Create one from the Manage Schedule card.
                </p>
              ) : (
                workouts.slice(0, 4).map((workout) => (
                  <div
                    key={workout.planId}
                    className="border border-primary-100 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-secondary-500">{workout.sessionDate ? new Date(workout.sessionDate).toLocaleDateString() : "TBD"}</p>
                        <p className="font-semibold text-primary-700">{workout.title || "Personal Training"}</p>
                        <p className="text-sm text-secondary-600">Focus: {workout.focusArea || "General"}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/trainer/member/${workout.memberId}`)}>
                        View Member
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border border-success-100">
            <CardHeader>
              <CardTitle>Recent Progress Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressUpdates.length === 0 ? (
                <p className="text-secondary-500 text-sm">No progress entries yet. Record milestones to keep members motivated.</p>
              ) : (
                progressUpdates.slice(0, 4).map((entry) => (
                  <div
                    key={entry.progressId}
                    className="border border-success-100 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-secondary-500">{entry.recordedAt ? new Date(entry.recordedAt).toLocaleString() : "Just now"}</p>
                        <p className="font-semibold text-success-700">{entry.metric}</p>
                        <p className="text-sm text-secondary-600">Value: {entry.value}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => router.push(`/trainer/member/${entry.memberId}`)}>
                        Member Profile
                      </Button>
                    </div>
                    {entry.notes && <p className="text-sm text-secondary-500 mt-2">{entry.notes}</p>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

