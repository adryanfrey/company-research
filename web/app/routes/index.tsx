import {
  ActionIcon,
  Anchor,
  Button,
  Card,
  Container,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Divider,
  Center,
  Skeleton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconPlus,
  IconSearch,
  IconTrash,
  IconFileSearch,
  IconShieldOff,
  IconClockOff,
  IconAlertTriangle,
} from "@tabler/icons-react";
import {
  Form,
  isRouteErrorResponse,
  Link,
  useActionData,
  useNavigation,
  useRouteError,
  useSubmit,
  type ActionFunctionArgs,
} from "react-router";
import { isValidHttpsUrl } from "../utils/is-valid-https-url";
import {
  researchQuestions,
  type QuestionAnswer,
} from "../services/research-questions.server";

type ActionData = {
  answers: QuestionAnswer[];
};

export default function Home() {
  const submit = useSubmit();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const form = useForm({
    initialValues: {
      companyWebsite: "",
      questions: [{ id: crypto.randomUUID(), value: "" }],
    },
    validate: {
      companyWebsite: (value) => {
        if (!value.trim()) return "Company website is required";
        if (!isValidHttpsUrl(value))
          return "Please enter a valid URL (https://example.com)";
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
                  disabled={form.values.questions.length >= 3 || isSubmitting}
                >
                  Add Question
                </Button>
              </Stack>
              <Button
                type="submit"
                leftSection={
                  isSubmitting ? <Loader size={16} /> : <IconSearch size={16} />
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? "Researching..." : "Start Research"}
              </Button>
            </Stack>
          </Form>
        </Paper>

        {isSubmitting && (
          <Stack gap={24}>
            <Title order={2} c="gray.8">
              Researching...
            </Title>
            {form.values.questions.map((question) => (
              <Card key={question.id} padding="lg" withBorder>
                <Stack gap={16}>
                  <Skeleton height={24} width="60%" />
                  <Skeleton height={60} />
                  <Skeleton height={16} width="40%" />
                </Stack>
              </Card>
            ))}
          </Stack>
        )}

        {!isSubmitting &&
          actionData?.answers &&
          actionData.answers.length > 0 && (
            <Stack gap={24}>
              <Title order={2} c="gray.8">
                Research Results
              </Title>

              {actionData.answers.map((result, index) => (
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
          )}

        {!isSubmitting && !actionData && (
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
        )}
      </Stack>
    </Container>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const companyWebsite = formData.get("companyWebsite") as string;
  const questionsRaw = formData.get("questions") as string;
  const questions = JSON.parse(questionsRaw).map(
    (q: { id: string; value: string }) => q.value
  );
  const answers = await researchQuestions(companyWebsite, questions);
  return { answers };
};

export function ErrorBoundary() {
  const error = useRouteError();

  let statusCode = 500;
  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
  }

  const errorConfig: Record<
    number,
    { icon: React.ReactNode; title: string; message: string }
  > = {
    403: {
      icon: (
        <IconShieldOff
          size={64}
          stroke={1.5}
          color="var(--mantine-color-red-6)"
        />
      ),
      title: "Request Blocked",
      message:
        "Your request was blocked by our security guardrail. Please try again with different input.",
    },
    408: {
      icon: (
        <IconClockOff
          size={64}
          stroke={1.5}
          color="var(--mantine-color-orange-6)"
        />
      ),
      title: "Request Timed Out",
      message: "The request took too long to process. Please try again later.",
    },
    500: {
      icon: (
        <IconAlertTriangle
          size={64}
          stroke={1.5}
          color="var(--mantine-color-red-6)"
        />
      ),
      title: "Internal Error",
      message: "Something went wrong on our end. Please try again later.",
    },
  };

  const config = errorConfig[statusCode] || errorConfig[500];

  return (
    <Container size="md" py={40}>
      <Paper p={40} withBorder>
        <Center>
          <Stack align="center" gap={24}>
            {config.icon}
            <Stack align="center" gap={8}>
              <Title order={2} c="gray.8">
                {config.title}
              </Title>
              <Text c="gray.6" ta="center" maw={400}>
                {config.message}
              </Text>
            </Stack>
            <Button component={Link} to="/" variant="light">
              Try Again
            </Button>
          </Stack>
        </Center>
      </Paper>
    </Container>
  );
}
