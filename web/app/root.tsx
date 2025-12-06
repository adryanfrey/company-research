import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { MantineProvider } from "@mantine/core";
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

// TODO: Add proper global error boundary
export function ErrorBoundary() {
  return <div>Error</div>;
}