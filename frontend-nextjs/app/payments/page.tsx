"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { paymentAPI, memberAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ArrowLeft,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import EnhancedAnimatedBackground from "@/components/EnhancedAnimatedBackground";

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [member, setMember] = useState<any>(null);
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const loadPayments = useCallback(async () => {
    try {
      const response = await paymentAPI.getAll();
      setPayments(response.data);
    } catch (error) {
      console.error("Error loading payments:", error);
    }
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/login");
      return;
    }
    loadPayments();
  }, [router, loadPayments]);

  const handleSearch = useCallback(async () => {
    if (!searchId.trim()) return;

    setLoading(true);
    try {
      const memberResponse = await memberAPI.getById(searchId);
      setMember(memberResponse.data);
    } catch (error: any) {
      alert("Member not found: " + (error.response?.data?.message || error.message));
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, [searchId]);

  const handlePayment = async () => {
    if (!member) {
      alert("Please search for a member first");
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentDate = new Date().toISOString().split("T")[0];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      const dueDateStr = dueDate.toISOString().split("T")[0];

      const paymentData = {
        memberId: member.id,
        memberName: `${member.firstName} ${member.lastName}`,
        memberType: member.memberType,
        amountPay: member.amountPay,
        paymentDate: paymentDate + "T00:00:00",
        dueDate: dueDateStr + "T00:00:00",
      };
      const response = await paymentAPI.create(paymentData);
      if (response.data.success) {
        alert("Payment recorded successfully!");
        loadPayments();
        handleSearch();
      } else {
        alert("Error: " + (response.data.message || "Failed to record payment"));
      }
    } catch (error: any) {
      alert("Error recording payment: " + (error.response?.data?.message || error.message));
    } finally {
      setPaymentLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedAnimatedBackground />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neo-600 to-neo-400 bg-clip-text text-transparent flex items-center gap-3">
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                💳
              </motion.span>
              Payment Management
            </h1>
            <p className="text-secondary-500 mt-2 text-lg">
              Manage member payments and track dues
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ 
              scale: 1.05, 
              y: -3,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ 
              scale: 0.95, 
              y: 0,
              transition: { duration: 0.1 }
            }}
          >
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="hover:bg-secondary-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-gradient-to-br from-neo-50 via-white to-secondary-50 border-2 border-neo-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-neo-700 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Member
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="memberId" className="font-semibold text-secondary-700">
                    Member ID
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="memberId"
                      placeholder="🔍 Enter member ID"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="h-12 border-2 focus:border-neo-400 transition-all"
                    />
                    <motion.div 
                      whileHover={{ 
                        scale: 1.05, 
                        y: -3,
                        transition: { duration: 0.2, ease: "easeOut" }
                      }} 
                      whileTap={{ 
                        scale: 0.95, 
                        y: 0,
                        transition: { duration: 0.1 }
                      }}
                    >
                      <Button
                        onClick={handleSearch}
                        disabled={loading}
                        className="h-12 px-6 bg-gradient-to-r from-neo-500 to-neo-600 hover:from-neo-600 hover:to-neo-700 shadow-neo-md hover:shadow-neo-lg active:shadow-neo-xl transition-all"
                      >
                        <Search className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {member && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="space-y-4 pt-4 border-t-2 border-neo-200"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-neo-100 to-secondary-100 p-3 rounded-lg"
                    >
                      <p className="text-xs text-secondary-500 font-medium">Member ID</p>
                      <p className="font-bold text-neo-700 text-lg">{member.id}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <p className="text-xs text-secondary-500 font-medium">Today</p>
                      <p className="font-semibold text-lg">{format(new Date(), "yyyy-MM-dd")}</p>
                    </motion.div>
                    <div className="pt-2 space-y-3">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-xs text-secondary-500 font-medium">Member Name</p>
                        <p className="font-bold text-lg">
                          {member.firstName} {member.lastName}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-xs text-secondary-500 font-medium">Member Type</p>
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-neo-100 text-neo-700 mt-1">
                          {member.memberType}
                        </span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-xs text-secondary-500 font-medium">Amount Pay</p>
                        <p className="font-bold text-success-600 text-xl">
                          ₹{member.amountPay?.toFixed(2) || "0.00"}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <p className="text-xs text-secondary-500 font-medium">Payment Date</p>
                        <p className="font-medium">
                          {member.paymentDate
                            ? format(new Date(member.paymentDate), "MMM dd, yyyy")
                            : "Not Paid"}
                        </p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <p className="text-xs text-secondary-500 font-medium">Status</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                            member.paymentDate
                              ? "bg-success-100 text-success-700"
                              : "bg-accent-100 text-accent-700"
                          }`}
                        >
                          {member.paymentDate ? "✅ Paid" : "❌ Not Paid"}
                        </span>
                      </motion.div>
                    </div>
                    <motion.div
                      whileHover={{ 
                        scale: 1.05, 
                        y: -3,
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                      whileTap={{ 
                        scale: 0.95, 
                        y: 0,
                        transition: { duration: 0.1 }
                      }}
                    >
                      <Button
                        onClick={handlePayment}
                        disabled={paymentLoading}
                        className="w-full h-12 bg-gradient-to-r from-neo-500 to-neo-600 hover:from-neo-600 hover:to-neo-700 shadow-neo-md hover:shadow-neo-lg active:shadow-neo-xl transition-all font-bold"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {paymentLoading ? "Processing..." : "Record Payment"}
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl border-2 border-neo-100">
              <CardHeader className="bg-gradient-to-r from-neo-50 to-secondary-50">
                <CardTitle className="text-2xl font-bold text-neo-700 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-neo-50 to-secondary-50">
                      <TableRow className="border-b-2 border-neo-200">
                        <TableHead className="font-bold text-neo-700">ID</TableHead>
                        <TableHead className="font-bold text-neo-700">Member Name</TableHead>
                        <TableHead className="font-bold text-neo-700">Type</TableHead>
                        <TableHead className="font-bold text-neo-700">Amount</TableHead>
                        <TableHead className="font-bold text-neo-700">Payment Date</TableHead>
                        <TableHead className="font-bold text-neo-700">Due Date</TableHead>
                        <TableHead className="font-bold text-neo-700">Days Remaining</TableHead>
                        <TableHead className="font-bold text-neo-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center gap-4"
                            >
                              <span className="text-6xl">💳</span>
                              <p className="text-xl text-secondary-500 font-medium">
                                No payments found
                              </p>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        payments.map((payment, index) => (
                          <motion.tr
                            key={payment.paymentId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-neo-50 transition-colors border-b border-secondary-100"
                          >
                            <TableCell className="font-semibold text-neo-600">
                              {payment.memberId}
                            </TableCell>
                            <TableCell className="font-medium">{payment.memberName}</TableCell>
                            <TableCell>
                              <motion.span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                  payment.memberType === "Premium"
                                    ? "bg-gradient-to-r from-neo-100 to-neo-200 text-neo-800"
                                    : payment.memberType === "Plus"
                                    ? "bg-gradient-to-r from-success-100 to-success-200 text-success-800"
                                    : "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800"
                                }`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {payment.memberType}
                              </motion.span>
                            </TableCell>
                            <TableCell className="font-bold text-success-600 text-lg">
                              ₹{payment.amountPay?.toFixed(2) || "0.00"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {payment.paymentDate
                                ? format(new Date(payment.paymentDate), "MMM dd, yyyy")
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {payment.dueDate
                                ? format(new Date(payment.dueDate), "MMM dd, yyyy")
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <motion.span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                  payment.status === "Overdue"
                                    ? "bg-accent-100 text-accent-700"
                                    : payment.status === "Due Soon"
                                    ? "bg-white border-2 border-neo-400 text-neo-700"
                                    : "bg-success-100 text-success-700"
                                }`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {payment.dayRemaining || "N/A"}
                              </motion.span>
                            </TableCell>
                            <TableCell>
                              <motion.span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                  payment.status === "Overdue"
                                    ? "bg-accent-100 text-accent-700"
                                    : payment.status === "Due Soon"
                                    ? "bg-white border-2 border-neo-400 text-neo-700"
                                    : "bg-success-100 text-success-700"
                                }`}
                                whileHover={{ scale: 1.1 }}
                              >
                                {payment.status || "N/A"}
                              </motion.span>
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
    </div>
  );
}

