import React, { JSX } from "react";
import { IState } from "../state";
import { Chip, List } from "@mui/material";

const MailboxList = ({ state }: { state: IState }): JSX.Element => {
    if (!state.mailboxes || state.mailboxes.length === 0) {
        return <div>No mailboxes available.</div>;
    }

    return (
        <List>
            {state.mailboxes.map((mailbox) => (
                <Chip
                    key={mailbox.path}
                    label={mailbox.name}
                    onClick={() => state.setCurrentMailbox(mailbox.path)}
                    style={{
                        width: "100%",
                        maxWidth: 200,
                        marginBottom: 10,
                        textAlign: "center",
                    }}
                    color={state.currentMailbox === mailbox.path ? "secondary" : "primary"}
                />
            ))}
        </List>
    );
};

export default MailboxList;
