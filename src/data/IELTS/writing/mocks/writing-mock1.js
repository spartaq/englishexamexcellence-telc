export const writingMock1 = {
  id: 'writing-mock1',
  type: 'WRITING_MOCK',
  title: 'Writing Mock #1',
  sections: [
    {
      id: 'w-m1-t1',
      taskType: 1,
      title: 'Task 1: Report',
      targetWords: 150,
      prompt: "The graph below shows the consumption of fish and different kinds of meat in a European country...",
      bullets: ["Summarize the information", "Select main features", "Make comparisons"]
    },
    {
      id: 'w-m1-t2',
      taskType: 2,
      title: 'Task 2: Essay',
      targetWords: 250,
      prompt: "Some people believe that it is best to accept a bad situation. Others argue that it is better to try and improve such situations. Discuss both views.",
      bullets: ["Give reasons for your answer", "Include relevant examples"]
    }
  ]
};