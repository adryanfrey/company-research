export const getMockAnswer = (question: string) => {
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes('german')) {
    return 'The company appears to be based in Germany with headquarters in Munich.';
  }
  if (lowerQuestion.includes('employees')) {
    return 'According to recent data, the company has approximately 50-200 employees, qualifying as a medium-sized company.';
  }
  if (lowerQuestion.includes('industry')) {
    return 'The company operates in the technology sector, specifically focusing on software development and digital solutions.';
  }
  return 'This is a mock answer.';
}; 