import React, { JSX } from "react";
import { IState } from "../state";
import Button from '@mui/material/Button';
import { TextField, Box } from "@mui/material";

const ContactView = ({ state }: { state: IState }): JSX.Element => {
  return (
    <form>
      <Box sx={{ padding: 2 }}>
        {/* Champ pour le nom du contact */}
        <TextField
          margin="dense"
          id="contactName"
          label="Name"
          value={state.contactName || ""}
          variant="outlined"
          name="contactName"
          disabled={state.currentView === "contact"}
          onChange={state.fieldChangeHandler}
          sx={{
            width: 260,
            color: "#000000",
            "& .MuiInputBase-input": {
              color: "#000000",
            },
            marginBottom: 2, 
          }}
        />
        
        {/* Champ pour l'email du contact */}
        <TextField
          margin="dense"
          id="contactEmail"
          label="Email"
          value={state.contactEmail || ""}
          variant="outlined"
          name="contactEmail"
          disabled={state.currentView === "contact"}
          onChange={state.fieldChangeHandler}
          sx={{
            width: 520,
            color: "#000000",
            "& .MuiInputBase-input": {
              color: "#000000",
            },
            marginBottom: 2, 
          }}
        />
        
        {/* Bouton de sauvegarde */}
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: 10 }}
          onClick={state.saveContact}
        >
          Save
        </Button>

        {/* Bouton de suppression, visible uniquement si currentView est "contact" */}
        {state.currentView === "contact" && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: 10, marginRight: 10 }}
            onClick={state.deleteContact}
          >
            Delete
          </Button>
        )}

        {/* Bouton pour envoyer un email, visible uniquement si currentView est "contact" */}
        {state.currentView === "contact" && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: 10 }}
            onClick={() => state.showComposeMessage("contact")}
          >
            Send Email
          </Button>
        )}
      </Box>
    </form>
  );
};

export default ContactView;
