import { ImapFlow } from "imapflow";
import { IServerInfo } from "./ServerInfo";
import { ParsedMail, simpleParser } from "mailparser";

export interface ICallOptions {
    mailbox: string;
    id?: number;
}

export interface IMessage {
    id: string;
    date: Date;
    from: string;
    subject: string;
    body?: string;
}

export interface IMailbox {
    name: string;
    path: string;
}

export class Worker {
    private static serverInfo: IServerInfo;

    constructor(inServerInfo: IServerInfo) {
        Worker.serverInfo = inServerInfo;
    }

    private async connectToServer(): Promise<ImapFlow> {
        console.info("[IMAP] Attempting to connect to server...");
        const client = new ImapFlow({
            host: Worker.serverInfo.imap.host,
            port: Worker.serverInfo.imap.port,
            auth: {
                user: Worker.serverInfo.imap.auth.user,
                pass: Worker.serverInfo.imap.auth.pass,
            },
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
            logger: {
                debug: console.debug,
                info: console.info,
                warn: console.warn,
                error: console.error,
            },
        });

        client.on("error", (error: Error) => {
            console.error("[IMAP] Client error:", error.message);
        });

        try {
            await client.connect();
            console.info("[IMAP] Connected successfully!");
            return client;
        } catch (error) {
            console.error("[IMAP] Failed to connect to server:", error);
            throw error;
        }
    }

    /**
     * List all mailboxes on the IMAP server.
     */
    public async listMailboxes(): Promise<IMailbox[]> {
        const client: ImapFlow = await this.connectToServer();
        console.info("[IMAP] Fetching list of mailboxes...");
        try {
            const mailboxes = await client.list();
            console.info(`[IMAP] Found ${mailboxes.length} mailboxes.`);
            const finalMailBoxes: IMailbox[] = mailboxes.map((mailbox) => ({
                name: mailbox.name,
                path: mailbox.path,
            }));
            return finalMailBoxes;
        } catch (error) {
            console.error("[IMAP] Error listing mailboxes:", error);
            throw error;
        } finally {
            await client.close();
            console.info("[IMAP] Connection closed after listing mailboxes.");
        }
    }

    public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {
        console.info(`[IMAP] Opening mailbox: ${inCallOptions.mailbox}...`);
       
        const client: ImapFlow = await this.connectToServer();
        try {
            const mailbox = await client.mailboxOpen(inCallOptions.mailbox);
            if (mailbox.exists === 0) {
                console.warn(`[IMAP] Mailbox ${inCallOptions.mailbox} is empty.`);
                return [];
            }
    
            const finalMessages: IMessage[] = [];
            for await (const msg of client.fetch("1:*", { uid: true, envelope: true })) {
                finalMessages.push({
                    id: msg.uid.toString(),
                    date: msg.envelope.date,
                    from: msg.envelope.from?.[0]?.address || "unknown@example.com",
                    subject: msg.envelope.subject || "(No subject)",
                });
            }
    
            return finalMessages;
        } catch (error) {
            console.error(`[IMAP] Error fetching messages in ${inCallOptions.mailbox}:`, error);
            throw error;
        } finally {
            await client.close();
            console.info("[IMAP] Connection closed after listing messages.");
        }
    }
    
    public async getMessageBody(inCallOptions: ICallOptions): Promise<string | undefined> {
    
        const client: ImapFlow = await this.connectToServer();
        try {
            await client.mailboxOpen(inCallOptions.mailbox);
    
            if (!inCallOptions.id) {
                throw new Error("[IMAP] Message ID is required to fetch the body.");
            }
    
            const messages = await client.fetch(inCallOptions.id.toString(), { uid: true, source: true });
            let rawMessage = "";
    
            for await (const message of messages) {
                rawMessage = message.source.toString();
            }
    
            const parsed: ParsedMail = await simpleParser(rawMessage);
            return parsed.text || parsed.html || undefined;
        } catch (error) {
            console.error(`[IMAP] Error fetching message body for UID ${inCallOptions.id}:`, error);
            throw error;
        } finally {
            await client.close();
        }
    }
    

    public async deleteMessage(inCallOptions: ICallOptions): Promise<void> {
        const client: ImapFlow = await this.connectToServer();
        console.info(`[IMAP] Opening mailbox: ${inCallOptions.mailbox}...`);
        try {
            await client.mailboxOpen(inCallOptions.mailbox);

            if (!inCallOptions.id) {
                throw new Error("[IMAP] Message ID is required to delete the message.");
            }

            console.info(`[IMAP] Deleting message UID: ${inCallOptions.id}...`);
            await client.messageDelete(inCallOptions.id.toString(), { uid: true });
            console.info(`[IMAP] Message UID ${inCallOptions.id} deleted successfully.`);
        } catch (error) {
            console.error(`[IMAP] Error deleting message UID ${inCallOptions.id}:`, error);
            throw error;
        } finally {
            await client.close();
            console.info("[IMAP] Connection closed after deleting message.");
        }
    }
}
