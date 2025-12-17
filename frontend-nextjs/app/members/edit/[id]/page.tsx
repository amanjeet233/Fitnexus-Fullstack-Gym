"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI, trainerAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import EnhancedAnimatedBackground from "@/components/EnhancedAnimatedBackground";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phoneNum: "",
    email: "",
    address: "",
    amountPay: "",
    memberType: "",
    trainer: "",
  });
  const [trainers, setTrainers] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const loadTrainers = useCallback(async () => {
    try {
      const response = await trainerAPI.getAll();
      setTrainers(response.data);
    } catch (error) {
      console.error("Error loading trainers:", error);
    }
  }, []);

  const loadMember = useCallback(async () => {
    try {
      const response = await memberAPI.getById(id);
      const member = response.data;
      setFormData({
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        gender: member.gender || "",
        phoneNum: member.phoneNum || "",
        email: member.email || "",
        address: member.address || "",
        amountPay: member.amountPay?.toString() || "",
        memberType: member.memberType || "",
        trainer: member.trainerId || "",
      });
    } catch (error: any) {
      alert("Error loading member: " + (error.response?.data?.message || error.message));
      router.push("/members");
    }
  }, [id, router]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/login");
      return;
    }
    loadTrainers();
    loadMember();
  }, [router, loadTrainers, loadMember]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phoneNum.trim()) newErrors.phoneNum = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.memberType) newErrors.memberType = "Member type is required";
    if (!formData.amountPay || parseFloat(formData.amountPay) <= 0) {
      newErrors.amountPay = "Valid amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const memberData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        phoneNum: formData.phoneNum,
        email: formData.email,
        address: formData.address,
        memberType: formData.memberType,
        amountPay: parseFloat(formData.amountPay),
        trainerId: formData.trainer || null,
      };
      const response = await memberAPI.update(id, memberData);
      if (response.data.success) {
        router.push("/members");
      } else {
        alert("Error: " + (response.data.message || "Failed to update member"));
      }
    } catch (error: any) {
      alert("Error updating member: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedAnimatedBackground />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => router.push("/members")}
              className="hover:bg-secondary-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neo-600 to-neo-400 bg-clip-text text-transparent flex items-center gap-3">
            <motion.span
              className="text-5xl"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              ✏️
            </motion.span>
            Edit Member
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
                <span className="text-3xl">📝</span>
                Member Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-accent-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-accent-600">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-accent-600">{errors.gender}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNum">Phone Number *</Label>
                    <Input
                      id="phoneNum"
                      name="phoneNum"
                      value={formData.phoneNum}
                      onChange={handleChange}
                    />
                    {errors.phoneNum && (
                      <p className="text-sm text-accent-600">{errors.phoneNum}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="text-sm text-accent-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <p className="text-sm text-accent-600">{errors.address}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberType">Member Type *</Label>
                    <Select
                      id="memberType"
                      name="memberType"
                      value={formData.memberType}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Basic">Basic</option>
                      <option value="Plus">Plus</option>
                      <option value="Premium">Premium</option>
                    </Select>
                    {errors.memberType && (
                      <p className="text-sm text-accent-600">{errors.memberType}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amountPay">Amount Pay *</Label>
                    <Input
                      id="amountPay"
                      name="amountPay"
                      type="number"
                      step="0.01"
                      value={formData.amountPay}
                      onChange={handleChange}
                    />
                    {errors.amountPay && (
                      <p className="text-sm text-accent-600">{errors.amountPay}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="trainer">Trainer</Label>
                    <Select
                      id="trainer"
                      name="trainer"
                      value={formData.trainer}
                      onChange={handleChange}
                    >
                      <option value="">Select Trainer</option>
                      {trainers.map((trainer) => (
                        <option key={trainer.id} value={trainer.id}>
                          {trainer.name} ({trainer.id})
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <motion.div
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/members")}
                      className="h-12"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-12 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl transition-all font-bold"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {loading ? "Updating..." : "Update Member"}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

