
const resolveTodoPrompt = (tasks_data) => {

  const prompt =`
  Generate a todo.md file in Markdown format based on the following task data:

- The file should start with ## TODO List.
- Each task should be a single line starting with '- [ ]' if its 'status' is '"pending"' or '- [x]' if its 'status' is '"done"'.
- After the checkbox, include the 'title', followed by a colon ':' and the 'description'.
- Keep the output concise and clean, using only valid Markdown syntax.
- Return only the Markdown content as a string with no explanation.

Example format:
## TODO List
- [ ] Task Title: Task description

Here is the task data:

  
  ${tasks_data}
  `

  return prompt;
}


module.exports = resolveTodoPrompt;