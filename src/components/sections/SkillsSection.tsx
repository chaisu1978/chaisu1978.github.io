import { Box, Typography, Grid } from "@mui/material";
import { Icon } from "@iconify/react";
import { skillsList } from "../../constants/skillsList";
import { motion } from "framer-motion";

interface SkillsSectionProps {
  id: string;
}

export default function SkillsSection({ id }: SkillsSectionProps) {
  return (
    <Box
      id={id}
      sx={{
        py: 4,
        px: 3,
        backgroundColor: "background.default",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom>
          Skills & Technologies
        </Typography>
      </motion.div>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        {skillsList.map((skill, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
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
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
