import { Group, Image } from "@mantine/core";

export function Header() {
  return (
    <Group component="header" h={60} px="md">
      <a href="/">
        <Image src="/venta-logo.svg" alt="Venta AI" h={32} w="auto" />
      </a>
    </Group>
  );
}
