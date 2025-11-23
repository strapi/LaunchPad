const Conversation = require('@src/models/Conversation')

const conversation_token_usage = async (token_usage, conversation_id) => {
  const { input_tokens, output_tokens } = token_usage
  if (conversation_id) {
    const conversation = await Conversation.findOne({ where: { conversation_id: conversation_id } })
    if (conversation) {
      conversation.input_tokens = conversation.input_tokens + input_tokens
      conversation.output_tokens = conversation.output_tokens + output_tokens
      await conversation.save()
    }
  }
}

module.exports = exports = conversation_token_usage;

