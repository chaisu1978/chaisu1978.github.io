import { useState } from "react";
import { Box, Typography, Grid, Tooltip, Snackbar } from "@mui/material";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CardActionArea } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const MotionBox = motion(Box as any);

interface ContactSectionProps {
  id: string;
}

export default function ContactSection({ id }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("thosang@gmail.com");
    setCopied(true);
  };

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
          Connect with me
        </Typography>
        <Typography variant="body1">
          I'd love to hear from you. Let's build something great together.
        </Typography>
      </motion.div>

      <Grid container spacing={4} justifyContent="left" mt={4}>
        {/* Email Box */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <Tooltip title="Click to copy email" placement="top">
            <MotionBox
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 2,
                border: "1px solid var(--neutral-500)",
                backgroundColor: "background.paper",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardActionArea
                onClick={handleCopy}
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                }}
              >
                {/* Copy icon top-right */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    opacity: 0.5,
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </Box>

                <Icon icon="mdi:email" width="48" height="48" />
                <Typography variant="h6">Email</Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }}>
                  th---g@g---.com
                </Typography>
              </CardActionArea>
            </MotionBox>
          </Tooltip>
        </Grid>

        {/* LinkedIn & GitHub */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <Tooltip title="Open LinkedIn profile" placement="top">
            <MotionBox
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 2,
                border: "1px solid var(--neutral-500)",
                backgroundColor: "background.paper",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardActionArea
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/terrence-hosang-85837b93/",
                    "_blank"
                  )
                }
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                }}
              >
                {/* Decorative "open in new tab" icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    opacity: 0.5,
                  }}
                >
                  <OpenInNewIcon fontSize="small" />
                </Box>

                <Icon icon="mdi:linkedin" width="48" height="48" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  LinkedIn
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.6, textAlign: "center" }}
                >
                  linkedin.com/in/terrence-hos...
                </Typography>
              </CardActionArea>
            </MotionBox>
          </Tooltip>
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
          <Tooltip title="Open GitHub profile" placement="top">
            <MotionBox
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: 2,
                border: "1px solid var(--neutral-500)",
                backgroundColor: "background.paper",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardActionArea
                onClick={() =>
                  window.open("https://github.com/chaisu1978/", "_blank")
                }
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                }}
              >
                {/* Decorative "open in new tab" icon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    opacity: 0.5,
                  }}
                >
                  <OpenInNewIcon fontSize="small" />
                </Box>

                <Icon icon="mdi:github" width="48" height="48" />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  GitHub
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.6, textAlign: "center" }}
                >
                  github.com/chaisu1978
                </Typography>
              </CardActionArea>
            </MotionBox>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Copy feedback */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Email copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
