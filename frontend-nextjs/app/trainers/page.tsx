"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { trainerAPI } from "@/lib/api";
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
  ArrowLeft,
  Save,
  Edit,
  Trash2,
  UserCog,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import EnhancedAnimatedBackground from "@/components/EnhancedAnimatedBackground";

export default function TrainersPage() {
  const router = useRouter();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    age: "",
    address: "",
    joinDate: "",
    specialization: "",
    username: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadTrainers = useCallback(async () => {
    try {
      const response = await trainerAPI.getAll();
      setTrainers(response.data);
    } catch (error) {
      console.error("Error loading trainers:", error);
    }
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/login");
      return;
    }
    loadTrainers();
  }, [router, loadTrainers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const response = await trainerAPI.update(formData.id, formData);
        if (response.data.success) {
          alert("Trainer updated successfully!");
        } else {
          alert("Error: " + (response.data.message || "Failed to update trainer"));
        }
      } else {
        const trainerData: any = { ...formData };
        // Only include username/password if provided
        if (!trainerData.username.trim()) delete trainerData.username;
        if (!trainerData.password.trim()) delete trainerData.password;
        
        const response = await trainerAPI.create(trainerData);
        if (response.data.success) {
          const creds = response.data.credentials;
          if (creds?.username) {
            const passwordLine = creds.password ? `\nPassword: ${creds.password}` : "";
            alert(`Trainer added successfully!\n\nUsername: ${creds.username}${passwordLine}`);
          } else {
            alert("Trainer added successfully!");
          }
        } else {
          alert("Error: " + (response.data.message || "Failed to add trainer"));
        }
      }
      setFormData({
        id: "",
        name: "",
        age: "",
        address: "",
        joinDate: "",
        specialization: "",
        username: "",
        password: "",
      });
      setEditing(false);
      loadTrainers();
    } catch (error: any) {
      alert("Error saving trainer: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trainer: any) => {
    setFormData({
      id: trainer.id,
      name: trainer.name,
      age: trainer.age,
      address: trainer.address,
      joinDate: trainer.joinDate ? trainer.joinDate.split("T")[0] : "",
      specialization: trainer.specialization,
      username: "",
      password: "",
    });
    setEditing(true);
  };

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this trainer?")) return;

    try {
      await trainerAPI.delete(id);
      alert("Trainer deleted successfully!");
      loadTrainers();
    } catch (error: any) {
      alert("Error deleting trainer: " + (error.response?.data?.message || error.message));
    }
  }, [loadTrainers]);

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
                animate={{ rotate: [0, 5, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                👨‍🏫
              </motion.span>
              Trainer Management
            </h1>
            <p className="text-secondary-500 mt-2 text-lg">
              Manage gym trainers and their information
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
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
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="shadow-xl border-2 border-neo-100">
              <CardHeader className="bg-gradient-to-r from-neo-50 to-secondary-50">
                <CardTitle className="text-2xl font-bold text-neo-700 flex items-center gap-2">
                  <span className="text-3xl">{editing ? "✏️" : "➕"}</span>
                  {editing ? "Edit Trainer" : "Add New Trainer"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Trainer ID *</Label>
                    <Input
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      required
                      disabled={editing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date *</Label>
                    <Input
                      id="joinDate"
                      name="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {!editing && (
                    <>
                      <div className="pt-4 border-t border-secondary-200">
                        <h3 className="text-sm font-semibold text-neo-700 mb-3 flex items-center gap-2">
                          <span className="text-lg">🔐</span>
                          Login Credentials (Optional)
                        </h3>
                        <p className="text-xs text-secondary-600 mb-3">
                          Leave blank to auto-generate
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm">Username</Label>
                            <Input
                              id="username"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              placeholder="Auto-generate"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm">Password</Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Auto-generate"
                              className="h-10"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <motion.div
                    className="flex gap-3 pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.div
                      className="flex-1"
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
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-neo-500 to-neo-600 hover:from-neo-600 hover:to-neo-700 shadow-neo-md hover:shadow-neo-lg active:shadow-neo-xl transition-all font-bold"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        {loading ? "Saving..." : editing ? "Update" : "Save"}
                      </Button>
                    </motion.div>
                    {editing && (
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
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              id: "",
                              name: "",
                              age: "",
                              address: "",
                              joinDate: "",
                              specialization: "",
                              username: "",
                              password: "",
                            });
                          }}
                          className="h-12"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl border-2 border-neo-100">
              <CardHeader className="bg-gradient-to-r from-neo-50 to-secondary-50">
                <CardTitle className="text-2xl font-bold text-neo-700 flex items-center gap-2">
                  <UserCog className="w-6 h-6" />
                  All Trainers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-neo-50 to-secondary-50">
                      <TableRow className="border-b-2 border-neo-200">
                        <TableHead className="font-bold text-neo-700">ID</TableHead>
                        <TableHead className="font-bold text-neo-700">Name</TableHead>
                        <TableHead className="font-bold text-neo-700">Age</TableHead>
                        <TableHead className="font-bold text-neo-700">Address</TableHead>
                        <TableHead className="font-bold text-neo-700">Join Date</TableHead>
                        <TableHead className="font-bold text-neo-700">Specialization</TableHead>
                        <TableHead className="text-right font-bold text-neo-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trainers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center gap-4"
                            >
                              <span className="text-6xl">👨‍🏫</span>
                              <p className="text-xl text-secondary-500 font-medium">
                                No trainers found
                              </p>
                              <Button
                                onClick={() => {
                                  setEditing(false);
                                  setFormData({
                                    id: "",
                                    name: "",
                                    age: "",
                                    address: "",
                                    joinDate: "",
                                    specialization: "",
                                    username: "",
                                    password: "",
                                  });
                                }}
                                className="mt-2"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Trainer
                              </Button>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        trainers.map((trainer, index) => (
                          <motion.tr
                            key={trainer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-primary-50 transition-colors border-b border-secondary-100"
                          >
                            <TableCell className="font-semibold text-primary-600">
                              {trainer.id}
                            </TableCell>
                            <TableCell className="font-medium">{trainer.name}</TableCell>
                            <TableCell>{trainer.age}</TableCell>
                            <TableCell className="text-sm">{trainer.address}</TableCell>
                            <TableCell className="text-sm">
                              {trainer.joinDate
                                ? format(new Date(trainer.joinDate), "MMM dd, yyyy")
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <motion.span
                                className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 shadow-sm"
                                whileHover={{ scale: 1.1 }}
                              >
                                {trainer.specialization}
                              </motion.span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(trainer)}
                                    className="hover:bg-primary-100 hover:text-neo-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(trainer.id)}
                                    className="text-accent-600 hover:text-accent-700 hover:bg-accent-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
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

