import path from "path";
import * as IMAP from "./IMAP"; 
import { serverInfo } from "./ServerInfo"; 
import express, { Express, Request, Response } from "express";

const app: Express = express();

// Middleware pour interpréter le json dans les requêtes
app.use(express.json());


// Route pour obtenir la liste des boîtes mail
app.get("/mailboxes", async (req: Request, res: Response) => {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const mailboxes = await imapWorker.listMailboxes();
        res.json(mailboxes);
    } catch (error) {
        console.error("Erreur lors de la récupération des boîtes mail:", error);
        res.status(500).send("Erreur lors de la récupération des boîtes mail.");
    }
});



// Route pour obtenir les messages d'une boîte mail
app.get("/mailboxes/:mailbox", async (req: Request, res: Response) => {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const messages = await imapWorker.listMessages({ mailbox: req.params.mailbox });
        res.json(messages);
    } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        res.status(500).send("Erreur lors de la récupération des messages.");
    }
});


// Route pour obtenir le contenu d'un message
app.get("/messages/:mailbox/:id", async (req: Request, res: Response) => {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        const messageBody = await imapWorker.getMessageBody({
            mailbox: req.params.mailbox,
            id: parseInt(req.params.id, 10),
        });
        res.send(messageBody);
    } catch (error) {
        console.error("Erreur lors de la récupération du message:", error);
        res.status(500).send("Erreur lors de la récupération du message.");
    }
});

// Route pour supprimer un message
app.delete("/messages/:mailbox/:id", async (req: Request, res: Response) => {
    try {
        const imapWorker = new IMAP.Worker(serverInfo);
        await imapWorker.deleteMessage({
            mailbox: req.params.mailbox,
            id: parseInt(req.params.id, 10),
        });
        res.send("Message supprimé avec succès.");
    } catch (error) {
        console.error("Erreur lors de la suppression du message:", error);
        res.status(500).send("Erreur lors de la suppression du message.");
    }
});


// Lancer le serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Le serveur est démarré sur le port ${port}`);
});
