import axios, { AxiosResponse } from "axios"
import { config } from "./config";
import { IconButtonClassKey } from "@mui/material";

export interface IContact {
    id?: number,
    name: string,
    email: string
  }
  

export class Worker {
    public async listContacts(): Promise<IContact[]> {
        const response: AxiosResponse = await axios.get
        (`${config.serverAddress}/contacts`);
        return response.data;
    }

    public async addContact(inContact: IContact): Promise<IContact> {
        const response: AxiosResponse = await axios.post
        (`${config.serverAddress}/contacts`, inContact);
        return response.data ;
    }

    public async deleteContact(InID: number): Promise<void> {
        await axios.delete
        (`${config.serverAddress}/contacts/${InID}`)
    }
}