import axios, { AxiosResponse } from "axios";
import { getHeaders } from "../util";

export interface ChatResponse {
  text: string | null;
  cot: string | null;
  botId: string;
  reference?: any;
  tasks?: any;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "bot";
  botId?: string;
  userId?: string;
  text: string | null;
  cot: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationData {
  agent_id: string;
  id: string;
  title?: string;
  users: string[];
  agents: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContextMessage {
  user?: string;
  assistant?: string;
}

// Helper function to count characters in a string
function countChar(str: string, char: string): number {
  return (
    str.match(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ||
    []
  ).length;
}

export class Conversation {
  public agent_id: string;
  public id: string;
  public title?: string;
  public users: string[];
  public agents: string[];
  public createdAt?: string;
  public updatedAt?: string;

  constructor(data: ConversationData) {
    this.agent_id = data.agent_id;
    this.id = data.id;
    this.title = data.title;
    this.users = data.users;
    this.agents = data.agents;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  async listMessages(): Promise<Message[]> {
    const url = `https://api.agentx.so/api/v1/access/agents/${this.agent_id}/conversations/${this.id}`;
    const response: AxiosResponse = await axios.get(url, {
      headers: getHeaders(),
    });

    if (response.status === 200) {
      const res = response.data;
      if (res.messages) {
        const messageList: Message[] = [];
        for (const message of res.messages) {
          if (message.bot) {
            message.role = "bot";
          } else {
            message.role = "user";
          }
          messageList.push(message);
        }
        return messageList;
      } else {
        throw new Error("No messages found in the conversation.");
      }
    } else {
      throw new Error(
        `Failed to retrieve agent details: ${response.status} - ${response.statusText}`
      );
    }
  }

  async chat(message: string, context?: number): Promise<any> {
    const url = `https://api.agentx.so/api/v1/access/conversations/${this.id}/message`;
    const response: AxiosResponse = await axios.post(
      url,
      { message, context },
      { headers: getHeaders() }
    );
    return response.data;
  }

  async updateContext(messages: ContextMessage[]): Promise<void> {
    const url = `https://api.agentx.so/api/v1/access/conversations/${this.id}/update-context`;
    const response: AxiosResponse = await axios.put(
      url,
      { messages },
      { headers: getHeaders() }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to update conversation context: ${response.status} - ${response.statusText}`
      );
    }
  }

  async updateUserContext(message: string): Promise<void> {
    const url = `https://api.agentx.so/api/v1/access/conversations/${this.id}/update-user-context`;
    const response: AxiosResponse = await axios.put(
      url,
      { message },
      { headers: getHeaders() }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to update user context: ${response.status} - ${response.statusText}`
      );
    }
  }

  async *chatStream(
    message: string,
    context?: number
  ): AsyncGenerator<ChatResponse> {
    const url = `https://api.agentx.so/api/v1/access/conversations/${this.id}/jsonmessagesse`;
    const response: AxiosResponse = await axios.post(
      url,
      { message, context },
      {
        headers: getHeaders(),
        responseType: "stream",
      }
    );

    if (response.status === 200) {
      let result = "";
      const stream = response.data;

      for await (const chunk of stream) {
        const chunkStr = chunk.toString();
        result += chunkStr;

        try {
          if (countChar(result, "{") === countChar(result, "}")) {
            const catchJson = JSON.parse(result);
            if (catchJson) {
              result = "";
              yield {
                text: catchJson.text || null,
                cot: catchJson.cot || null,
                botId: catchJson.botId,
                reference: catchJson.reference,
                tasks: catchJson.tasks,
              };
            }
          }
        } catch (jsonError) {
          // Continue if JSON parsing fails
          continue;
        }
      }
    } else {
      throw new Error(
        `Failed to send message: ${response.status} - ${response.statusText}`
      );
    }
  }
}
