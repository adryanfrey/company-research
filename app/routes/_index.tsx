import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useState } from 'react';
import { Container, Stack, Title, TextInput, Button, Paper, Text, Card, Divider } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { Form, useActionData } from '@remix-run/react';
import type { Question, ResearchResult } from '~/types';
import { getMockAnswer } from '~/utils';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const questionTexts = formData.getAll('questionText') as string[];

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const mockResults: ResearchResult[] = questionTexts
    .filter((qText) => qText.trim() !== '')
    .map((qText) => ({
      question: qText,
      answer: getMockAnswer(qText),
    }));

  return json({ results: mockResults, error: null });
};

export default function Index() {
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{ id: '1', text: '' }]);

  const actionData = useActionData<typeof action>();

  const addQuestion = () => {
    if (questions.length < 3) {
      setQuestions([...questions, { id: Date.now().toString(), text: '' }]);
    }
  };

  const updateQuestionText = (id: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const results = actionData?.results ?? [];

  return (
    <Container size="md" py={40}>
      <Stack gap={40}>
        <Stack align="center" gap={16}>
          <Title order={1} c="blue.7">
            Company Research Assistant
          </Title>
          <Text c="gray.6">Enter a company domain and ask up to 3 qualifying questions to get AI-powered insights</Text>
        </Stack>

        <Paper p={32} withBorder>
          <Form method="post">
            <Stack gap={24}>
              <TextInput
                label="Company Website"
                placeholder="https://example.com"
                name="companyWebsite"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
              />

              <Divider label="Qualifying Questions" labelPosition="center" />

              <Stack gap={16}>
                {questions.map((question, index) => (
                  <TextInput
                    key={question.id}
                    label={`Question ${index + 1}`}
                    placeholder="e.g., Is the company based in Germany?"
                    name="questionText"
                    value={question.text}
                    onChange={(e) => updateQuestionText(question.id, e.currentTarget.value)}
                  />
                ))}

                {questions.length < 3 && (
                  <Button variant="light" leftSection={<IconPlus size={16} />} onClick={addQuestion} size="sm">
                    Add Question
                  </Button>
                )}
              </Stack>
              <Button type="submit" leftSection={<IconSearch size={16} />}>
                Start Research
              </Button>
            </Stack>
          </Form>
        </Paper>

        {results.length > 0 && (
          <Stack gap={24}>
            <Title order={2} c="gray.8">
              Research Results
            </Title>

            {results.map((result, index) => {
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
