import { Box, Typography, Grid } from "@mui/material";
import { Icon } from "@iconify/react";
import { skillsList } from "../../constants/skillsList";
import { motion } from "framer-motion";
const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & import("framer-motion").MotionProps
>;
interface SkillsSectionProps {
  id: string;
}

export default function SkillsSection({ id }: SkillsSectionProps) {
  return (
    <MotionDiv
      id="skills"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
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
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  {skill.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MotionDiv>
  );
}
