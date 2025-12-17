"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI, workoutAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Calendar, ClipboardList, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface WorkoutForm {
  memberId: string;
  title: string;
  focusArea: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export default function TrainerWorkoutsPage() {
  const router = useRouter();
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<WorkoutForm>({
    memberId: "",
    title: "",
    focusArea: "",
    sessionDate: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const trainer = localStorage.getItem("trainerId");

    if (isAuthenticated !== "true" || role !== "trainer" || !trainer) {
      router.push("/login");
      return;
    }

    setTrainerId(trainer);
    loadData(trainer);
  }, [router]);

  const loadData = async (trainer: string) => {
    try {
      setLoading(true);
      const [membersRes, workoutsRes] = await Promise.all([
        memberAPI.getAll(),
        workoutAPI.getByTrainer(trainer),
      ]);

      const assignedMembers = membersRes.data.filter(
        (member: any) => member.trainerId === trainer
      );
      setMembers(assignedMembers);
      setWorkouts(workoutsRes.data || []);
    } catch (error) {
      console.error("Error loading workout data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof WorkoutForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerId) return;

    if (!formData.memberId || !formData.sessionDate) {
      alert("Please select a member and session date.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        trainerId,
        sessionDate: formData.sessionDate,
      };
      const response = await workoutAPI.create(payload);
      if (response.data.success) {
        alert("Workout scheduled successfully!");
        setFormData({
          memberId: "",
          title: "",
          focusArea: "",
          sessionDate: "",
          startTime: "",
          endTime: "",
          notes: "",
        });
        loadData(trainerId);
      } else {
        alert(response.data.message || "Failed to schedule workout");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (planId: number) => {
    if (!confirm("Delete this workout plan?")) return;
    try {
      await workoutAPI.delete(planId);
      if (trainerId) {
        loadData(trainerId);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-secondary-500">Loading workouts...</div>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent flex items-center gap-3">
              <span className="text-5xl">🗓️</span>
              Workout Schedule
            </h1>
            <p className="text-secondary-500 mt-2 text-lg">
              Plan workouts for your assigned members and keep them on track.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/trainer/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="border border-primary-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-700">
                  <ClipboardList className="w-5 h-5" />
                  Schedule New Workout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-600">Member *</label>
                    <Select
                      value={formData.memberId}
                      onChange={(event) => handleChange("memberId", event.target.value)}
                    >
                      <option value="">Select member</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name || `${member.firstName} ${member.lastName}`}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-600">Session Title</label>
                    <Input
                      placeholder="e.g., Upper Body Strength"
                      value={formData.title}
                      onChange={(event) => handleChange("title", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-600">Focus Area</label>
                    <Input
                      placeholder="e.g., Chest & Triceps"
                      value={formData.focusArea}
                      onChange={(event) => handleChange("focusArea", event.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-600">Session Date *</label>
                      <Input
                        type="date"
                        value={formData.sessionDate}
                        onChange={(event) => handleChange("sessionDate", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-600">Start Time</label>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(event) => handleChange("startTime", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-secondary-600">End Time</label>
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(event) => handleChange("endTime", event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-600">Notes</label>
                    <Textarea
                      placeholder="Outline exercises, reps, and reminders..."
                      value={formData.notes}
                      onChange={(event) => handleChange("notes", event.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? "Saving..." : "Save Workout"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg border border-primary-100">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="flex items-center gap-2 text-primary-700">
                  <Calendar className="w-5 h-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary-100">
                        <TableHead>Member</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Focus</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {workouts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-secondary-500">
                            No workouts scheduled yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        workouts.map((workout) => (
                          <TableRow key={workout.planId} className="hover:bg-primary-50 transition-colors">
                            <TableCell className="font-medium text-primary-700">
                              {members.find((m) => m.id === workout.memberId)?.name || workout.memberId}
                            </TableCell>
                            <TableCell>{workout.title || "Personal Training"}</TableCell>
                            <TableCell>{workout.focusArea || "General"}</TableCell>
                            <TableCell>
                              {workout.sessionDate ? format(new Date(workout.sessionDate), "MMM dd, yyyy") : "TBD"}
                            </TableCell>
                            <TableCell>
                              {workout.startTime ? `${workout.startTime}` : "--"}
                              {workout.endTime ? ` - ${workout.endTime}` : ""}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleDelete(workout.planId)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
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

