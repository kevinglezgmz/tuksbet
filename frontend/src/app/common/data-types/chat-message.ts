export interface ChatMessage {
  _id?: string;
  userId?: string;
  message: string;
  chatRoomId?: string;
  username?: string;
}
