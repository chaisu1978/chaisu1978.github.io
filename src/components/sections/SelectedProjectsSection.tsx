import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { projectsList, ProjectType } from "../../constants/projectsList";
import ProjectCard from "../projects/ProjectCard";
import { motion, AnimatePresence } from "framer-motion";
import ProjectModal from "../projects/ProjectModal";

const MotionBox = motion(Box as any);

const filters: (ProjectType | "All")[] = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
];

export default function SelectedProjectsSection({ id }: { id: string }) {
  const [activeFilter, setActiveFilter] = useState<ProjectType | "All">("All");
  const [openProject, setOpenProject] = useState<number | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filteredProjects =
    activeFilter === "All"
      ? projectsList
      : projectsList.filter((proj) => proj.type === activeFilter);

  return (
    <Box
      id={id}
      sx={{
        py: 4,
        px: { xs: 2, md: 6 },
        backgroundColor: "background.default",
        minHeight: "90vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom>
          Selected Projects
        </Typography>
        <Typography variant="body1">
          Web and mobile apps I've designed, built, or contributed to.
        </Typography>
      </motion.div>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 4,
          flexWrap: "wrap",
        }}
      >
        {filters.map((filter) => (
          <Button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            sx={{
              backgroundColor:
                activeFilter === filter ? "secondary.main" : "transparent",
              color:
                activeFilter === filter
                  ? "primary.contrastText"
                  : "text.primary",
              border: "1px solid",
              borderColor:
                activeFilter === filter ? "secondary.main" : "divider",
              "&:hover": {
                backgroundColor:
                  activeFilter === filter ? "secondary.dark" : "action.hover",
              },
            }}
          >
            {filter}
          </Button>
        ))}
      </Box>

      {/* Project Cards */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <AnimatePresence mode="wait">
          {filteredProjects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={project.title}>
              <ProjectCard
                project={project}
                onClick={() => setOpenProject(index)}
              />
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {openProject !== null && (
        <ProjectModal
          project={filteredProjects[openProject]}
          open={true}
          onClose={() => setOpenProject(null)}
        />
      )}
    </Box>
  );
}
