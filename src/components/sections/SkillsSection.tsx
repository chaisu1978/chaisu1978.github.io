import { Box, Typography, Grid } from "@mui/material";
import { Icon } from "@iconify/react";
import { skillsList } from "../../constants/skillsList";

interface SkillsSectionProps {
  id: string;
}

export default function SkillsSection({ id }: SkillsSectionProps) {
  return (
    <Box id={id} sx={{ py: 4, px: 3, backgroundColor: "background.default" }}>
      <Typography variant="h4" gutterBottom>
        Skills & Technologies
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        {skillsList.map((skill, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Icon icon={skill.icon} width="48" height="48" />
              <Typography variant="body1" sx={{ mt: 1 }}>
                {skill.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
