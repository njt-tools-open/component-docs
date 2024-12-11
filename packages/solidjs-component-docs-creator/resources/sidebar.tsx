import Box from '@suid/material/Box';
import Drawer from '@suid/material/Drawer';
import ListItem from '@suid/material/ListItem';
import ListItemButton from '@suid/material/ListItemButton';
import ListItemIcon from '@suid/material/ListItemIcon';
import useTheme from '@suid/material/styles/useTheme';
import { useLocation, RouteDefinition, A } from '@solidjs/router';
import { createMemo, JSXElement } from 'solid-js';

type SidebarProps = {
  items: (RouteDefinition & {
    name: string;
    noSidebar?: boolean;
    icon?: JSXElement;
  })[];
};

const SidebarItem = ({
  options,
  prevPath,
}: {
  options: RouteDefinition & { name: string };
  prevPath: string;
}) => {
  const location = useLocation();
  const pathname = `${prevPath}${options.path}`;
  const selected = createMemo(() => location.pathname === pathname);
 
  return (
    <ListItem
      disablePadding
      sx={{
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <ListItemButton
        selected={selected()}
        sx={{
          pl: '44px',
          fontWeight: 600,
          letterSpacing: 2,
          fontSize: 14,
          color: '#616161',
        }}
      >
        <A href={pathname}>
        {options.name}
        </A>
      </ListItemButton>
    </ListItem>
  );
};

export default function Sidebar({ items = [] }: SidebarProps): JSXElement {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 360,
            overflow: 'auto',
            bgcolor: theme.palette.background.paper,
          }}
        >
          <div style={{ height: '72px' }}></div>
          <nav aria-label="main mailbox folders">
            {items
              .filter(item => !item.noSidebar)
              .map(item => (
                <>
                  <ListItem
                    sx={{
                      fontWeight: 600,
                      color: '#424242',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 28,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {item.name}
                  </ListItem>
                  {(
                    (item.children as (RouteDefinition & { name: string })[]) ??
                    []
                  ).map(child => (
                    <SidebarItem options={child} prevPath={item.path} />
                  ))}
                  <hr
                    role="separator"
                    class="MuiDivider-root MuiDivider-fullWidth"
                  ></hr>
                </>
              ))}
          </nav>
        </Box>
      </Drawer>
    </Box>
  );
}
