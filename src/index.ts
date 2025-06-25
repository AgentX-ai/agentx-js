import { AgentX } from "./agentx";
import { Agent } from "./resources/agent";
import { Conversation, ChatResponse, Message } from "./resources/conversation";
import { Workforce, User } from "./resources/workforce";
import { VERSION } from "./version";

// Export the main class and version
export { AgentX, VERSION };

// Export types and interfaces
export type { ChatResponse, Message };
export { Agent, Conversation, Workforce, User };

// Export the default instance
export default AgentX;
