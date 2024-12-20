import React, { Component, JSX } from "react";
import { createState, IState } from "../state";
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import MailboxList from "./MailboxList";
import WelcomeView from "./WelcomeView";
import MessageView from "./MessageView";
import ContactView from "./ContactView";
import ContactList from "./ContactList";
import MessageList from "./MessageList";
import Toolbar from "./Toolbar";
import * as IMAP from "../IMAP";
import { IMailbox } from "../IMAP";

class BaseLayout extends Component<{}, IState> {
    state: IState = createState(this);
    private worker = new IMAP.Worker();

    componentDidMount(): void {
        this.worker
            .listMailboxes()
            .then((mailboxes: IMailbox[]) => this.setState({ mailboxes }))
            .catch((error) =>
                console.error("Error fetching mailboxes:", error)
            );
    }

    render(): JSX.Element {
        return (
            <div className="appContainer">
                {/* Loading Dialog */}
                <Dialog
                    open={this.state.pleaseWaitVisible}
                    disableEscapeKeyDown
                >
                    <DialogTitle style={{ textAlign: "center" }}>
                        Please Wait
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>Connecting to server...</DialogContentText>
                    </DialogContent>
                </Dialog>

                {/* Toolbar */}
                <div className="toolbar">
                    <Toolbar state={this.state} />
                </div>

                {/* Mailbox List */}
                <div className="mailboxList">
                    <MailboxList state={this.state} />
                </div>

                {/* Center Area */}
                <div className="centerArea">
                    <div className="messageList">
                        <MessageList state={this.state} />
                    </div>
                    <div className="centerViews">
                        {this.state.currentView === "welcome" && <WelcomeView />}
                        {this.state.currentView === "message" && (
                            <MessageView state={this.state} />
                        )}
                        {this.state.currentView === "contact" && (
                            <ContactView state={this.state} />
                        )}
                    </div>
                </div>

                {/* Contact List */}
                <div className="contactList">
                    <ContactList state={this.state} />
                </div>
            </div>
        );
    }
}

export default BaseLayout;
