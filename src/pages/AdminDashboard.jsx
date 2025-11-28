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

  // NEW STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching users");
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/admin/tasks");
      setTasks(data);
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditingUserForm({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      password: "",
    });
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
    setEditingTaskForm({
      title: task.title,
      description: task.description,
    });
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
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // SEARCH FILTERS
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users or tasks..."
            className="w-full px-4 py-2 rounded-xl bg-slate-800 text-white border border-slate-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* TABS */}
        <div className="flex gap-2 sm:gap-4 mb-8 flex-wrap">

          <button
            onClick={() => {
              setActiveTab("users");
              setSelectedUser(null);
            }}
            className={`px-4 sm:px-6 py-2 rounded-2xl font-bold text-sm sm:text-base 
              ${activeTab === "users"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          >
            Users
          </button>

          <button
            onClick={() => {
              setActiveTab("tasks");
              setSelectedUser(null);
            }}
            className={`px-4 sm:px-6 py-2 rounded-2xl font-bold text-sm sm:text-base 
              ${activeTab === "tasks"
                ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
          >
            Tasks
          </button>

          {selectedUser && (
            <button
              onClick={() => setActiveTab("profile")}
              className="px-4 sm:px-6 py-2 rounded-2xl bg-blue-600 text-white font-bold"
            >
              User Profile
            </button>
          )}
        </div>

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              All Users ({filteredUsers.length})
            </h2>

            {filteredUsers.length === 0 ? (
              <p className="text-slate-400">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-slate-800 bg-opacity-60 p-4 rounded-2xl border border-slate-700 shadow-2xl"
                >
                  {editingUser === user._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingUserForm.name}
                        onChange={(e) =>
                          setEditingUserForm({ ...editingUserForm, name: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />

                      <input
                        type="email"
                        value={editingUserForm.email}
                        onChange={(e) =>
                          setEditingUserForm({ ...editingUserForm, email: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={editingUserForm.password}
                          onChange={(e) =>
                            setEditingUserForm({
                              ...editingUserForm,
                              password: e.target.value,
                            })
                          }
                          placeholder="Password (optional)"
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      </div>

                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={editingUserForm.isAdmin}
                          onChange={(e) =>
                            setEditingUserForm({
                              ...editingUserForm,
                              isAdmin: e.target.checked,
                            })
                          }
                        />
                        Admin
                      </label>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveUser}
                          className="flex-1 bg-green-500 py-2 rounded-lg text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="flex-1 bg-slate-700 py-2 rounded-lg text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <p className="text-white font-bold">{user.name}</p>
                        <p className="text-slate-400">{user.email}</p>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold 
                          ${user.isAdmin ? "bg-purple-500/30 text-purple-300" : "bg-slate-700 text-slate-300"
                            }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setActiveTab("profile");
                          }}
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                        >
                          Profile
                        </button>

                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
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

        {/* TASKS TAB */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              All Tasks ({filteredTasks.length})
            </h2>

            {filteredTasks.length === 0 ? (
              <p className="text-slate-400">No tasks found</p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-slate-800 bg-opacity-60 p-4 rounded-2xl border border-slate-700"
                >
                  {editingTask === task._id ? (
                    <div className="space-y-4">
                      <p className="text-slate-400 text-sm">
                        User: {task.user.name} ({task.user.email})
                      </p>

                      <input
                        type="text"
                        value={editingTaskForm.title}
                        onChange={(e) =>
                          setEditingTaskForm({ ...editingTaskForm, title: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg"
                      />

                      <textarea
                        value={editingTaskForm.description}
                        onChange={(e) =>
                          setEditingTaskForm({
                            ...editingTaskForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg h-24"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveTask}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="flex-1 bg-slate-700 text-white py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-slate-400 text-sm">
                          {task.user.name} ({task.user.email})
                        </p>
                        <p className="text-white font-bold text-lg">{task.title}</p>
                        <p className="text-slate-300">{task.description}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
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

        {/* USER PROFILE TAB */}
        {activeTab === "profile" && selectedUser && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              {selectedUser.name} — Profile
            </h2>

            <p className="text-slate-300">{selectedUser.email}</p>

            <h3 className="text-lg text-white font-semibold mt-4">
              Tasks Created
            </h3>

            {tasks
              .filter((t) => t.user._id === selectedUser._id)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-slate-800 p-4 rounded-xl border border-slate-700"
                >
                  <p className="text-white font-bold">{task.title}</p>
                  <p className="text-slate-300">{task.description}</p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

