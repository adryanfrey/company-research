import { BackgroundImage, Box } from "@mantine/core";
import { Header } from "./header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <BackgroundImage
        src="/venta_background.jpeg"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "20%",
            background:
              "linear-gradient(to bottom, white 0%, transparent 100%)",
          }}
        />
      </BackgroundImage>

      <Box style={{ zIndex: 1 }}>
        <Header />
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}
