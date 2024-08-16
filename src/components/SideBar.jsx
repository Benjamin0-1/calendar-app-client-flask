import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: 240,
        flexShrink: 0,
        [theme.breakpoints.down('sm')]: {
            display: 'block',
        },
    },
    drawerPaper: {
        width: 240,
    },
    toolbar: theme.mixins.toolbar,
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    hide: {
        display: 'none',
    },
    closeButton: {
        margin: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
}));

const SideBar = () => {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false); // State variable to track sidebar visibility

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleSidebar}
                edge="start"
                className={classes.menuButton}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                className={classes.drawer}
                variant="temporary"
                classes={{
                    paper: classes.drawerPaper,
                }}
                open={isOpen} 
                onClose={toggleSidebar}
                ModalProps={{
                    keepMounted: true, // this will make it perform better on mobile.
                }}
            >
                <div className={classes.toolbar} />
                <IconButton
                    edge="start"
                    className={classes.closeButton}
                    onClick={toggleSidebar}
                >
                    <CloseIcon />
                </IconButton>
                <List>
                    <ListItem button component={Link} to="/home">
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button component={Link} to="/profile">
                        <ListItemIcon>
                            <ProfileIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button component={Link} to="/settings">
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                    <ListItem button component={Link} to="/faq">
                        <ListItemIcon>
                            <MailIcon />
                        </ListItemIcon>
                        <ListItemText primary="FAQ" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export { SideBar };
