import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { Link } from "react-router-dom";
import type Phaser from "phaser";
import { sfx } from "../game/audio";

export default function AdventurePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(sfx.muted);

  useEffect(() => {
    let game: Phaser.Game | null = null;
    let cancelled = false;

    (async () => {
      const { createGame } = await import("../game/createGame");
      if (cancelled || !containerRef.current) return;
      game = createGame(containerRef.current);
    })();

    return () => {
      cancelled = true;
      game?.destroy(true);
      game = null;
    };
  }, []);

  return (
    <Box sx={{ position: "fixed", inset: 0, backgroundColor: "#030813" }}>
      <Box
        ref={containerRef}
        sx={{ width: "100%", height: "100%", "& canvas": { display: "block" } }}
      />
      <Tooltip title="Back to portfolio">
        <IconButton
          component={Link}
          to="/"
          aria-label="back to portfolio"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 10,
            color: "var(--tertiary-300)",
            backgroundColor: "rgba(24,31,44,0.7)",
            "&:hover": { backgroundColor: "rgba(24,31,44,0.9)" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={muted ? "Unmute" : "Mute"}>
        <IconButton
          aria-label={muted ? "unmute" : "mute"}
          onClick={() => {
            sfx.toggleMute();
            setMuted(sfx.muted);
          }}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            color: "var(--tertiary-300)",
            backgroundColor: "rgba(24,31,44,0.7)",
            "&:hover": { backgroundColor: "rgba(24,31,44,0.9)" },
          }}
        >
          {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
