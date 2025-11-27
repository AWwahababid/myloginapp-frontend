function TaskCard({ task, isAdmin = false, onEdit, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        {isAdmin && (
          <p className="text-sm text-gray-500">
            <strong>User:</strong> {task.user.name} ({task.user.email})
          </p>
        )}
        <h3 className="font-bold">{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>
      <div className="flex gap-2">
        {onEdit && (
          <button
            className="bg-yellow-400 text-white p-1 rounded"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="bg-red-500 text-white p-1 rounded"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
