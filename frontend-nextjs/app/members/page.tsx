"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { memberAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Download,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import EnhancedAnimatedBackground from "@/components/EnhancedAnimatedBackground";

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await memberAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/login");
      return;
    }
    loadMembers();
  }, [router, loadMembers]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Memoized filtered members
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (member) =>
          member.id?.toLowerCase().includes(query) ||
          member.firstName?.toLowerCase().includes(query) ||
          member.lastName?.toLowerCase().includes(query) ||
          member.email?.toLowerCase().includes(query) ||
          member.phoneNum?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(
        (member) => member.memberType === filterType
      );
    }

    return filtered;
  }, [debouncedSearch, filterType, members]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await memberAPI.delete(id);
      loadMembers();
    } catch (error: any) {
      alert("Error deleting member: " + (error.response?.data?.message || error.message));
    }
  }, [loadMembers]);

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Type", "Amount"];
    const rows = filteredMembers.map((m) => [
      m.id,
      `${m.firstName} ${m.lastName}`,
      m.email,
      m.phoneNum,
      m.memberType,
      m.amountPay,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <EnhancedAnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 border-4 border-neo-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-neo-600 font-medium">Loading members...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <EnhancedAnimatedBackground />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <span className="text-5xl">📋</span>
              Member List
            </h1>
            <p className="text-secondary-500 mt-2 text-lg">
              Manage all gym members ({filteredMembers.length} total)
            </p>
          </motion.div>
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              onClick={exportToCSV}
              className="hover:bg-success-50 hover:border-success-300 hover:text-success-700 transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => router.push("/members/new")}
              className="bg-gradient-to-r from-neo-500 to-neo-600 hover:from-neo-600 hover:to-neo-700 shadow-neo-md hover:shadow-neo-lg active:shadow-neo-xl transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-2 border-neo-100 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <motion.div
                  className="flex-1 relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neo-500 w-5 h-5" />
                  <Input
                    placeholder="🔍 Search by ID, name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base border-2 focus:border-neo-400 transition-all"
                  />
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Filter className="w-5 h-5 text-neo-500" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="h-12 px-4 rounded-md border-2 border-input bg-background focus:border-neo-400 transition-all font-medium"
                  >
                    <option value="all">All Types</option>
                    <option value="Basic">Basic</option>
                    <option value="Plus">Plus</option>
                    <option value="Premium">Premium</option>
                  </select>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-xl border-2 border-neo-100">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-neo-50 to-secondary-50">
                    <TableRow className="border-b-2 border-neo-200">
                      <TableHead className="font-bold text-neo-700">ID</TableHead>
                      <TableHead className="font-bold text-neo-700">Name</TableHead>
                      <TableHead className="font-bold text-neo-700">Gender</TableHead>
                      <TableHead className="font-bold text-neo-700">Phone</TableHead>
                      <TableHead className="font-bold text-neo-700">Email</TableHead>
                      <TableHead className="font-bold text-neo-700">Type</TableHead>
                      <TableHead className="font-bold text-neo-700">Amount</TableHead>
                      <TableHead className="font-bold text-neo-700">Registered</TableHead>
                      <TableHead className="text-right font-bold text-neo-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-4"
                          >
                            <span className="text-6xl">📭</span>
                            <p className="text-xl text-secondary-500 font-medium">
                              No members found
                            </p>
                            <Button
                              onClick={() => router.push("/members/new")}
                              className="mt-2"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add First Member
                            </Button>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMembers.map((member, index) => (
                        <motion.tr
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-neo-50 transition-colors border-b border-secondary-100"
                        >
                          <TableCell className="font-semibold text-neo-600">
                            {member.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {member.firstName} {member.lastName}
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700">
                              {member.gender}
                            </span>
                          </TableCell>
                          <TableCell>{member.phoneNum}</TableCell>
                          <TableCell className="text-sm">{member.email}</TableCell>
                          <TableCell>
                            <motion.span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                member.memberType === "Premium"
                                  ? "bg-gradient-to-r from-neo-100 to-neo-200 text-neo-800"
                                  : member.memberType === "Plus"
                                  ? "bg-gradient-to-r from-success-100 to-success-200 text-success-800"
                                  : "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800"
                              }`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {member.memberType}
                            </motion.span>
                          </TableCell>
                          <TableCell className="font-bold text-success-600">
                            ₹{member.amountPay?.toFixed(2) || "0.00"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {member.dateRegistered
                              ? format(new Date(member.dateRegistered), "MMM dd, yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/members/edit/${member.id}`)}
                                  className="hover:bg-neo-100 hover:text-neo-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(member.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
  );
}


