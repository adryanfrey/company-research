import {
  Anchor,
  Card,
  Center,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconFileSearch } from "@tabler/icons-react";
import type { QuestionAnswer } from "../services/research-questions.server";

type ResearchResultsProps = {
  answers?: QuestionAnswer[];
  isLoading: boolean;
};

export function ResearchResults({ answers, isLoading }: ResearchResultsProps) {
  if (isLoading) {
    return (
      <Stack gap={24}>
        <Title order={2} c="gray.8">
          Researching...
        </Title>

        <Card padding="lg" withBorder>
          <Stack gap={16}>
            <Skeleton height={24} width="60%" />
            <Skeleton height={60} />
            <Skeleton height={16} width="40%" />
          </Stack>
        </Card>
      </Stack>
    );
  }

  if (!answers || answers.length === 0) {
    return (
      <Paper p={40} withBorder>
        <Center>
          <Stack align="center" gap={16}>
            <IconFileSearch size={48} color="gray" stroke={1.5} />
            <Text c="gray.6" ta="center">
              Enter a company website and your questions above to start
              researching
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <Stack gap={24}>
      <Title order={2} c="gray.8">
        Research Results
      </Title>

      {answers.map((result, index) => (
        <Card key={index} padding="lg" withBorder>
          <Stack gap={16}>
            <Text fw={600} size="lg" c="gray.8">
              {result.question}
            </Text>

            <Text c="gray.7" size="md">
              {result.answer}
            </Text>

            {result.sources && result.sources.length > 0 && (
              <Stack gap={4}>
                <Text size="sm" c="gray.6" fw={500}>
                  Sources:
                </Text>
                <Stack gap={2}>
                  {result.sources.map((source, sourceIndex) => (
                    <Anchor
                      key={sourceIndex}
                      href={source}
                      target="_blank"
                      size="sm"
                      c="blue.6"
                    >
                      {source}
                    </Anchor>
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
