import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router';
import Brand from './Brand';

// Slide-out navigation drawer. The header owns the open state and the list of items.
const SideBar = ({ open, onClose, items, isActive }) => {
    return (
        <Drawer
            variant="temporary"
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true, // this will make it perform better on mobile.
            }}
            slotProps={{ paper: { sx: { width: 280 } } }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2 }}>
                <Brand onClick={onClose} />
                <IconButton onClick={onClose} aria-label="Close menu" size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            <Divider />
            <Typography variant="overline" color="text.secondary" sx={{ px: 3, pt: 2.5, pb: 0.5 }}>
                Navigation
            </Typography>
            <List sx={{ px: 1.5 }}>
                {items.map(({ label, to, icon }) => (
                    <ListItemButton
                        key={to}
                        component={Link} nativeButton={false}
                        to={to}
                        selected={isActive(to)}
                        onClick={onClose}
                        sx={{ mb: 0.5 }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
                        <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};

export { SideBar };
