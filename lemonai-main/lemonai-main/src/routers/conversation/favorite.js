const router = require("koa-router")();

const Conversation = require("@src/models/Conversation");
const uuid = require("uuid");

// favorite
/**
 * @swagger
 * /api/conversation/favorite:
 *   post:
 *     summary: Favorite a conversation
 *     tags:  
 *       - Conversation
 *     description: This endpoint marks a conversation as favorite by its unique identifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 description: Unique identifier for the conversation
 *     responses:
 *       200:
 *         description: Successfully created a new conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: './schemas/conversation.json'
 *                 code:
 *                   type: integer
 *                   description: Status code
 *                 msg:
 *                   type: string
 *                   description: Message
 *                 
 */
router.post("/favorite", async ({ request, response }) => {
  const body = request.body || {};
  const { conversation_id } = body

  await Conversation.update(
    { is_favorite: true },
    { where: { conversation_id: conversation_id } }
  );
  const conversation = await Conversation.findOne({
    where: { conversation_id: conversation_id },
  });
  if (!conversation) {
    return response.error("Conversation does not exist");
  }

  return response.success(conversation);
});

// unfavorite
/**
 * @swagger
 * /api/conversation/unfavorite:
 *   post:
 *     summary: Unfavorite a conversation
 *     tags:  
 *       - Conversation
 *     description: This endpoint marks a conversation as not favorite by its unique identifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 description: Unique identifier for the conversation
 *     responses:
 *       200:
 *         description: Successfully updated the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: './schemas/conversation.json'
 *                 code:
 *                   type: integer
 *                   description: Status code
 *                 msg:
 *                   type: string
 *                   description: Message
 *                 
 */
router.post("/unfavorite", async ({ request, response }) => {
  const body = request.body || {};
  const { conversation_id } = body

  await Conversation.update(
    { is_favorite: false },
    { where: { conversation_id: conversation_id } }
  );
  const conversation = await Conversation.findOne({
    where: { conversation_id: conversation_id },
  });
  if (!conversation) {
    return response.error("Conversation does not exist");
  }

  return response.success(conversation);
});

module.exports = exports = router.routes();