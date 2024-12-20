import React from "react";

const WelcomeView: React.FC = () => {
  return (
    <div style={{
        position: "relative", top: "40%", textAlign: "center",
        color: "#ff0000"
      }}>
      <h2>Bienvenue sur MailBag</h2>
      <p>Sélectionnez une boîte aux lettres pour afficher les messages.</p>
    </div>
  );
};

export default WelcomeView;
