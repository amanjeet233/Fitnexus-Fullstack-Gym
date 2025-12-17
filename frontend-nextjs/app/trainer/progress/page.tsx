"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI, progressAPI } from "@/lib/api";
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
import { ArrowLeft, Award, ClipboardCheck, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ProgressForm {
  memberId: string;
  metric: string;
  value: string;
  notes: string;
}

export default function TrainerProgressPage() {
  const router = useRouter();
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [progressEntries, setProgressEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProgressForm>({
    memberId: "",
    metric: "",
    value: "",
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
      const [membersRes, progressRes] = await Promise.all([
        memberAPI.getAll(),
        progressAPI.getByTrainer(trainer),
      ]);

      const assignedMembers = membersRes.data.filter(
        (member: any) => member.trainerId === trainer
      );
      setMembers(assignedMembers);
      setProgressEntries(progressRes.data || []);
    } catch (error) {
      console.error("Error loading progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProgressForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!trainerId) return;
    if (!formData.memberId || !formData.metric) {
      alert("Please select a member and enter a metric.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        trainerId,
      };
      const response = await progressAPI.create(payload);
      if (response.data.success) {
        alert("Progress saved!");
        setFormData({
          memberId: "",
          metric: "",
          value: "",
          notes: "",
        });
        loadData(trainerId);
      } else {
        alert(response.data.message || "Failed to save progress");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (progressId: number) => {
    if (!confirm("Delete this progress entry?")) return;
    try {
      await progressAPI.delete(progressId);
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
              <span className="text-5xl">📈</span>
              Member Progress
            </h1>
            <p className="text-secondary-500 mt-2 text-lg">
              Record achievements and share feedback to keep members motivated.
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
            <Card className="border border-success-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success-700">
                  <ClipboardCheck className="w-5 h-5" />
                  Record Progress
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
                    <label className="text-sm font-medium text-secondary-600">Metric *</label>
                    <Input
                      placeholder="e.g., Bench press, Body fat %"
                      value={formData.metric}
                      onChange={(event) => handleChange("metric", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-600">Value</label>
                    <Input
                      placeholder="e.g., 60 kg x 10 reps"
                      value={formData.value}
                      onChange={(event) => handleChange("value", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-600">Notes</label>
                    <Textarea
                      placeholder="Add feedback, technique notes, or goals..."
                      value={formData.notes}
                      onChange={(event) => handleChange("notes", event.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? "Saving..." : "Save Progress"}
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
            <Card className="shadow-lg border border-success-100">
              <CardHeader className="bg-gradient-to-r from-success-50 to-secondary-50">
                <CardTitle className="flex items-center gap-2 text-success-700">
                  <Award className="w-5 h-5" />
                  Recent Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary-100">
                        <TableHead>Member</TableHead>
                        <TableHead>Metric</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Recorded</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {progressEntries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-secondary-500">
                            No progress recorded yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        progressEntries.map((entry) => (
                          <TableRow key={entry.progressId} className="hover:bg-success-50 transition-colors">
                            <TableCell className="font-medium text-success-700">
                              {members.find((m) => m.id === entry.memberId)?.name || entry.memberId}
                            </TableCell>
                            <TableCell>{entry.metric}</TableCell>
                            <TableCell>{entry.value}</TableCell>
                            <TableCell className="max-w-xs whitespace-pre-wrap">{entry.notes || "--"}</TableCell>
                            <TableCell>
                              {entry.recordedAt ? format(new Date(entry.recordedAt), "MMM dd, yyyy HH:mm") : "Just now"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleDelete(entry.progressId)}>
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

