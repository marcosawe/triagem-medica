import type { ElementType } from "react";
import { 
  Menu, 
  UnstyledButton, 
  rem, 
  Group, 
  Avatar, 
  Text, 
  Button 
} from "@mantine/core";
import { IconChevronDown, IconSettings, IconLogout } from "@tabler/icons-react";

// ==========================================
// COMPONENTE: UserMenu
// ==========================================
interface UserMenuProps {
  initials: string; 
  userName: string; 
  userRole: string; 
  onLogout: () => void; 
}

const UserMenu = ({
  initials,
  userName,
  userRole,
  onLogout,
}: UserMenuProps) => (
  <Menu
    width={260}
    position="bottom-end"
    transitionProps={{ transition: "pop-top-right" }}
    withArrow
  >
    <Menu.Target>
      <UnstyledButton
        p={rem(5)}
        style={{
          borderRadius: "var(--mantine-radius-md)",
          transition: "background-color 0.2s ease",
        }}
        className="user-button-hover"
      >
        <Group gap="sm">
          <Avatar radius="xl" color="blue" variant="light">
            {initials}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={600} lh={1}>
              {userName}
            </Text>
            <Text c="dimmed" size="xs" mt={rem(3)}>
              {userRole}
            </Text>
          </div>
          <IconChevronDown size={14} stroke={1.5} />
        </Group>
      </UnstyledButton>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Label>Minha Conta</Menu.Label>
      <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
        Configurações
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        color="red"
        leftSection={<IconLogout size={16} stroke={1.5} />}
        onClick={onLogout}
      >
        Sair do sistema
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

// ==========================================
// COMPONENTE: DesktopItems
// ==========================================
export interface NavItem {
  link: string;
  label: string;
  icon: ElementType;
}

interface DesktopItemsProps {
  items: NavItem[];
  active: string;
  setActive: (link: string) => void;
}

export function DesktopItems({ items, active, setActive }: DesktopItemsProps) {
  return items.map((item) => (
    <Button
      key={item.label}
      variant={item.link === active ? "light" : "subtle"}
      color={item.link === active ? "blue" : "gray"}
      leftSection={<item.icon size={20} stroke={1.5} />}
      onClick={() => setActive(item.link)}
      radius="md"
    >
      {item.label}
    </Button>
  ));
}

export default UserMenu;