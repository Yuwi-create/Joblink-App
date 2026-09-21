import { api } from './client';
import { Conversation, Message } from '@/types';

export const fetchConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get<Conversation[]>('/conversations');
  return data;
};

export const fetchMessages = async (conversationId: number): Promise<Message[]> => {
  const { data } = await api.get<Message[]>(`/conversations/${conversationId}/messages`);
  return data;
};

export const sendMessage = async (conversationId: number, body: string): Promise<Message> => {
  // Server must strip/escape any HTML in `body` before storing/rendering
  // elsewhere (e.g. admin dashboards) to prevent stored XSS.
  const { data } = await api.post<Message>(`/conversations/${conversationId}/messages`, { body });
  return data;
};

export const startConversation = async (userId: number): Promise<Conversation> => {
  const { data } = await api.post<Conversation>('/conversations', { user_id: userId });
  return data;
};
