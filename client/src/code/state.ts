import * as IMAP from "./IMAP";
import { config } from "./config";
import * as SMTP from "./SMTP";
import * as Contacts from "./contact";
import React from "react";

export interface IState {
  pleaseWaitVisible: boolean;
  contacts: Contacts.IContact[];
  mailboxes: IMAP.IMailbox[];
  messages: IMAP.IMessage[];
  currentMailbox: string;
  messageID: string;
  messageDate: string;
  messageFrom: string;
  messageTo: string;
  messageSubject: string;
  messageBody: string;
  contactID: number | null;
  contactName: string;
  contactEmail: string;
  currentView: "welcome" | "message" | "compose" | "contact" | "contactAdd";
  showHidePleaseWait: (inVisible: boolean) => void;
  addMailboxToList: (inMailbox: IMAP.IMailbox) => void;
  addContactToList: (inContact: Contacts.IContact) => void;
  showComposeMessage: (inType: string) => void;
  showAddContact: () => void;
  setCurrentMailbox: (inPath: string) => void;
  getMessages: (inPath: string) => void;
  clearMessages: () => void;
  addMessageToList: (inMessage: IMAP.IMessage) => void;
  showContact: (inID: number, inName: string, inEmail: string) => void;
  fieldChangeHandler: (inEvent: React.ChangeEvent<HTMLInputElement>) => void;
  saveContact: () => void;
  deleteContact: () => void;
  showMessage: (inMessage: IMAP.IMessage) => void;
  deleteMessage: () => void;
  sendMessage: () => void;
}

let stateSingleton: IState | null = null;

const createState = (inParentComponent: React.Component): IState => {
  if (stateSingleton === null) {
    stateSingleton = {
      pleaseWaitVisible: false,
      contacts: [],
      mailboxes: [],
      messages: [],
      currentMailbox: "",
      messageID: "",
      messageDate: "",
      messageFrom: "",
      messageTo: "",
      messageSubject: "",
      messageBody: "",
      contactID: null,
      contactName: "",
      contactEmail: "",
      currentView: "welcome",

      showHidePleaseWait: (inVisible: boolean) => {
        inParentComponent.setState({ pleaseWaitVisible: inVisible });
      },

      addMailboxToList: (inMailbox: IMAP.IMailbox) => {
        inParentComponent.setState((prevState: IState) => ({
          mailboxes: [...prevState.mailboxes, inMailbox],
        }));
      },

      addContactToList: (inContact: Contacts.IContact) => {
        inParentComponent.setState((prevState: IState) => ({
          contacts: [...prevState.contacts, inContact],
        }));
      },

      showComposeMessage: (inType: string) => {
        const parentState = inParentComponent.state as IState;
        switch (inType) {
          case "new":
            inParentComponent.setState({
              currentView: "compose",
              messageTo: "",
              messageSubject: "",
              messageBody: "",
              messageFrom: config.userEmail,
            });
            break;
          case "reply":
            inParentComponent.setState({
              currentView: "compose",
              messageTo: parentState.messageFrom,
              messageSubject: `Re: ${parentState.messageSubject}`,
            });
            break;
          case "contact":
            inParentComponent.setState({
              currentView: "compose",
              messageTo: parentState.contactEmail,
              messageSubject: "",
              messageBody: "",
              messageFrom: config.userEmail,
            });
            break;
        }
      },

      showAddContact: () => {
        inParentComponent.setState({
          currentView: "contactAdd",
          contactID: null,
          contactName: "",
          contactEmail: "",
        });
      },

      setCurrentMailbox: (inPath: string) => {
        const parentState = inParentComponent.state as IState;
        inParentComponent.setState({ currentView: "welcome", currentMailbox: inPath });
        parentState.getMessages(inPath);
      },

      getMessages: async (inPath): Promise<void> => {
        const parentState = inParentComponent.state as IState;
        parentState.showHidePleaseWait(true);
        const imapWorker: IMAP.Worker = new IMAP.Worker();
        const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
        parentState.showHidePleaseWait(false);
        parentState.clearMessages();

        messages.forEach((inMessage: IMAP.IMessage) => {
          parentState.addMessageToList(inMessage);
        });
      },

      clearMessages: () => {
        inParentComponent.setState({ messages: [] });
      },

      addMessageToList: (inMessage: IMAP.IMessage) => {
        inParentComponent.setState((prevState: IState) => ({
          messages: [...prevState.messages, inMessage],
        }));
      },

      showContact: (inID: number, inName: string, inEmail: string) => {
        inParentComponent.setState({
          currentView: "contact",
          contactID: inID,
          contactName: inName,
          contactEmail: inEmail,
        });
      },

      fieldChangeHandler: (inEvent: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value } = inEvent.target;
        inParentComponent.setState({ [id]: value });
      },

      saveContact: async (): Promise<void> => {
        const parentState = inParentComponent.state as IState;
        const contactsWorker = new Contacts.Worker();
        const contact = await contactsWorker.addContact({
          name: parentState.contactName,
          email: parentState.contactEmail,
        });
        inParentComponent.setState((prevState: IState) => ({
          contacts: [...prevState.contacts, contact],
          contactID: null,
          contactName: "",
          contactEmail: "",
        }));
      },

      deleteContact: async (): Promise<void> => {
        const parentState = inParentComponent.state as IState;
        if (parentState.contactID !== null) {
          const contactsWorker = new Contacts.Worker();
          await contactsWorker.deleteContact(parentState.contactID);
          inParentComponent.setState((prevState: IState) => ({
            contacts: prevState.contacts.filter(
              (contact) => contact.id !== parentState.contactID
            ),
            contactID: null,
            contactName: "",
            contactEmail: "",
          }));
        }
      },

      showMessage: async (inMessage: IMAP.IMessage): Promise<void> => {
        const parentState = inParentComponent.state as IState;
        parentState.showHidePleaseWait(true);
        const imapWorker = new IMAP.Worker();
        const body = await imapWorker.getMessageBody(inMessage.id, parentState.currentMailbox);
        parentState.showHidePleaseWait(false);
        inParentComponent.setState({
          currentView: "message",
          messageID: inMessage.id,
          messageDate: inMessage.date,
          messageFrom: inMessage.from,
          messageTo: inMessage.to,
          messageSubject: inMessage.subject,
          messageBody: body,
        });
      },

      deleteMessage: async (): Promise<void> => {
        const parentState = inParentComponent.state as IState;
        if (parentState.messageID) {
          const imapWorker = new IMAP.Worker();
          await imapWorker.deleteMessage(parentState.messageID, parentState.currentMailbox);
          inParentComponent.setState({
            currentView: "welcome",
            messageID: "",
            messageDate: "",
            messageFrom: "",
            messageTo: "",
            messageSubject: "",
            messageBody: "",
          });
          parentState.getMessages(parentState.currentMailbox);
        }
      },

      sendMessage: async (): Promise<void> => {
        const parentState = inParentComponent.state as IState;
        const smtpWorker = new SMTP.Worker();
        await smtpWorker.sendMessage(
          parentState.messageTo,
          parentState.messageFrom,
          parentState.messageSubject,
          parentState.messageBody
        );
        inParentComponent.setState({
          currentView: "welcome",
          messageTo: "",
          messageSubject: "",
          messageBody: "",
        });
      },
    };
  }
  return stateSingleton;
};


const getState = (): IState => stateSingleton!;

export { createState, getState };
