// Categorize questions by type for better organization
export const questionTypes = {
  options: [
    {
      id: "q1",
      type: "options",
      title: "Pre-screening Question",
      options: [
        { id: "q1_opt1", text: "Yes" },
        { id: "q1_opt2", text: "No" },
      ],
    },
    {
      id: "q2",
      type: "options",
      title: "Client Type Question",
      options: [
        { id: "q2_opt1", text: "Personal Assistant" },
        { id: "q2_opt2", text: "Consumer" },
      ],
    },
    {
      id: "q3",
      type: "options",
      title: "Current Client Status",
      options: [
        { id: "q3_opt1", text: "Yes" },
        { id: "q3_opt2", text: "No" },
      ],
    },
    {
      id: "q4",
      type: "options",
      title: "Hours Provided",
      options: [
        { id: "q4_opt1", text: "24hrs Hrs" },
        { id: "q4_opt2", text: "More than 60 Hrs" },
        { id: "q4_opt3", text: "More than 24 Hrs" },
        { id: "q4_opt4", text: "More than 80 Hrs" },
      ],
    },
    {
      id: "q5",
      type: "options",
      title: "CDPAP Approval Status",
      options: [
        { id: "q5_opt1", text: "Yes" },
        { id: "q5_opt2", text: "No" },
      ],
    },
  ],
  text: [
    {
      id: "t1",
      type: "text",
      title: "Contact Information",
    },
    {
      id: "t2", 
      type: "text",
      title: "Additional Comments",
    },
    {
      id: "t3",
      type: "text",
      title: "Personal Information",
    }
  ]
};

// Export the full array for backward compatibility
export const InitialQuestion = [
  ...questionTypes.options,
  ...questionTypes.text,
];

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