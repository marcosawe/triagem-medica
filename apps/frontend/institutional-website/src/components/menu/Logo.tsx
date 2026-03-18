import { Group, ThemeIcon, rem, Text } from "@mantine/core";
import { IconHeartbeat } from "@tabler/icons-react";


const Logo = () => (
  <Group gap="xs" wrap="nowrap">
    <ThemeIcon
      size={38}
      variant="gradient"
      gradient={{ from: "blue", to: "cyan" }}
      radius="md"
    >
      <IconHeartbeat size={24} stroke={1.5} />
    </ThemeIcon>
    <Text
      size="xl"
      fw={800}
      variant="gradient"
      gradient={{ from: "blue.8", to: "blue.6" }}
      style={{ letterSpacing: rem(-0.5) }}
      visibleFrom="xs"
    >
      Central Med
    </Text>
  </Group>
);

export default Logo;