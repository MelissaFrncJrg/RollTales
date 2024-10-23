import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArmorList = ({ isAdmin }) => {
  const [armors, setArmors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArmors();
  }, []);

  const fetchArmors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/armors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      });
      setArmors(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des armures :", error);
    }
  };

  const deleteArmor = async (id) => {
    try {
      await axios.get("http://localhost:5000/armors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      });
      setArmors(armors.filter((armor) => armor._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression des armures :", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit-origin/${id}`);
  };

  return (
    <div className="list">
      <h2>{isAdmin ? "Gestion des armures" : "Liste des armures"}</h2>
      <table className="element-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>PR</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {armors.map((armor) => (
            <tr key={armor._id}>
              <td>{armor.name}</td>
              <td>{armor.description}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => handleEdit(armor._id)}>
                    Modifier
                  </button>
                  <button onClick={() => deleteArmor(armor._id)}>
                    Supprimer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArmorList;
