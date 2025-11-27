import { useEffect, useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (err) {
      alert("Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/tasks/${editingId}`, { title, description });
        setEditingId(null);
      } else {
        await API.post("/tasks", { title, description });
      }
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">Your Tasks</h2>
          <button
            onClick={() => navigate("/profile")}
            className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-2xl transition-all duration-300 text-sm sm:text-base"
          >
            Back to Profile
          </button>
        </div>

        {/* Create/Edit Task Form */}
        <form onSubmit={handleAddTask} className="bg-slate-800 bg-opacity-60 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">{editingId ? "Edit Task" : "Create New Task"}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              className="w-full px-4 sm:px-5 py-2 sm:py-3 bg-slate-700 bg-opacity-50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 text-sm sm:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Task Description (optional)"
              className="w-full px-4 sm:px-5 py-2 sm:py-3 bg-slate-700 bg-opacity-50 border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 resize-none h-20 sm:h-24 text-sm sm:text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-2 sm:py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-pink-500/50 text-sm sm:text-base">
                {editingId ? "Update Task" : "Create Task"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 sm:py-3 rounded-2xl transition-all duration-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-slate-800 bg-opacity-60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl text-center">
              <p className="text-slate-400 text-base sm:text-lg">No tasks yet. Create your first task above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="bg-slate-800 bg-opacity-60 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-slate-700 border-opacity-50 shadow-2xl hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 break-words">{task.title}</h3>
                    {task.description && <p className="text-slate-300 text-sm sm:text-base mb-2 break-words">{task.description}</p>}
                    <p className="text-slate-500 text-xs sm:text-sm">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-xl transition-all duration-300 text-sm"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 sm:flex-none bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-xl transition-all duration-300 text-sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
