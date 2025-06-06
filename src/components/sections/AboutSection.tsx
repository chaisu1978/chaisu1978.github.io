import { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

/* MUI Box wrapped for stagger + sx */
const MotionBox = motion(Box as any);

interface AboutSectionProps {
  id: string;
}

export default function AboutSection({ id }: AboutSectionProps) {
  /* background‐video parallax */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);

  /* simple loader state */
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <Box
      id={id}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "85vh",
        overflow: "hidden",
        borderBottom: "4px solid var(--secondary-700)",
      }}
    >
      {/* ---------------- video with animated wrapper ---------------- */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          y,
        }}
      >
        <Box
          component="video"
          src="/background.mp4"
          autoPlay
          muted
          loop
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </motion.div>

      {/* loader */}
      {!videoLoaded && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(24,31,44,0.85)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      )}

      {/* dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(24,31,44,0.7)",
          zIndex: 1,
        }}
      />

      {/* ---------------- foreground content ---------------- */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-around",
          p: { xs: 4, md: 8 },
        }}
      >
        {/* text column, staggered */}
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.3 } },
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            maxWidth: { xs: "100%", md: "50%" },
            textAlign: { xs: "left", md: "left" },
            textShadow:
              "0 0 16px rgba(0,0,0,0.9),0 0 16px rgba(0,0,0,0.9),0 0 16px rgba(0,0,0,0.9)",
          }}
        >
          {[
            <Typography key="h2" variant="h2" gutterBottom>
              Hi, I’m Terrence
            </Typography>,
            <Typography key="h6" variant="h6">
              Full-Stack Developer | Systems Management | Problem Solver
            </Typography>,
            <Typography key="p" variant="body1" sx={{ mt: 2 }}>
              I’ve worked in tech for over 25 years — starting with building
              websites in Trinidad and the UK, then diving into enterprise
              infrastructure, systems management and support. Today, I focus on
              crafting full-stack web applications using modern tools and
              processes; crafting intuitive, reliable, and engaging web
              experiences.
            </Typography>,
          ].map((el, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 * i }}
            >
              {el}
            </motion.div>
          ))}

          {/* button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <Box sx={{ mt: 4 }}>
              <Button
                onClick={() => {
                  const el = document.getElementById("projects");
                  if (el) {
                    window.scrollTo({
                      top: el.offsetTop - 64,
                      behavior: "smooth",
                    });
                  }
                }}
                sx={{
                  backgroundColor: "var(--secondary-700)",
                  color: "text.primary",
                  px: 3,
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "var(--tertiary-700)" },
                }}
              >
                See Projects
              </Button>
            </Box>
          </motion.div>
        </MotionBox>

        {/* profile picture with animated wrapper */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
        >
          <Box
            component="img"
            src="/my-profile-image.png"
            alt="Terrence Hosang"
            sx={{
              mt: { xs: 4, md: 0 },
              maxWidth: 300,
              objectFit: "cover",
            }}
          />
        </motion.div>
      </Box>

      {/* scroll-down arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: "absolute",
          bottom: 2,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          fontSize: "2rem",
          color: "text.primary",
        }}
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 3.7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ArrowDownwardIcon
            sx={{
              fontSize: "1.2rem",
              color: "var(--tertiary-700)",
              cursor: "pointer",
            }}
            onClick={() => {
              const el = document.getElementById("skills");
              if (el) {
                window.scrollTo({
                  top: el.offsetTop - 64,
                  behavior: "smooth",
                });
              }
            }}
          />
        </motion.div>
      </motion.div>
    </Box>
  );
}
