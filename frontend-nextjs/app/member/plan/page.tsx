"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Calendar, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";

export default function MemberPlanPage() {
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    const memberId = localStorage.getItem("memberId");

    if (isAuthenticated !== "true" || role !== "member" || !memberId) {
      router.push("/login");
      return;
    }

    loadMember(memberId);
  }, [router]);

  const loadMember = async (memberId: string) => {
    try {
      const response = await memberAPI.getById(memberId);
      setMember(response.data);
    } catch (error) {
      console.error("Error loading member:", error);
    } finally {
      setLoading(false);
    }
  };

  const daysUntilExpiry = member?.expiryDate
    ? Math.ceil(
        (new Date(member.expiryDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-5xl">💳</span>
            My Plan Details
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-xl border-2 border-primary-100">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="text-2xl font-bold text-primary-700 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Membership Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-secondary-500">Plan Type</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {member?.memberType || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Amount Paid</p>
                  <p className="text-2xl font-bold text-success-600">
                    ${member?.amountPay?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Payment Status</p>
                  <span
                    className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold ${
                      member?.feesStatus === "Paid"
                        ? "bg-success-100 text-success-700"
                        : "bg-accent-100 text-accent-700"
                    }`}
                  >
                    {member?.feesStatus || "Unpaid"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dates & Expiry */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-2 border-primary-100">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50">
                <CardTitle className="text-2xl font-bold text-primary-700 flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <p className="text-sm text-secondary-500">Registration Date</p>
                  <p className="text-lg font-semibold">
                    {member?.dateRegistered
                      ? format(new Date(member.dateRegistered), "MMM dd, yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Expiry Date</p>
                  <p className="text-lg font-semibold">
                    {member?.expiryDate
                      ? format(new Date(member.expiryDate), "MMM dd, yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Days Remaining</p>
                  <p
                    className={`text-2xl font-bold ${
                      daysUntilExpiry > 7
                        ? "text-success-600"
                        : daysUntilExpiry > 0
                        ? "text-neo-600"
                        : "text-accent-600"
                    }`}
                  >
                    {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : "Expired"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Renewal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="shadow-xl border-2 border-primary-100 bg-gradient-to-r from-primary-50 to-secondary-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary-700 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Renew Membership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600 mb-4">
                  {daysUntilExpiry > 0
                    ? `Your membership expires in ${daysUntilExpiry} days. Renew now to continue enjoying our facilities!`
                    : "Your membership has expired. Please renew to continue using our services."}
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
                  onClick={() => {
                    alert("Renewal feature coming soon! Please contact admin.");
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Renew Membership
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

