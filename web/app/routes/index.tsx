import {
  Button,
  Container,
  Paper,
  Stack,
  Text,
  Title,
  Center,
} from "@mantine/core";
import {
  IconShieldOff,
  IconClockOff,
  IconAlertTriangle,
} from "@tabler/icons-react";
import {
  isRouteErrorResponse,
  Link,
  useActionData,
  useNavigation,
  useRouteError,
  useSubmit,
  type ActionFunctionArgs,
} from "react-router";
import {
  ResearchForm,
  type ResearchFormValues,
} from "../components/research-form";
import { ResearchResults } from "../components/research-results";
import { researchQuestions } from "../services/research-questions.server";

export default function Home() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleSubmit = (values: ResearchFormValues) => {
    submit(
      {
        companyWebsite: values.companyWebsite,
        questions: JSON.stringify(values.questions),
      },
      { method: "post" }
    );
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

        <ResearchForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />

        <ResearchResults
          answers={actionData?.answers}
          isLoading={isSubmitting}
        />
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
