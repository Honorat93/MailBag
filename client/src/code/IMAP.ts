import axios, { AxiosResponse } from "axios";
import { config } from "./config";

export interface IMailbox {
  name: string;
  path: string;
}

export interface IMessage {
  id: string;
  date: string;
  from: string;
  to: string;
  subject: string;
  body?: string;
}

export class Worker {
  public async listMailboxes(): Promise<IMailbox[]> {
    try {
      console.log("Envoi de la requête pour récupérer les boîtes mail...");
      const response: AxiosResponse = await axios.get(`${config.serverAddress}/mailboxes`);
      console.log("Réponse brute du serveur:", response);
      return response.data;
    } catch (error: unknown) {
      this.handleError("listMailboxes", error);
      return [];
    }
  }

  public async listMessages(inMailbox: string): Promise<IMessage[]> {
    try {
      console.log(`Envoi de la requête pour récupérer les messages de la boîte "${inMailbox}"...`);
      const response: AxiosResponse = await axios.get(`${config.serverAddress}/mailboxes/${inMailbox}`);
      console.log("Réponse brute du serveur:", response);
      return response.data.map((message: any) => ({
        id: message.id,
        date: message.date,
        from: message.from,
        to: message.to || "",
        subject: message.subject,
        body: message.body,
      }));
    } catch (error: unknown) {
      this.handleError("listMessages", error);
      return [];
    }
  }

  public async getMessageBody(inID: string, inMailbox: string): Promise<string> {
    try {
      console.log(`Envoi de la requête pour récupérer le corps du message ID "${inID}"...`);
      const response: AxiosResponse = await axios.get(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
      console.log("Réponse brute du serveur:", response);
      return response.data;
    } catch (error: unknown) {
      this.handleError("getMessageBody", error);
      return "";
    }
  }

  public async deleteMessage(inID: string, inMailbox: string): Promise<void> {
    try {
      console.log(`Envoi de la requête pour supprimer le message ID "${inID}"...`);
      await axios.delete(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
      console.log(`Message ID "${inID}" supprimé avec succès.`);
    } catch (error: unknown) {
      this.handleError("deleteMessage", error);
    }
  }

  private handleError(method: string, error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(`Erreur dans ${method}:`, error.response ? error.response.data : error.message);
    } else {
      console.error(`Erreur inconnue dans ${method}:`, error);
    }
  }
}
