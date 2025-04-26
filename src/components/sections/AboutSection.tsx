import { Box, Typography, Container } from "@mui/material";

interface AboutSectionProps {
  id: string;
}

export default function AboutSection({ id }: AboutSectionProps) {
  return (
    <Box
      id={id}
      sx={{
        position: "relative",
        width: "100%",
        height: "75vh", // full screen height
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <Box
        component="video"
        src="/background.mp4"
        autoPlay
        muted
        loop
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Foreground Content */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 1,
          color: "white",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography variant="h2" gutterBottom>
          Hi, I'm Terrence Hosang
        </Typography>
        <Typography variant="h5">
          Full-Stack Developer | Designer | Problem Solver
        </Typography>
      </Container>
    </Box>
  );
}
