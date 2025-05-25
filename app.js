import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import {deletePlayerProfile} from './utils.js'
import {setupPlayer} from './lolApi.js'

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'addaccount')
    {
      const options = data.options;
      const gameName = options.find(opt => opt.name === 'game_name')?.value;
      const gameTag = options.find(opt => opt.name === 'game_tag')?.value;
      const accountRegion = options.find(opt => opt.name === 'account_region')?.value;
      let accountExist;

      accountExist = await setupPlayer(gameName,gameTag,accountRegion);

      if(accountExist)
      {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: `Account : ${gameName}#${gameTag} added !`
              }
            ]
          }
        });
      }
      else
      {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: `Account : ${gameName}#${gameTag} for region ${accountRegion} not found or no ranked data available.`
              }
            ]
          }
        });
      }
    }
    else if (name === 'removeaccount')
    {
      const options = data.options;
      const gameName = options.find(opt => opt.name === 'game_name')?.value;
      const gameTag = options.find(opt => opt.name === 'game_tag')?.value;
      let accountExist = await deletePlayerProfile(gameName,gameTag);

      if(accountExist)
      {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: `Account : ${gameName}#${gameTag} removed.`
              }
            ]
          }
        });
      }
      else
      {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: `Account : ${gameName}#${gameTag} is not registered within the bot.`
              }
            ]
          }
        });
      }
    }
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

