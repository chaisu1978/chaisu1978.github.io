import * as React from "react";
import {
  Box,
  Typography,
  Toolbar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
} from "@mui/material";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { navLinks } from "../../constants/navLinks";
import { useState } from "react";
import { motion } from "framer-motion";

const drawerWidth = 200;

const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & import("framer-motion").MotionProps
>;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(5)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: theme.palette.primary.main, // or any color
      color: theme.palette.text.primary, // or custom color
      borderRight: `1px solid ${theme.palette.divider}`, // optional nice effect
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.text.primary,
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  }),
}));

export default function MiniDrawerLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const [activeSection, setActiveSection] = useState("about");

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} color="secondary">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Terrence Hosang
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon sx={{ color: theme.palette.text.primary }} />
            ) : (
              <ChevronLeftIcon sx={{ color: theme.palette.text.primary }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navLinks.map(({ label, id, icon: Icon }) => (
            <ListItem key={id} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => handleNavClick(id)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  color:
                    activeSection === id ? "var(--tertiary-300)" : "inherit",
                  backgroundColor:
                    activeSection === id ? "action.selected" : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color:
                      activeSection === id ? "var(--tertiary-300)" : "inherit",
                  }}
                >
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <MotionDiv
          id="about"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" gutterBottom>
            About
          </Typography>
          <Typography>Brief about me...</Typography>
        </MotionDiv>
        <MotionDiv
          id="projects"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" gutterBottom>
            Projects
          </Typography>
          <Typography>Some cool things I’ve built.</Typography>
        </MotionDiv>
        <MotionDiv
          id="experience"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" gutterBottom>
            Experience
          </Typography>
          <Typography>Work history and highlights.</Typography>
        </MotionDiv>
        <MotionDiv
          id="contact"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" gutterBottom>
            Contact
          </Typography>
          <Typography>Let’s connect!</Typography>
        </MotionDiv>
      </Box>
    </Box>
  );
}
