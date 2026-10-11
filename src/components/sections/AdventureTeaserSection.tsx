import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { Link } from "react-router-dom";

const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & import("framer-motion").MotionProps
>;

export default function AdventureTeaserSection() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          mx: { xs: 3, md: 8 },
          my: 6,
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(16,33,63,0.9), rgba(58,16,63,0.9))",
          border: "2px solid var(--tertiary-700)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <SportsEsportsIcon
          sx={{ fontSize: 56, color: "var(--tertiary-300)" }}
        />
        <Typography variant="h4" gutterBottom>
          Terrence's Tech Adventure
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 560, color: "var(--neutral-400)" }}
        >
          Play the journey — a retro platformer through 25+ years in tech, from
          dial-up days in Trinidad to remote full-stack work today.
        </Typography>
        <Button
          component={Link}
          to="/adventure"
          sx={{
            mt: 2,
            backgroundColor: "var(--tertiary-700)",
            color: "text.primary",
            px: 4,
            py: 1.5,
            borderRadius: "30px",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "var(--tertiary-600)" },
          }}
        >
          Play the Journey
        </Button>
      </Box>
    </MotionDiv>
  );
}
