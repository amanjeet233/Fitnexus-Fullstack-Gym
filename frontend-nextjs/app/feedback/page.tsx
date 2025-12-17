"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { feedbackAPI, memberAPI, trainerAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  User,
  UserCheck,
  Mail,
} from "lucide-react";
import EnhancedAnimatedBackground from "@/components/EnhancedAnimatedBackground";

export default function FeedbackPage() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipientType: "member", // "member" or "trainer"
    recipientId: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    
    if (isAuthenticated !== "true" || role !== "admin") {
      router.push("/login");
      return;
    }
    
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [membersRes, trainersRes] = await Promise.all([
        memberAPI.getAll(),
        trainerAPI.getAll(),
      ]);
      setMembers(membersRes.data);
      setTrainers(trainersRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId") || "admin";
      const feedbackData = {
        fromRole: "admin",
        fromUserId: userId,
        toRole: formData.recipientType,
        toUserId: formData.recipientId,
        toMemberId: formData.recipientType === "member" ? formData.recipientId : null,
        toTrainerId: formData.recipientType === "trainer" ? formData.recipientId : null,
        subject: formData.subject,
        message: formData.message,
      };

      await feedbackAPI.create(feedbackData);
      alert("Feedback sent successfully!");
      setFormData({
        recipientType: "member",
        recipientId: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      alert("Error sending feedback: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const recipients = formData.recipientType === "member" ? members : trainers;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedAnimatedBackground />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
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
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                💬
              </motion.span>
              Send Feedback
            </h1>
            <p className="text-secondary-600 mt-2 text-lg">
              Send feedback to members and trainers
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="border-neo-300 hover:bg-neo-50 hover:border-neo-400 hover:shadow-neo-md transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-2 border-neo-100 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-neo-50 to-secondary-50">
              <CardTitle className="text-2xl font-bold text-neo-700 flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Compose Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Recipient Type */}
                <div className="space-y-2">
                  <Label htmlFor="recipientType" className="text-neo-700 font-semibold">
                    Send To
                  </Label>
                  <Select
                    id="recipientType"
                    name="recipientType"
                    value={formData.recipientType}
                    onChange={handleChange}
                    className="h-12 border-2 focus:border-neo-400"
                  >
                    <option value="member">Member</option>
                    <option value="trainer">Trainer</option>
                  </Select>
                </div>

                {/* Recipient Selection */}
                <div className="space-y-2">
                  <Label htmlFor="recipientId" className="text-neo-700 font-semibold flex items-center gap-2">
                    {formData.recipientType === "member" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                    Select {formData.recipientType === "member" ? "Member" : "Trainer"}
                  </Label>
                  <Select
                    id="recipientId"
                    name="recipientId"
                    value={formData.recipientId}
                    onChange={handleChange}
                    required
                    className="h-12 border-2 focus:border-neo-400"
                  >
                    <option value="">Select {formData.recipientType === "member" ? "Member" : "Trainer"}</option>
                    {recipients.map((recipient) => (
                      <option key={recipient.id || recipient.trainerId} value={recipient.id || recipient.trainerId}>
                        {recipient.firstName && recipient.lastName
                          ? `${recipient.firstName} ${recipient.lastName} (${recipient.id})`
                          : `${recipient.name} (${recipient.id || recipient.trainerId})`}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-neo-700 font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter feedback subject"
                    required
                    className="h-12 border-2 focus:border-neo-400"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-neo-700 font-semibold">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your feedback message here..."
                    required
                    rows={6}
                    className="border-2 focus:border-neo-400 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-neo-500 to-neo-600 hover:from-neo-600 hover:to-neo-700 shadow-neo-md hover:shadow-neo-lg active:shadow-neo-xl transition-all font-bold"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? "Sending..." : "Send Feedback"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

