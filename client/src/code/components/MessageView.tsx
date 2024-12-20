import React, { JSX } from "react";
import { IState } from "../state";
import Button from "@mui/material/Button";
import { TextField, Box } from "@mui/material";

const MessageView = ({ state }: { state: IState }): JSX.Element => {
  return (
    <form>
      <Box sx={{ padding: 2 }}>
        <TextField
          margin="dense"
          id="messageID"
          label="ID"
          value={`ID: ${state.messageID || ""}`}
          variant="outlined"
          name="messageID"
          disabled
          sx={{
            width: 260,
            marginBottom: 2,
          }}
        />

        <TextField
          margin="dense"
          id="messageDate"
          label="Date"
          value={state.messageDate || ""}
          variant="outlined"
          name="messageDate"
          disabled
          sx={{
            width: 260,
            marginBottom: 2,
          }}
        />

        <TextField
          margin="dense"
          id="messageFrom"
          label="From"
          value={state.messageFrom || ""}
          variant="outlined"
          name="messageFrom"
          disabled={state.currentView === "message"}
          onChange={state.fieldChangeHandler}
          sx={{
            width: 520,
            marginBottom: 2,
          }}
        />

        {state.currentView === "compose" && (
          <TextField
            margin="dense"
            id="messageTo"
            label="To"
            value={state.messageTo || ""}
            variant="outlined"
            name="messageTo"
            onChange={state.fieldChangeHandler}
            sx={{
              width: 520,
              marginBottom: 2,
            }}
          />
        )}

        <TextField
          margin="dense"
          id="messageSubject"
          label="Subject"
          value={state.messageSubject || ""}
          variant="outlined"
          name="messageSubject"
          disabled={state.currentView === "message"}
          onChange={state.fieldChangeHandler}
          sx={{
            width: 520,
            marginBottom: 2,
          }}
        />

        <TextField
          margin="dense"
          id="messageBody"
          label="Body"
          value={state.messageBody || ""}
          variant="outlined"
          name="messageBody"
          disabled={state.currentView === "message"}
          onChange={state.fieldChangeHandler}
          multiline
          rows={12}
          sx={{
            width: 520,
            marginBottom: 2,
          }}
        />

        {state.currentView === "compose" && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: 10 }}
            onClick={state.sendMessage}
          >
            Send
          </Button>
        )}

        {state.currentView === "message" && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: 10, marginRight: 10 }}
            onClick={() => state.showComposeMessage("reply")}
          >
            Reply
          </Button>
        )}

        {state.currentView === "message" && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginTop: 10 }}
            onClick={state.deleteMessage}
          >
            Delete
          </Button>
        )}
      </Box>
    </form>
  );
};

export default MessageView;
