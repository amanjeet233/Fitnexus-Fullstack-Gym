"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { attendanceAPI, memberAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Calendar } from "lucide-react";

function TrainerAttendanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get("memberId");
  
  const [member, setMember] = useState<any>(null);
  const [status, setStatus] = useState("present");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const trainerId = localStorage.getItem("trainerId");

    if (isAuthenticated !== "true" || role !== "trainer" || !trainerId) {
      router.push("/login");
      return;
    }

    if (memberId) {
      loadMember(memberId);
    } else {
      router.push("/trainer/dashboard");
    }
  }, [router, memberId]);

  const loadMember = async (id: string) => {
    try {
      const response = await memberAPI.getById(id);
      setMember(response.data);
    } catch (error) {
      console.error("Error loading member:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;

    setSaving(true);
    try {
      const trainerId = localStorage.getItem("trainerId");
      const response = await attendanceAPI.mark({
        memberId: memberId,
        trainerId: trainerId,
        status: status,
        attendanceDate: new Date().toISOString().split("T")[0],
      });

      if (response.data.success) {
        alert("Attendance marked successfully!");
        router.push("/trainer/dashboard");
      } else {
        alert("Error: " + (response.data.message || "Failed to mark attendance"));
      }
    } catch (error: any) {
      alert("Error marking attendance: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-5xl">✅</span>
            Mark Attendance
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl border-2 border-primary-100">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
              <CardTitle className="text-2xl font-bold text-primary-700 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Member Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {member && (
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-secondary-500">Member</p>
                  <p className="text-xl font-bold">
                    {member.name || `${member.firstName} ${member.lastName}`}
                  </p>
                  <p className="text-sm text-secondary-500">ID: {member.id}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <input
                    type="date"
                    id="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-neo-400"
                    style={{ backgroundColor: 'white', color: '#0f172a' }}
                  >
                    <option value="present" style={{ backgroundColor: 'white', color: '#0f172a' }}>Present</option>
                    <option value="late" style={{ backgroundColor: 'white', color: '#0f172a' }}>Late</option>
                    <option value="absent" style={{ backgroundColor: 'white', color: '#0f172a' }}>Absent</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/trainer/dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {saving ? "Marking..." : "Mark Attendance"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function TrainerAttendancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary-500">Loading...</div>
      </div>
    }>
      <TrainerAttendanceContent />
    </Suspense>
  );
}

