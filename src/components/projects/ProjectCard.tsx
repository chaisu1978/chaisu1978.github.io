import { forwardRef } from "react";
import { Box, BoxProps, Typography, Chip, CardActionArea } from "@mui/material";
import { motion } from "framer-motion";
import { ProjectItem } from "../../constants/projectsList";

const MotionBox = motion(
  forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
    <Box ref={ref} {...props} />
  ))
);

interface ProjectCardProps {
  project: ProjectItem;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <MotionBox
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      sx={{
        p: 2,
        border: "1px solid var(--neutral-500)",
        borderRadius: 2,
        backgroundColor: "background.paper",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 240,
      }}
    >
      <CardActionArea onClick={onClick}>
        <Box
          component="img"
          src={project.image}
          alt={project.title}
          sx={{ width: "100%", borderRadius: 1 }}
        />
        <Typography variant="h6" sx={{ mt: 1 }}>
          {project.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
          {project.summary}
        </Typography>
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          {project.tech.slice(0, 3).map((t) => (
            <Chip key={t} label={t} size="small" />
          ))}
        </Box>
      </CardActionArea>
    </MotionBox>
  );
}
