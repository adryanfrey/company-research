import { fetchFromAPI } from "../utils/fetch-api.server";

export type QuestionAnswer = {
  question: string;
  answer: string;
  sources: string[];
};

export async function researchQuestions(
  companyWebsite: string,
  questions: string[]
): Promise<QuestionAnswer[]> {
  const response = await fetchFromAPI<QuestionAnswer[]>({
    url: "/research",
    method: "POST",
    data: {
      company_website: companyWebsite,
      questions,
    },
  });
  return response.result;
}
