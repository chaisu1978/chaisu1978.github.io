import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { motion } from "framer-motion";
import { ProjectItem } from "../../constants/projectsList";

interface ProjectModalProps {
  project: ProjectItem;
  open: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  open,
  onClose,
}: ProjectModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.3 },
        sx: {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(24, 24, 24, 0.92)",
          color: "text.primary",
          borderRadius: 2,
          border: "4px solid var(--neutral-600)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ position: "relative", pr: 6 }}>
        <Typography variant="h5" fontWeight="bold">
          {project.title}
        </Typography>
        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {project.tech.map((tech) => (
            <Chip key={tech} label={tech} size="small" color="secondary" />
          ))}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "text.primary",
            opacity: 0.6,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* Image or logo */}
        <Box
          component="img"
          src={project.image}
          alt={project.title}
          sx={{
            maxWidth: { xs: "100%", md: 550 },
            width: "100%",
            borderRadius: 2,
            objectFit: "cover",
            boxShadow: 4,
          }}
        />

        {/* Description */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {project.description}
          </Typography>
        </Box>
      </DialogContent>

      {/* Action buttons */}
      {(project.github || project.liveDemo) && (
        <DialogActions>
          {project.github && (
            <Button
              size="small"
              component={Link}
              href={project.github}
              target="_blank"
              rel="noopener"
              startIcon={<OpenInNewIcon />}
              sx={{ color: "text.primary" }}
            >
              GitHub
            </Button>
          )}
          {project.liveDemo && (
            <Button
              size="small"
              component={Link}
              href={project.liveDemo}
              target="_blank"
              rel="noopener"
              startIcon={<OpenInNewIcon />}
              sx={{ color: "text.primary" }}
            >
              Live Demo
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
