import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import characterService from "../../services/charactersService";
import Card from "../../common/cards/card";
import Modal from "../../common/modal/Modal";
import {
  setNotification,
  clearNotification,
} from "../../redux/notificationSlice";

const MyCharacters = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  // Utilisation d'un ref pour empêcher le re-rendu du useEffect
  const hasFetchedCharacters = useRef(false);

  // Fonction pour récupérer les personnages de l'utilisateur
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const userCharacters = await characterService.fetchUserCharacters();
        setCharacters(userCharacters);
      } catch (error) {
        dispatch(
          setNotification({
            message: "Erreur lors de la récupération des personnages",
            type: "error",
          })
        );
      }
    };

    // Appeler fetchCharacters seulement si les personnages n'ont pas encore été récupérés
    if (!hasFetchedCharacters.current) {
      fetchCharacters();
      hasFetchedCharacters.current = true;
    }
  }, [dispatch]);

  //   // Fonction de navigation pour modifier un personnage
  //   const handleEditCharacter = (character) => {
  //     navigate(`/edit-character/${character._id}`);
  //   };

  // Fonction pour ouvrir la modal de confirmation de suppression
  const handleDeleteCharacter = (character) => {
    setSelectedCharacter(character);
    setShowModal(true);
  };

  // Confirmation de l'action de suppression
  const confirmAction = async () => {
    try {
      await characterService.deleteCharacter(selectedCharacter._id);
      setCharacters(
        characters.filter((charac) => charac._id !== selectedCharacter._id)
      );
      dispatch(
        setNotification({
          message: "Personnage supprimé avec succès!",
          type: "success",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      setShowModal(false);
    } catch (error) {
      dispatch(
        setNotification({
          message: `Erreur lors de la suppression du personnage ${selectedCharacter.name}`,
          type: "error",
        })
      );
    }
  };

  // Annulation de l'action de suppression
  const cancelAction = () => {
    setShowModal(false);
    setSelectedCharacter(null);
  };

  return (
    <div className="container">
      <div>
        <h1>Mes personnages</h1>
        <div className="underline"></div>

        {notification.message && (
          <div>
            <p
              className={`notification ${
                notification.type === "error" ? "error" : "success"
              }`}
            >
              {notification.message}
            </p>
          </div>
        )}

        <div className="cards-grid">
          {characters.length > 0 ? (
            characters.map((character) => (
              <Card key={character._id} title={character.name}>
                <div className="character-actions">
                  {/* <button
                    className="submit btn"
                    onClick={() => handleEditCharacter(character)}
                  >
                    Modifier
                  </button> */}
                  <button
                    className="cancel btn"
                    onClick={() => handleDeleteCharacter(character)}
                  >
                    Supprimer
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <p className="no-characters-message">
              Vous n'avez pas encore créé de personnage !
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title="Supprimer le personnage"
          content={`Êtes-vous sûr de vouloir supprimer le personnage ${selectedCharacter?.name} ? Cette action est irréversible.`}
          onConfirm={confirmAction}
          onCancel={cancelAction}
        />
      )}
    </div>
  );
};

export default MyCharacters;
