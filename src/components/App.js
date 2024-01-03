import React, { useState, useEffect } from "react";
import "./TaskList.css"; // Importez le fichier CSS

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");

  useEffect(() => {
    // Chargement initial des tâches depuis l'API
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Erreur lors du chargement des tâches :", error);
    }
  };

  const handleAddTask = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTaskName,
          completed: false,
        }),
      });

      // Recharge la liste des tâches après l'ajout
      fetchTasks();

      // Réinitialise le champ du nouveau nom de tâche
      setNewTaskName("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  };

  //   const handleUpdateTask = async (taskId, completed) => {
  //     try {
  //       await fetch(`http://votre-backend/api/tasks/${taskId}`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           completed: !completed,
  //         }),
  //       });

  //       // Recharge la liste des tâches après la mise à jour
  //       fetchTasks();
  //     } catch (error) {
  //       console.error('Erreur lors de la mise à jour de la tâche :', error);
  //     }
  //   };

  //   const handleDeleteTask = async (taskId) => {
  //     try {
  //       await fetch(`http://votre-backend/api/tasks/${taskId}`, {
  //         method: 'DELETE',
  //       });

  //       // Recharge la liste des tâches après la suppression
  //       fetchTasks();
  //     } catch (error) {
  //       console.error('Erreur lors de la suppression de la tâche :', error);
  //     }
  //   };

  return (
    <div>
      <h2>Liste des tâches</h2>
      {/* <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleUpdateTask(task.id, task.completed)}
            />
            {task.name}
            <button onClick={() => handleDeleteTask(task.id)}>Supprimer</button>
          </li>
        ))}
      </ul> */}
      <div>
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <button onClick={handleAddTask}>Ajouter une tâche</button>
      </div>
    </div>
  );
};

export default TaskList;
