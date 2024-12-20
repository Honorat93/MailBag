import path from "path";
import * as IMAP from "./IMAP"; 
import { serverInfo } from "./ServerInfo"; 
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";

const app: Express = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
  origin: "http://localhost:8080", 
  methods: "GET,POST,PUT,DELETE", 
  allowedHeaders: "Content-Type,Authorization", 
}));



app.use(express.json());


app.get("/mailboxes", async (req: Request, res: Response) => {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const mailboxes = await imapWorker.listMailboxes();
        console.log("Liste des boîtes mail récupérée:", mailboxes);
        res.json(mailboxes);
    } catch (error) {
        console.error("Erreur lors de la récupération des boîtes mail:", error);
        res.status(500).send("Erreur lors de la récupération des boîtes mail.");
    }
});

app.get("/mailboxes/:mailbox", async (req: Request, res: Response) => {
    const mailbox = req.params.mailbox;
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const messages = await imapWorker.listMessages({ mailbox });
        console.log(`Messages récupérés pour la boîte mail "${mailbox}":`, messages);
        res.json(messages);
    } catch (error) {
        console.error(`Erreur lors de la récupération des messages pour "${mailbox}":`, error);
        res.status(500).send("Erreur lors de la récupération des messages.");
    }
});

// Route pour obtenir le contenu d'un message
app.get("/messages/:mailbox/:id", async (req: Request, res: Response) => {
    const { mailbox, id } = req.params;
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const messageBody = await imapWorker.getMessageBody({
            mailbox,
            id: parseInt(id, 10),
        });
        console.log(`Contenu du message pour "${mailbox}", ID "${id}":`, messageBody);
        res.send(messageBody);
    } catch (error) {
        console.error(`Erreur lors de la récupération du message pour "${mailbox}", ID "${id}":`, error);
        res.status(500).send("Erreur lors de la récupération du message.");
    }
});

// Route pour supprimer un message
app.delete("/messages/:mailbox/:id", async (req: Request, res: Response) => {
    const { mailbox, id } = req.params;
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        await imapWorker.deleteMessage({
            mailbox,
            id: parseInt(id, 10),
        });
        console.log(`Message supprimé dans "${mailbox}", ID "${id}".`);
        res.send("Message supprimé avec succès.");
    } catch (error) {
        console.error(`Erreur lors de la suppression du message pour "${mailbox}", ID "${id}":`, error);
        res.status(500).send("Erreur lors de la suppression du message.");
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Le serveur est démarré sur le port ${port}`);
});
