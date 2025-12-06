import {
  ActionIcon,
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
import { useForm } from "@mantine/form";
import { IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { Form, useSubmit, type ActionFunctionArgs } from "react-router";
import { isValidHttpUrl } from "../utils/is-valid-http-url";

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
  const submit = useSubmit();
  const form = useForm({
    initialValues: {
      companyWebsite: "",
      questions: [{ id: crypto.randomUUID(), value: "" }],
    },
    validate: {
      companyWebsite: (value) => {
        if (!value.trim()) return "Company website is required";
        if (!isValidHttpUrl(value)) return "Please enter a valid URL (https://example.com)";
        return null;
      },
      questions: (values) => {
        const errors = values.map((q) =>
          q.value.trim() ? null : "Question is required"
        );
        return errors.some((e) => e !== null) ? errors : null;
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    submit(
      {
        companyWebsite: values.companyWebsite,
        questions: JSON.stringify(values.questions),
      },
      { method: "post" }
    );
  };

  const addQuestion = () => {
    if (form.values.questions.length < 3) {
      form.insertListItem("questions", { id: crypto.randomUUID(), value: "" });
    }
  };

  const removeQuestion = (index: number) => {
    form.removeListItem("questions", index);
  };

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
          <Form method="post" onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap={14}>
              <TextInput
                label="Company Website"
                placeholder="https://example.com"
                leftSection={<IconSearch size={16} />}
                withAsterisk
                {...form.getInputProps("companyWebsite")}
              />

              <Divider label="Qualifying Questions" labelPosition="center" />

              <Stack gap={16}>
                {form.values.questions.map((question, index) => (
                  <TextInput
                    key={question.id}
                    label={`Question ${index + 1}`}
                    withAsterisk
                    placeholder="What is the company's primary revenue model?"
                    value={question.value}
                    onChange={(event) =>
                      form.setFieldValue(
                        `questions.${index}.value`,
                        event.currentTarget.value
                      )
                    }
                    error={
                      Array.isArray(form.errors.questions)
                        ? form.errors.questions[index]
                        : null
                    }
                    rightSection={
                      index > 0 && (
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      )
                    }
                  />
                ))}

                <Button
                  variant="light"
                  leftSection={<IconPlus size={16} />}
                  size="sm"
                  onClick={addQuestion}
                  disabled={form.values.questions.length >= 3}
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

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("test action");
};
