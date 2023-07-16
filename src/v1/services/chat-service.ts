import { Chat, ChatParticipant, Message } from '@prisma/client';
import { prisma } from './prisma/client';

export interface ChatService {
  messages: (
    id: string,
  ) => Promise<
    | (Chat & { messages: Array<Message> } & {
        participants: Array<Pick<ChatParticipant, 'userId'>>;
      })
    | null
  >;
}

export const chatService: ChatService = {
  messages: async (id) => {
    return prisma.chat.findUnique({
      where: {
        id,
      },

      include: {
        messages: true,

        participants: {
          select: {
            userId: true,
          },
        },
      },
    });
  },
};
