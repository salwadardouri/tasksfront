import React, { useState, useEffect } from "react";
import { FaTrash, FaPencilAlt, FaCheck } from "react-icons/fa";
import axios from "axios";
import { Container, Row, Col, Table, Form, Button, Alert } from "react-bootstrap";
import "./App.css"; // Importez le fichier CSS

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);  // Ajout de cette ligne

  const fetchData = async () => {
    try {
      const apiUrl = "http://127.0.0.1:8000/api/gettasks";
      const response = await axios.get(apiUrl);
      const fetchedTasks = response.data;
      setTasks(fetchedTasks);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des tâches :",
        error.message
      );
    }
  };

  useEffect(() => {
    // Appeler la fonction fetchData au chargement du composant
    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (newTaskName.trim() === "") {
      alert("Attention : Veuillez saisir le nom de la tâche.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/createtasks",
        {
          name: newTaskName,
          completed: false,
        }
      );

      if (response.status === 201) {
        setSuccessMessage("La tâche a été créée avec succès.");
        setErrorMessage("");

        // Actualiser la liste des tâches sans recharger toute la page
        fetchData();

        // Réinitialiser le champ du nouveau nom de tâche
        setNewTaskName("");
      } else if (response.status === 422) {
        // Si le statut est 422, cela signifie que la tâche existe déjà
        alert("La tâche existe déjà.");
     
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
      setSuccessMessage("");
      setErrorMessage("La tâche existe déjà.");
    }
  };

 
  const handleUpdateTask = async (taskId, completed) => {
    // Ouvrir le formulaire de modification en définissant l'id de la tâche en cours d'édition
   // eslint-disable-next-line
    setEditingTaskId(taskId);
  };

  const handleSaveTask = async (editedTask) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/updatetasks/${editedTask.id}`, editedTask);

      // Fermer le formulaire de modification
      // eslint-disable-next-line
      setEditingTaskId(null);

      // Recharge la liste des tâches après la mise à jour
      fetchData();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Boîte de dialogue de confirmation
      const confirmDelete = window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette tâche ?"
      );
      if (!confirmDelete) {
        return;
      }

      // Suppression de la tâche
      await axios.delete(`http://127.0.0.1:8000/api/deletetasks/${taskId}`);

      // Actualiser automatiquement la page après la suppression
      window.location.reload();

      // Affiche un message de succès
      setSuccessMessage("La tâche a été supprimée avec succès.");
      setErrorMessage("");
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);

      // Affiche un message d'erreur
      setSuccessMessage("");
      setErrorMessage("Erreur lors de la suppression de la tâche.");
    }
  };

  return (
    <Container>
      <h2>Liste des tâches</h2>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="newTaskName">
              <Form.Control
                type="text"
                placeholder="Nouvelle tâche"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddTask}>
              Ajouter une tâche
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Tâches</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Task</th>
                <th>Done !</th>
                <th>Modifier</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    {editingTaskId === task.id ? (
                      // Affiche le formulaire de modification si la tâche est en cours d'édition
                      <Form.Control
                        type="text"
                        value={task.name}
                        onChange={(e) => setTasks((prevTasks) => {
                          const updatedTasks = [...prevTasks];
                          const updatedTask = { ...task, name: e.target.value };
                          updatedTasks[updatedTasks.findIndex(t => t.id === task.id)] = updatedTask;
                          return updatedTasks;
                        })}
                      />
                    ) : (
                      // Affiche le nom de la tâche si elle n'est pas en cours d'édition
                      task.name
                    )}
                  </td>
                  <td>
                    {task.completed === 1 ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : null}
                  </td>
                  <td>
                    {editingTaskId === task.id ? (
                      // Affiche la case à cocher si la tâche est en cours d'édition
                      <Form.Check
                        type="checkbox"
                        label="Complété"
                        checked={task.completed}
                        onChange={(e) => setTasks((prevTasks) => {
                          const updatedTasks = [...prevTasks];
                          const updatedTask = { ...task, completed: e.target.checked };
                          updatedTasks[updatedTasks.findIndex(t => t.id === task.id)] = updatedTask;
                          return updatedTasks;
                        })}
                      />
                    ) : null}
                  </td>
                  <td>
                    {editingTaskId === task.id ? (
                      // Affiche le bouton de sauvegarde si la tâche est en cours d'édition
                      <Button
                        variant="primary"
                        onClick={() => handleSaveTask(task)}
                      >
                        Enregistrer
                      </Button>
                    ) : (
                      // Affiche l'icône "pencil" si la tâche n'est pas en cours d'édition
                      <FaPencilAlt
                        style={{ cursor: "pointer", color: "blue", marginLeft: "10px" }}
                        onClick={() => handleUpdateTask(task.id)}
                      />
                    )}
                    <FaTrash
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDeleteTask(task.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};


export default TaskList;
