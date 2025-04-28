import { useState } from "react";
import { Box, Typography, Button, MenuItem, Select, Grid } from "@mui/material";
import { Icon } from "@iconify/react";
import { skillsList } from "../../constants/skillsList";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsSectionProps {
  id: string;
}

export default function SkillsSection({ id }: SkillsSectionProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("All Skills");

  // Flatten all skills with group info for easier mapping
  const allSkills = skillsList.flatMap((group) =>
    group.skills.map((skill) => ({
      ...skill,
      group: group.group,
    }))
  );

  // Filtered skills based on selection
  const filteredSkills =
    selectedGroup === "All Skills"
      ? allSkills
      : allSkills.filter((skill) => skill.group === selectedGroup);

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
      {/* Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom>
          Skills & Technologies
        </Typography>
      </motion.div>

      {/* Layout: Filters + Skills */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-start" },
          gap: 4,
          mt: 4,
        }}
      >
        {/* Filter Menu (Desktop) */}
        <Box
          sx={{
            width: { xs: "100%", md: "30%" },
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* "All Skills" Button */}
          <Button
            onClick={() => setSelectedGroup("All Skills")}
            sx={{
              backgroundColor:
                selectedGroup === "All Skills"
                  ? "secondary.main"
                  : "transparent",
              color:
                selectedGroup === "All Skills"
                  ? "primary.contrastText"
                  : "text.primary",
              border: "1px solid",
              borderColor:
                selectedGroup === "All Skills" ? "secondary.main" : "divider",
              "&:hover": {
                backgroundColor:
                  selectedGroup === "All Skills"
                    ? "secondary.dark"
                    : "action.hover",
              },
            }}
          >
            All Skills
          </Button>

          {/* Group Buttons */}
          {skillsList.map((group) => (
            <Button
              key={group.group}
              onClick={() => setSelectedGroup(group.group)}
              sx={{
                backgroundColor:
                  selectedGroup === group.group
                    ? "secondary.main"
                    : "transparent",
                color:
                  selectedGroup === group.group
                    ? "primary.contrastText"
                    : "text.primary",
                border: "1px solid",
                borderColor:
                  selectedGroup === group.group ? "secondary.main" : "divider",
                "&:hover": {
                  backgroundColor:
                    selectedGroup === group.group
                      ? "secondary.dark"
                      : "action.hover",
                },
              }}
            >
              {group.group}
            </Button>
          ))}
        </Box>

        {/* Filter Menu (Mobile) */}
        <Box
          sx={{
            width: { xs: "100%", md: "70%" },
            display: { xs: "flex", md: "none" },
            mb: 2,
          }}
        >
          <Select
            fullWidth
            sx={{ backgroundColor: "background.paper" }}
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <MenuItem value="All Skills">All Skills</MenuItem>
            {skillsList.map((group) => (
              <MenuItem key={group.group} value={group.group}>
                {group.group}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Skills Grid (with Scroll Container) */}
        <Box
          sx={{
            width: { xs: "100%", md: "70%" },
            maxHeight: "70vh",
            overflowY: "auto",
            scrollbarWidth: "thin",
            pr: 0, // padding-right for scrollbar breathing room
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            <AnimatePresence mode="wait">
              {filteredSkills.map((skill, index) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  lg={2}
                  key={`${skill.group}-${skill.name}`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
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
            </AnimatePresence>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
