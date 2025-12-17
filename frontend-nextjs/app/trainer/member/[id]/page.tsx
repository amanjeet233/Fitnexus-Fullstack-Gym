"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI, attendanceAPI, workoutAPI, progressAPI } from "@/lib/api";
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
import { ArrowLeft, User, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function TrainerMemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  const [member, setMember] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMemberData = useCallback(async () => {
    try {
      const [memberRes, attendanceRes, workoutsRes, progressRes] = await Promise.all([
        memberAPI.getById(memberId),
        attendanceAPI.getByMember(memberId),
        workoutAPI.getByMember(memberId),
        progressAPI.getByMember(memberId),
      ]);

      setMember(memberRes.data);
      setAttendance(attendanceRes.data);
      setWorkouts(workoutsRes.data || []);
      setProgressEntries(progressRes.data || []);
    } catch (error) {
      console.error("Error loading member data:", error);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const trainerId = localStorage.getItem("trainerId");

    if (isAuthenticated !== "true" || role !== "trainer" || !trainerId) {
      router.push("/login");
      return;
    }

    loadMemberData();
  }, [router, loadMemberData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button variant="outline" onClick={() => router.push("/trainer/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent flex items-center gap-3">
            <span className="text-5xl">👤</span>
            Member Details
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Member Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-xl border-2 border-primary-100">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="text-xl font-bold text-primary-700 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Member Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-secondary-500">Name</p>
                  <p className="font-bold text-lg">
                    {member?.name || `${member?.firstName} ${member?.lastName}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Member ID</p>
                  <p className="font-semibold">{member?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Plan Type</p>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-primary-100 text-primary-700 mt-1">
                    {member?.memberType}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Email</p>
                  <p className="font-medium">{member?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Phone</p>
                  <p className="font-medium">{member?.phoneNum || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Total Attendance</p>
                  <p className="text-2xl font-bold text-success-600">
                    {member?.attendanceCount || 0} days
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => router.push(`/trainer/attendance?memberId=${memberId}`)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Attendance
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendance History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl border-2 border-primary-100">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="text-xl font-bold text-primary-700 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Attendance History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                      <TableRow className="border-b-2 border-primary-200">
                        <TableHead className="font-bold text-primary-700">Date</TableHead>
                        <TableHead className="font-bold text-primary-700">Status</TableHead>
                        <TableHead className="font-bold text-primary-700">Check In</TableHead>
                        <TableHead className="font-bold text-primary-700">Check Out</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12">
                            <p className="text-secondary-500">No attendance records</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        attendance.map((record, index) => (
                          <motion.tr
                            key={record.attendanceId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-primary-50 transition-colors border-b border-secondary-100"
                          >
                            <TableCell className="font-medium">
                              {record.attendanceDate
                                ? format(new Date(record.attendanceDate), "MMM dd, yyyy")
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                  record.status === "present"
                                    ? "bg-success-100 text-success-700"
                                    : record.status === "late"
                                    ? "bg-white border-2 border-neo-400 text-neo-700"
                                    : "bg-accent-100 text-accent-700"
                                }`}
                              >
                                {record.status || "N/A"}
                              </span>
                            </TableCell>
                            <TableCell>{record.checkInTime || "N/A"}</TableCell>
                            <TableCell>{record.checkOutTime || "N/A"}</TableCell>
                          </motion.tr>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="shadow-lg border border-primary-100">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
              <CardTitle className="text-lg font-bold text-primary-700">
                Upcoming Workouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workouts.length === 0 ? (
                <p className="text-secondary-500 text-sm">No workouts scheduled for this member.</p>
              ) : (
                workouts.map((workout) => (
                  <div
                    key={workout.planId}
                    className="border border-primary-100 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <p className="text-sm text-secondary-500">
                      {workout.sessionDate ? format(new Date(workout.sessionDate), "MMM dd, yyyy") : "TBD"}
                    </p>
                    <p className="font-semibold text-primary-700">{workout.title || "Personal Training"}</p>
                    <p className="text-sm text-secondary-600">Focus: {workout.focusArea || "General"}</p>
                    {(workout.startTime || workout.endTime) && (
                      <p className="text-sm text-secondary-500 mt-1">
                        {workout.startTime || "--"} {workout.endTime ? `- ${workout.endTime}` : ""}
                      </p>
                    )}
                    {workout.notes && (
                      <p className="text-sm text-secondary-500 mt-2">{workout.notes}</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-success-100">
            <CardHeader className="bg-gradient-to-r from-success-50 to-secondary-50">
              <CardTitle className="text-lg font-bold text-success-700">
                Recent Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressEntries.length === 0 ? (
                <p className="text-secondary-500 text-sm">No progress updates recorded yet.</p>
              ) : (
                progressEntries.map((entry) => (
                  <div
                    key={entry.progressId}
                    className="border border-success-100 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <p className="text-sm text-secondary-500">
                      {entry.recordedAt ? format(new Date(entry.recordedAt), "MMM dd, yyyy HH:mm") : "Just now"}
                    </p>
                    <p className="font-semibold text-success-700">{entry.metric}</p>
                    {entry.value && <p className="text-sm text-secondary-600">Value: {entry.value}</p>}
                    {entry.notes && <p className="text-sm text-secondary-500 mt-2">{entry.notes}</p>}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

