// import MenuIcon from '@suid/icons-material/Menu';
import AppBar from '@suid/material/AppBar';
import Box from '@suid/material/Box';
// import IconButton from '@suid/material/IconButton';
import Toolbar from '@suid/material/Toolbar';
import Typography from '@suid/material/Typography';
import { JSXElement } from 'solid-js';

function Nav(): JSXElement {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        flexGrow: 1,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NJT Material
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Nav;
