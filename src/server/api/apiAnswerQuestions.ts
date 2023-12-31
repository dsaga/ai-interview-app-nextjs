import OpenAi from "openai";

export async function apiAnswerQuestions(query: string) {
  const openai = new OpenAi({ apiKey: process.env.OPEN_AI_ACCESS_TOKEN });

  // Step 1: send the conversation and available functions to GPT
  const functions = [
    {
      name: "process_answers",
      description:
        "Can you score the provided answers for each given question in the provided JSON? The score should range from 0 to 10, with 10 being a correct answer and 0 being an invalid or wrong answer. Also provide reasons for each score in a separate array. Please ensure that the scoring is rigorous.",
      parameters: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                questionText: {
                  type: "string",
                },
                id: {
                  type: "string",
                },
                score: { type: "number" },
                reason: { type: "string" },
              },
              required: ["questionText", "id", "score", "reason"],
            },
          },
        },
        required: ["questions"],
      },
    },
  ];

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: query }],
    model: "gpt-3.5-turbo",
    functions,
    function_call: "auto",
  });

  console.info(completion.choices, { structuredData: true });
  const responseMessage = completion.choices[0].message;

  return {
    message: responseMessage.content,
    function_call: responseMessage.function_call,
    role: responseMessage.role,
  };
}
