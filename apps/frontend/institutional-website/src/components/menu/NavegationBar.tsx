import { useState } from "react";
import {
  Group,
  Burger,
  Container,
  Text,
  Avatar,
  Drawer,
  Stack,
  Button,
  NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconStethoscope,
  IconUsers,
  IconNotes,
  IconLogout,
} from "@tabler/icons-react";
import Logo from "./Logo";
import UserMenu, { DesktopItems } from "./DesktopMenu";

// Tipagem das propriedades que o componente vai receber
export interface TriageNavbarProps {
  userName: string;
  userRole: string;
  userInitials?: string;
  onLogout?: () => void;
}

// Estrutura de dados para facilitar a manutenção das rotas
const navLinks = [
  { link: "/triagem", label: "Nova Triagem", icon: IconStethoscope },
  { link: "/pacientes", label: "Pacientes", icon: IconUsers },
  { link: "/prontuarios", label: "Prontuários", icon: IconNotes },
];

export function TriageNavbar({
  userName,
  userRole,
  userInitials,
  onLogout,
}: TriageNavbarProps) {

  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(navLinks[0].link);

  const [currentPath, setCurrentPath] = useState("/home");

  // Gera as iniciais automaticamente caso não venham da API
  const initials =
    userInitials || userName?.substring(0, 2).toUpperCase() || "US";

  // Links para a visualização Mobile (usando NavLinks para preencher a largura)
  const mobileItems = navLinks.map((item) => (
    <NavLink
      key={item.label}
      active={item.link === active}
      label={item.label}
      leftSection={<item.icon size={20} stroke={1.5} />}
      onClick={() => {
        setActive(item.link);
        close();
      }}
      variant="light"
      color="blue"
      style={{ borderRadius: 8 }}
    />
  ));

  return (
    <header
      style={{
        height: 65,
        borderBottom: "1px solid #e9ecef",
        backgroundColor: "#ffffff",
      }}
    >
      <Container size="xl" h="100%">
        <Group justify="space-between" h="100%">
          {/* Logo e Branding */}
          <Logo />

          {/* Desktop Itens */}
          <DesktopItems
            items={navLinks}
            active={currentPath}
            setActive={setCurrentPath}
          />

          {/* Menu de Perfil Desktop */}
          <Group visibleFrom="sm">
            <UserMenu
              initials={initials}
              userName={userName}
              userRole={userRole}
              onLogout={function (): void {}}
            />
          </Group>

          {/* Botão Hambúrguer Mobile (Escondido em telas maiores que 'sm') */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </Container>

      {/* Drawer Mobile */}
      <Drawer
        opened={opened}
        onClose={close}
        size="xs"
        title="Menu Principal"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Stack gap="sm">
          {mobileItems}

          <Group mt="xl" pt="md" style={{ borderTop: "1px solid #e9ecef" }}>
            <Avatar radius="xl" color="blue">
              {initials}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500} lh={1.2}>
                {userName}
              </Text>
              <Text c="dimmed" size="xs" lh={1.2}>
                {userRole}
              </Text>
            </div>
          </Group>

          <Button
            variant="light"
            color="red"
            fullWidth
            leftSection={<IconLogout size={20} />}
            onClick={onLogout}
          >
            Sair
          </Button>
        </Stack>
      </Drawer>
    </header>
  );
}
