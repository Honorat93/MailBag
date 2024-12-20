import React, { JSX } from "react";
import { IState } from "../state";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const Toolbar = ({ state }: { state: IState }): JSX.Element => (
  <Box sx={{ '& button': { m: 1 } }}>
    <div>
      <Button variant="outlined" size="small" startIcon={<EmailIcon />}
      onClick={() => state.showComposeMessage("new")}>
        New Message
      </Button>
      <Button variant="outlined" size="small" startIcon={<ContactMailIcon />}
      onClick={() => state.showAddContact()}>
        New Contact
      </Button>
    </div>
  </Box>
);

export default Toolbar;
