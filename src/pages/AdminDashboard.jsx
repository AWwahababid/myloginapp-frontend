import { useEffect, useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingUserForm, setEditingUserForm] = useState({});
  const [editingTaskForm, setEditingTaskForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error fetching users");
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/admin/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditingUserForm({ name: user.name, email: user.email, isAdmin: user.isAdmin, password: "" });
    setShowPassword(false);
  };

  const handleSaveUser = async () => {
    try {
      await API.put(`/admin/user/${editingUser}`, editingUserForm);
      setEditingUser(null);
      fetchUsers();
      fetchTasks();
    } catch (err) {
      alert("Error updating user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Delete this user? All their tasks will be deleted too.")) {
      try {
        await API.delete(`/admin/user/${id}`);
        fetchUsers();
        fetchTasks();
      } catch (err) {
        alert("Error deleting user");
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setEditingTaskForm({ title: task.title, description: task.description });
  };

  const handleSaveTask = async () => {
    try {
      await API.put(`/admin/task/${editingTask}`, editingTaskForm);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      alert("Error updating task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await API.delete(`/admin/task/${id}`);
        fetchTasks();
      } catch (err) {
        alert("Error deleting task");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"));
    // Navigate after clearing storage
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold transition-all duration-300 text-sm sm:text-base ${
              activeTab === "users"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold transition-all duration-300 text-sm sm:text-base ${
              activeTab === "tasks"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Tasks
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">All Users ({users.length})</h2>
            {users.length === 0 ? (
              <div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700 border-opacity-50 text-center">
                <p className="text-slate-400 text-sm sm:text-base">No users found</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-slate-800 bg-opacity-60 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl"
                >
                  {editingUser === user._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingUserForm.name}
                        onChange={(e) => setEditingUserForm({ ...editingUserForm, name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={editingUserForm.email}
                        onChange={(e) => setEditingUserForm({ ...editingUserForm, email: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base"
                        placeholder="Email"
                      />
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={editingUserForm.password}
                          onChange={(e) => setEditingUserForm({ ...editingUserForm, password: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base"
                          placeholder="Password (leave empty to keep current)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                        >
                          {showPassword ? (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M15.171 13.576l1.473 1.473A10.014 10.014 0 0019.542 10c-1.274-4.057-5.064-7-9.542-7a9.958 9.958 0 00-4.512 1.074l1.473 1.473C9.773 3.645 9.88 3.645 10 3.645a4 4 0 014 4v.17l1.171 1.171z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <label className="flex items-center gap-2 text-white text-sm sm:text-base">
                        <input
                          type="checkbox"
                          checked={editingUserForm.isAdmin}
                          onChange={(e) => setEditingUserForm({ ...editingUserForm, isAdmin: e.target.checked })}
                          className="w-4 h-4"
                        />
                        Admin
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={handleSaveUser}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all text-sm sm:text-base"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-all text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-base sm:text-lg font-bold break-all">{user.name}</p>
                        <p className="text-slate-400 text-sm break-all">{user.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${user.isAdmin ? "bg-purple-500/30 text-purple-300" : "bg-slate-700 text-slate-300"}`}>
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">All Tasks ({tasks.length})</h2>
            {tasks.length === 0 ? (
              <div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700 border-opacity-50 text-center">
                <p className="text-slate-400 text-sm sm:text-base">No tasks found</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-slate-800 bg-opacity-60 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl"
                >
                  {editingTask === task._id ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-slate-400 text-xs sm:text-sm mb-1">User</p>
                        <p className="text-white font-semibold text-sm sm:text-base break-all">{task.user.name} ({task.user.email})</p>
                      </div>
                      <input
                        type="text"
                        value={editingTaskForm.title}
                        onChange={(e) => setEditingTaskForm({ ...editingTaskForm, title: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm sm:text-base"
                        placeholder="Title"
                      />
                      <textarea
                        value={editingTaskForm.description}
                        onChange={(e) => setEditingTaskForm({ ...editingTaskForm, description: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white resize-none h-20 sm:h-24 text-sm sm:text-base"
                        placeholder="Description"
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={handleSaveTask}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-all text-sm sm:text-base"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition-all text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-400 text-xs sm:text-sm mb-1">User</p>
                        <p className="text-white font-semibold text-sm sm:text-base break-all mb-3">{task.user.name} ({task.user.email})</p>
                        <p className="text-white text-base sm:text-lg font-bold mb-1 break-words">{task.title}</p>
                        {task.description && <p className="text-slate-300 mb-2 text-sm break-words">{task.description}</p>}
                        <p className="text-slate-500 text-xs sm:text-sm">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
