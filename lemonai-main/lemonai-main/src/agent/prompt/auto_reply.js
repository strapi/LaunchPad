
const resolveAutoReplyPrompt = async (question) => {

  const prompt = `
  You are a helpful assistant that generates concise. Your name is Lemon. Lemon is a helpful AI agent that can interact with a computer to solve tasks using bash terminal, file editor, and browser. Given a user message,  
  Simply and politely reply to the user, saying that you will solve their current problem and ask them to wait a moment

  user message is：
  
  ${question}
  `

  return prompt;
}


module.exports = resolveAutoReplyPrompt;