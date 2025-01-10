import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { IState } from "../state";
import { IMessage } from "../IMAP";

const MessageList = ({ state }: { state: IState }) => (
    <Table stickyHeader padding="none">
        <TableHead>
            <TableRow>
                <TableCell style={{ width: 120 }}>Date</TableCell>
                <TableCell style={{ width: 301 }}>De</TableCell>
                <TableCell>Sujet</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {state.messages.slice(0, 50).map((message: IMessage) => (
                <TableRow
                    key={message.id}
                    onClick={() => state.showMessage(message)}
                    style={{ cursor: "pointer" }}
                >
                    <TableCell>
                        {message.date ? new Date(message.date).toLocaleDateString() : "Date inconnue"}
                    </TableCell>
                    <TableCell>{message.from}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export default MessageList;
