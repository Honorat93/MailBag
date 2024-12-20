import { getState } from "./state";
import * as IMAP from "./IMAP"; 
import * as Contacts from "./contact"; 

export const intervalFunction = (inParentComponent: React.Component): void => {
    if( getState() === null) {
        setTimeout(intervalFunction, 1000)
    } else {
        startupFunction()
    }
}
intervalFunction;


const startupFunction = (): void => {
    getState().showHidePleaseWait(true);

    const getMailboxes = async (): Promise<any> => {
        const imapWorker: IMAP.Worker = new IMAP.Worker();
        const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();

        mailboxes.forEach((inMailbox) => {
            getState().addMailboxToList(inMailbox);
        });
    };

    getMailboxes().then(() => {
        const getContacts =  async (): Promise<any> => {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contacts: Contacts.IContact[] = await contactsWorker.listContacts();

            contacts.forEach((inContact) => {
                getState().addContactToList(inContact);
            });
        };

        getContacts().then(() => {
            getState().showHidePleaseWait(false);
        })
    });
}




