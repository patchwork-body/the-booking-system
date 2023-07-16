import { Router, Request, Response } from 'express';
import { isAuthorized } from '../middlewares/is-authorized';
import { logger } from 'src/logger';
import { chatService } from '../services';

export const chatsRouter = Router();

chatsRouter.get('/chats/:id/messages', isAuthorized, async (req: Request, res: Response) => {
  try {
    const chat = await chatService.messages(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.some((participant) => participant.userId === req.jwtPayload?.userId)) {
      return res
        .status(403)
        .json({ message: 'You should be a participant of this chat to see it' });
    }

    return res
      .status(200)
      .json({ items: chat.messages, cursor: chat.messages[chat.messages.length - 1]?.id });
  } catch (error) {
    logger.fatal(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});
