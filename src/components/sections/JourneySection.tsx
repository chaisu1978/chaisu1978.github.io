import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
const MotionDiv = motion.div as React.ComponentType<
  React.HTMLAttributes<HTMLDivElement> & import("framer-motion").MotionProps
>;

interface JourneySectionProps {
    id: string;
  }

const JourneySection: React.FC<JourneySectionProps> = () => {
    return (
<MotionDiv
id="journey"
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
>
<Box height={"90vh"} p={3}>
  <Typography variant="h4" gutterBottom>
    Journey
  </Typography>
  <Typography>My path to where I am today.</Typography>
</Box>
</MotionDiv>

    );
};

export default JourneySection;
