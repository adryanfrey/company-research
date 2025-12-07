import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import {
  MantineProvider,
  Container,
  Title,
  Text,
  Button,
  Stack,
} from "@mantine/core";
import { theme } from "./theme";
import { AppLayout } from "./components/app-layout";
import "@mantine/core/styles.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/x-icon" href="/venta_favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Venta AI</title>
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export function ErrorBoundary() {
  return (
    <AppLayout>
      <Container size="sm" py={80}>
        <Stack align="center" gap="md">
          <Title order={1}>Something went wrong</Title>
          <Text ta="center">
            An unexpected error occurred. Please try again.
          </Text>
          <Button component="a" href="/" variant="light" mt="md">
            Back to Home
          </Button>
        </Stack>
      </Container>
    </AppLayout>
  );
}
