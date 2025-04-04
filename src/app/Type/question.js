// This file now contains JavaScript object structures instead of TypeScript types

// These are just example objects, not type definitions in JavaScript
export const QuestionType = {
  TEXT: "text",
  OPTIONS: "options",
  END: "end"
};

export const FlowNodeExample = {
  id: "example_id",
  type: "questionNode",
  position: { x: 0, y: 0 },
  data: {
    id: "question_id",
    type: "options",
    title: "Example Question",
    options: [
      { id: "opt_1", text: "Option 1" }
    ]
  }
};