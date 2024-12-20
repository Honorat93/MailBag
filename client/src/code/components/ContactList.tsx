import React, { JSX } from "react";
import { IState } from "../state";
import { List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import Person from "@mui/icons-material/Person";
import * as Contacts from "../contact";


const ContactList = ({ state }: { state: IState }): JSX.Element => (
  <List>
    {state.contacts.map((value: Contacts.IContact) => 
      <ListItem key={value.id}> 
        <ListItemButton 
           onClick={() => value.id !== undefined && state.showContact(value.id, value.name, value.email)}
        >
          <ListItemAvatar>
            <Avatar> 
              <Person /> 
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={value.name} />
        </ListItemButton>
      </ListItem>
    )}
  </List>

)
export default ContactList;
