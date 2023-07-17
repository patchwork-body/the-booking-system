import { Chat, ChatParticipant, Message } from '@prisma/client';
import { prisma } from './prisma/client';

export interface ChatService {
  messages: (id: string) => Promise<
    | (Chat & { messages: Array<Message & { participant: Pick<ChatParticipant, 'userId'> }> } & {
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
        messages: {
          include: {
            participant: { select: { userId: true } },
          },
        },

        participants: {
          select: {
            userId: true,
          },
        },
      },
    });
  },
};
