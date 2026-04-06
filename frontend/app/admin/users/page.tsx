"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Download, UserPlus, Eye, Trash2, ChevronLeft, ChevronRight, X, Copy, Edit2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/data');
      if (res.data && res.data.users) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/user/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const openEditModal = (user: any) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:5001/api/admin/user/${currentUser._id}`, currentUser);
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Creator': return 'bg-blue-100 text-blue-600';
      case 'Admin': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusDisplay = (status: string) => {
    if (status === 'Active') {
      return <span className="flex items-center gap-2 text-slate-600 text-xs"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active</span>;
    }
    return <span className="flex items-center gap-2 text-slate-600 text-xs"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {status}</span>;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full bg-[#f8f9fa] min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] font-sans relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">User Management</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage platform users, creators, and administrators.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm hover:bg-slate-700">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col relative z-0">

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 border-b border-slate-100 gap-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-6 w-full md:w-auto">
            <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 text-sm font-semibold rounded-lg shadow-sm flex items-center justify-between hover:bg-slate-50">
              Bulk Actions <span className="text-[10px] text-slate-500 ml-2">▼</span>
            </button>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm font-semibold text-slate-700">
              <div className="cursor-pointer flex items-center gap-1">Role: <span className="font-normal text-slate-500">All Roles</span><span className="text-[10px]">▼</span></div>
              <div className="cursor-pointer flex items-center gap-1">Status: <span className="font-normal text-slate-500">Any Status</span><span className="text-[10px]">▼</span></div>
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-500">
            Showing <span className="text-slate-700">{users.length}</span> users
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-[#f8f9fa] uppercase text-[10px] font-bold text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-800" /></th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">Loading dynamic data...</td></tr>
              ) : users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-800" /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusDisplay(user.status)}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right pr-6">
                    <div className="flex justify-end gap-2 text-slate-600">
                      <a href={`/admin/users/${user._id}`} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200 shadow-sm relative group">
                        <Eye className="w-4 h-4" />
                      </a>
                      <button onClick={() => deleteUser(user._id)} className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200 shadow-sm relative group">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination md/sm */}
        <div className="flex items-center justify-center p-6 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <button className="p-1 text-slate-400 hover:text-slate-800"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-800 text-white shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100">3</button>
            <button className="p-1 text-slate-600 hover:text-slate-800"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

      </div>

      {/* Edit User Modal Overlay */}
      {isEditModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 items-center mb-8">
              <div className="relative">
                <img src={currentUser.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-200">
                  <Edit2 className="w-3 h-3 text-slate-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Edit User</h3>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Modify account details for platform access</p>
              </div>
            </div>

            <div className="space-y-4 text-sm font-semibold text-slate-800">
              <div>
                <label className="block text-[11px] mb-1.5 ml-1">Full Name</label>
                <input type="text" value={currentUser.name} onChange={e => setCurrentUser({ ...currentUser, name: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-slate-300" />
              </div>
              <div>
                <label className="block text-[11px] mb-1.5 ml-1">Email Address</label>
                <input type="email" value={currentUser.email} onChange={e => setCurrentUser({ ...currentUser, email: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-slate-300" />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] mb-1.5 ml-1">Role</label>
                  <div className="relative">
                    <select value={currentUser.role} onChange={e => setCurrentUser({ ...currentUser, role: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-slate-300 appearance-none">
                      <option value="Creator">Creator</option>
                      <option value="User">User</option>
                      <option value="Premium User">Premium User</option>
                      <option value="Admin">Admin</option>
                      <option value="Moderator">Moderator</option>
                    </select>
                    <span className="absolute right-4 top-3.5 text-[10px] text-slate-500 pointer-events-none">▼</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] mb-1.5 ml-1">Status</label>
                  <div className="relative">
                    <select value={currentUser.status} onChange={e => setCurrentUser({ ...currentUser, status: e.target.value })} className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-slate-300 appearance-none">
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <span className="absolute right-4 top-3.5 text-[10px] text-slate-500 pointer-events-none">▼</span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="block text-[11px] mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <input type="password" value={currentUser.password || '••••••••••••'} readOnly className="w-full bg-[#f8f9fa] border border-slate-200 rounded-lg px-4 py-2.5 outline-none tracking-widest text-slate-600" />
                  <Copy className="absolute right-4 top-3 w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
                <p className="text-[9px] text-slate-400 mt-1 ml-1">Last changed 4 months ago</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg text-sm font-bold transition-colors">
                Cancel
              </button>
              <button onClick={handleUpdateUser} className="px-5 py-2 bg-slate-800 text-white hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors shadow-sm">
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
