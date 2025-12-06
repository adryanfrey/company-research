import {
  Button,
  Card,
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Divider,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Form } from "react-router";

const mockResults = [
  {
    question: "What is the company's primary revenue model?",
    answer:
      "Subscription-based SaaS with tiered plans and annual enterprise contracts.",
  },
  {
    question:
      "In which regions does the company have the strongest market presence?",
    answer: "North America and Western Europe, with emerging traction in APAC.",
  },
  {
    question: "What differentiates the company from competitors?",
    answer:
      "A faster implementation timeline, transparent pricing, and native integrations with major CRM and ERP platforms.",
  },
];

export default function Home() {
  return (
    <Container size="md" py={40}>
      <Stack gap={40}>
        <Stack align="center" gap={16}>
          <Title order={1} c="dark">
            Company Research Assistant
          </Title>
          <Text c="dark">
            Enter a company domain and ask up to 3 qualifying questions to get
            AI-powered insights
          </Text>
        </Stack>

        <Paper p={32} withBorder>
          <Form method="post">
            <Stack gap={24}>
              <TextInput
                label="Company Website"
                placeholder="https://example.com"
                name="companyWebsite"
                leftSection={<IconSearch size={16} />}
              />

              <Divider label="Qualifying Questions" labelPosition="center" />

              <Stack gap={16}>
                <TextInput
                  label={`Question 1`}
                  placeholder="What is the company's primary revenue model?"
                />

                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  size="sm"
                >
                  Add Question
                </Button>
              </Stack>
              <Button type="submit" leftSection={<IconSearch size={16} />}>
                Start Research
              </Button>
            </Stack>
          </Form>
        </Paper>

        {mockResults.length > 0 && (
          <Stack gap={24}>
            <Title order={2} c="gray.8">
              Research Results
            </Title>

            {mockResults.map((result, index) => {
              if (!result) return null;

              return (
                <Card key={index} padding="lg" withBorder>
                  <Stack gap={16}>
                    <Text fw={600} size="lg" c="gray.8">
                      {result.question}
                    </Text>

                    <Text c="gray.7" size="md">
                      {result.answer}
                    </Text>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
