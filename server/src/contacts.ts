import { Low } from "lowdb";
import { JSONFile } from "lowdb/node"
import * as path from "path";

export interface IContact {
  id?: number,
  name: string,
  email: string
}

export class Worker {
  private db: Low<{ contacts: IContact[]}>

  constructor() {
    const filePath = path.join(__dirname, "contacts.json");
    const adapter = new JSONFile<{ contacts: IContact[]}>(filePath);
    this.db = new Low(adapter, { contacts: [] });

    this.db.read();
  }

  public async listContacts(): Promise<IContact[]> {
    await this.db.read();
    return this.db.data?.contacts || [];
  }

  public addContact(inContact: IContact): Promise<IContact> {
    return new Promise((resolve, reject) => {
      if(this.db.data && this.db.data.contacts) {
        inContact.id = this.db.data.contacts.length + 1;
        this.db.data.contacts.push(inContact)

        this.db.write()
        .then(() => {
          resolve(inContact)
        })
        .catch((err: Error) =>{
          reject(err);
        })
      } else {
        reject(new Error("Données invalides"));
      }
    })
  }

  public async deleteContact(inID: string): Promise<string> {
    await this.db.read();

    const contacts = this.db.data?.contacts;
    if (!contacts) {
      throw new Error("Données invalides");
    }

    const contactIndex = contacts.findIndex(contact => String(contact.id) === inID);
    if (contactIndex === -1) {
      throw new Error(`Contact avec l'ID "${inID}" introuvable`);
    }

    contacts.splice(contactIndex, 1); 
    await this.db.write();

    return `Contact avec l'ID "${inID}" supprimé`;
  }
  
}