"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { attendanceAPI } from "@/lib/api";
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
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

export default function MemberAttendancePage() {
  const router = useRouter();
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const memberId = localStorage.getItem("memberId");

    if (isAuthenticated !== "true" || role !== "member" || !memberId) {
      router.push("/login");
      return;
    }

    loadAttendance(memberId);
  }, [router]);

  const loadAttendance = async (memberId: string) => {
    try {
      const response = await attendanceAPI.getByMember(memberId);
      setAttendance(response.data);
    } catch (error) {
      console.error("Error loading attendance:", error);
    } finally {
      setLoading(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button variant="outline" onClick={() => router.push("/member/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent flex items-center gap-3">
            <span className="text-5xl">📅</span>
            My Attendance History
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
                <Calendar className="w-6 h-6" />
                Attendance Records
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
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-4"
                          >
                            <span className="text-6xl">📭</span>
                            <p className="text-xl text-secondary-500 font-medium">
                              No attendance records found
                            </p>
                          </motion.div>
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
                            <motion.span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                record.status === "present"
                                  ? "bg-success-100 text-success-700"
                                  : record.status === "late"
                                  ? "bg-white border-2 border-neo-400 text-neo-700"
                                  : "bg-accent-100 text-accent-700"
                              }`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {record.status === "present" ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Present
                                </span>
                              ) : record.status === "late" ? (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Late
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />
                                  Absent
                                </span>
                              )}
                            </motion.span>
                          </TableCell>
                          <TableCell>
                            {record.checkInTime || "N/A"}
                          </TableCell>
                          <TableCell>
                            {record.checkOutTime || "N/A"}
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
      </div>
    </div>
  );
}

