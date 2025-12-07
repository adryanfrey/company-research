import {
  ActionIcon,
  Button,
  Divider,
  Loader,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { Form } from "react-router";
import { isValidHttpsUrl } from "../utils/is-valid-https-url";

export type Question = {
  id: ReturnType<typeof crypto.randomUUID>;
  value: string;
};

export type ResearchFormValues = {
  companyWebsite: string;
  questions: Question[];
};

type ResearchFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: ResearchFormValues) => void;
};

export function ResearchForm({ isSubmitting, onSubmit }: ResearchFormProps) {
  const form = useForm<ResearchFormValues>({
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

  const addQuestion = () => {
    if (form.values.questions.length < 3) {
      form.insertListItem("questions", { id: crypto.randomUUID(), value: "" });
    }
  };

  const removeQuestion = (index: number) => {
    form.removeListItem("questions", index);
  };

  return (
    <Paper p={32} withBorder>
      <Form method="post" onSubmit={form.onSubmit(onSubmit)}>
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
  );
}
