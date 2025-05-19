import * as React from "react";
import { useState } from "react";
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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { navLinks } from "../../constants/navLinks";
import { motion } from "framer-motion";
import { useScrollSpy } from "../../hooks/useScrollSpy";

import AboutSection from "../sections/AboutSection";
import SkillsSection from "../sections/SkillsSection";
import ContactSection from "../sections/ContactSection";
import SelectedProjectsSection from "../sections/SelectedProjectsSection";
import { useMediaQuery } from "@mui/material";

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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const sectionIds = ["about", "skills", "journey", "projects", "connect"];
  const [manualActiveSection, setManualActiveSection] = useState<
    string | undefined
  >("about");

  const observedSection = useScrollSpy(sectionIds, 64);

  const activeSection = manualActiveSection || observedSection;

  const handleNavClick = (id: string) => {
    setManualActiveSection(id); // Highlight immediately
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -64;
      const y = section.offsetTop + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setTimeout(() => {
      // handleDrawerClose();
      setManualActiveSection(undefined); // ✅ Release back to scroll spy after 1s
    }, 300); // Adjust delay if needed
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
            sx={{
              display: { xs: "none", sm: open ? "none" : "inline-flex" },
            }}
          >
            <LastPageIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src="/THosang.svg"
              alt="Terrence Hosang Logo"
              sx={{
                height: { xs: 40, sm: 48 }, // smaller logo on phone
                width: "auto",
                marginLeft: { xs: 0, sm: 2 },
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                // Hide on extra-small screens
                display: { xs: "block", sm: "block" },
              }}
            >
              Terrence Hosang
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon sx={{ color: theme.palette.text.primary }} />
            ) : (
              <MenuOpenIcon sx={{ color: theme.palette.text.primary }} />
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
                    activeSection === id ? "var(--tertiary-100)" : "inherit",
                  backgroundColor:
                    activeSection === id ? "var(--primary-600)" : "transparent",
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
                      activeSection === id ? "var(--tertiary-100)" : "inherit",
                  }}
                >
                  <Icon />
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

      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <DrawerHeader />
        <AboutSection id="about" />
        <SkillsSection id="skills" />
        <MotionDiv
          id="journey"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box height={"90vh"} p={3}>
            <Typography variant="h4" gutterBottom>
              Journey
            </Typography>
            <Typography>My path to where I am today.</Typography>
          </Box>
        </MotionDiv>
        <SelectedProjectsSection id="projects" />
        <ContactSection id="connect" />
      </Box>
    </Box>
  );
}
