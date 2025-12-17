"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { progressAPI, workoutAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Award, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function MemberProgressPage() {
  const router = useRouter();
  const [memberId, setMemberId] = useState<string | null>(null);
  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const storedMemberId = localStorage.getItem("memberId");

    if (isAuthenticated !== "true" || role !== "member" || !storedMemberId) {
      router.push("/login");
      return;
    }

    setMemberId(storedMemberId);
    loadData(storedMemberId);
  }, [router]);

  const loadData = async (id: string) => {
    try {
      setLoading(true);
      const [progressRes, workoutsRes] = await Promise.all([
        progressAPI.getByMember(id),
        workoutAPI.getByMember(id),
      ]);
      setProgressEntries(progressRes.data || []);
      setWorkouts(workoutsRes.data || []);
    } catch (error) {
      console.error("Error loading member progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-secondary-500">Loading progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-success-600 to-success-400 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-5xl">🎯</span>
              My Progress
            </h1>
            <p className="text-secondary-500 mt-2 text-lg">
              Track your workout schedule and performance updates shared by your trainer.
            </p>
          </div>
          <button
            onClick={() => router.push("/member/dashboard")}
            className="inline-flex items-center gap-2 rounded-lg border border-secondary-300 bg-white px-4 py-2 text-sm font-medium text-secondary-600 shadow-sm transition hover:border-secondary-400 hover:text-secondary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg border border-primary-100">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="flex items-center gap-2 text-primary-700">
                  <Calendar className="w-5 h-5" />
                  Upcoming Workouts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary-100">
                        <TableHead>Title</TableHead>
                        <TableHead>Focus</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workouts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-secondary-500">
                            No workouts scheduled yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        workouts.map((workout) => (
                          <TableRow key={workout.planId} className="hover:bg-primary-50 transition-colors">
                            <TableCell className="font-medium text-primary-700">
                              {workout.title || "Personal Training"}
                            </TableCell>
                            <TableCell>{workout.focusArea || "General"}</TableCell>
                            <TableCell>
                              {workout.sessionDate
                                ? format(new Date(workout.sessionDate), "MMM dd, yyyy")
                                : "TBD"}
                            </TableCell>
                            <TableCell>
                              {workout.startTime ? `${workout.startTime}` : "--"}
                              {workout.endTime ? ` - ${workout.endTime}` : ""}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg border border-success-100">
              <CardHeader className="bg-gradient-to-r from-success-50 to-secondary-50">
                <CardTitle className="flex items-center gap-2 text-success-700">
                  <Award className="w-5 h-5" />
                  Progress Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary-100">
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Recorded</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {progressEntries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-10 text-secondary-500">
                            No progress entries yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        progressEntries.map((entry) => (
                          <TableRow key={entry.progressId} className="hover:bg-success-50 transition-colors">
                            <TableCell className="font-medium text-success-700">{entry.metric}</TableCell>
                            <TableCell>{entry.value || "--"}</TableCell>
                            <TableCell className="max-w-xs whitespace-pre-wrap">{entry.notes || "--"}</TableCell>
                            <TableCell>
                              {entry.recordedAt
                                ? format(new Date(entry.recordedAt), "MMM dd, yyyy HH:mm")
                                : "Just now"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

