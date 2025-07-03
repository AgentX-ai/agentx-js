![Logo](https://agentx-resources.s3.us-west-1.amazonaws.com/AgentX-logo-387x60.png)

[![npm version](https://img.shields.io/npm/v/@agentx-ai/agentx-js)](https://www.npmjs.com/package/@agentx-ai/agentx-js)

---

## Fast way to build AI Agents and create agent workforce

The official AgentX JavaScript/TypeScript SDK for [AgentX](https://www.agentx.so/)

Why build AI agent with AgentX?

- Simplicity, Agent - Conversation - Message structure.
- Include chain-of-thoughts.
- Choose from most open and closed sourced LLM vendors.
- Built-in Voice(ASR, TTS), Image Gen, Document, CSV/excel tool, OCR, etc.
- Support all running MCP (model context protocol).
- Support RAG with built-in re-rank.
- Multi-agent workforce orchestration.
- Multiple agents working together with a designated manager agent.
- Cross vendor LLM orchestration.

## Installation

```bash
npm install @agentx-ai/agentx-js
```

## Usage

Provide an `apiKey` inline or set `AGENTX_API_KEY` as an environment variable.
You can get an API key from https://app.agentx.so

### Agent

```typescript
import { AgentX } from '@agentx-ai/agentx-js';

const client = new AgentX(apiKey: "<your api key here>");

// Get the list of agents you have
const agents = await client.listAgents();
console.log(agents);
```

### Conversation

Each Conversation has `agents` and `users` tied to it.

```typescript
// get agent
const myAgent = await client.getAgent(id: "<agent id here>");

// Get the list of conversation from this agent
const existingConversations = await myAgent.listConversations();
console.log(existingConversations);

// Get the list of history messages from a conversation
const lastConversation = existingConversations[existingConversations.length - 1];
const msgs = await lastConversation.listMessages();
console.log(msgs);
```

### Chat

A `chat` needs to happen in the conversation. You can do `stream` response too, default `false`.

```typescript
const aConversation = await myAgent.getConversation(id: "<conversation id here>");

// Regular chat
const response = await aConversation.chat("Hello, what is your name?");

// Streaming chat
const stream = aConversation.chatStream("Hello, what is your name?");
for await (const chunk of stream) {
  console.log(chunk);
}
```

output looks like:

```
{ text: null, cot: 'The user is greeting and asking for my ', botId: 'xxx' }
{ text: null, cot: 'name, which are casual, straightforward questions.', botId: 'xxx' }
{ text: null, cot: ' I can answer these directly', botId: 'xxx' }
{ text: 'Hello', cot: null, botId: 'xxx' }
{ text: '!', cot: null, botId: 'xxx' }
{ text: ' I', cot: null, botId: 'xxx' }
{ text: ' am', cot: null, botId: 'xxx' }
{ text: ' AgentX', cot: null, botId: 'xxx' }
{ text: null, cot: null, botId: 'xxx' }
```

\*`cot` stands for chain-of-thoughts

### Workforce

A Workforce (team) consists of multiple agents working together with a designated manager agent.

```typescript
import { AgentX } from '@agentx-ai/agentx-js';

const client = new AgentX(apiKey: "<your api key here>");

// Get the list of workforces/teams you have
const workforces = await AgentX.listWorkforces();
console.log(workforces);

// Get a specific workforce
const workforce = workforces[0]; // or any specific workforce
console.log(`Workforce: ${workforce.name}`);
console.log(`Manager: ${workforce.manager.name}`);
console.log(`Agents: ${workforce.agents.map(agent => agent.name)}`);
```

#### Workforce Conversations

```typescript
// Create a new conversation with the workforce
const conversation = await workforce.newConversation();

// List all existing conversations for the workforce
const conversations = await workforce.listConversations();
console.log(conversations);
```

#### Chat with Workforce

Chat with the entire workforce team and get streaming responses from all agents.

```typescript
// Stream chat with the workforce
const stream = workforce.chatStream(
  conversation.id,
  "How can you help me with this project?"
);
for await (const chunk of stream) {
  if (chunk.text) {
    process.stdout.write(chunk.text);
  }
  if (chunk.cot) {
    console.log(` [COT: ${chunk.cot}]`);
  }
}
```

The workforce chat allows you to leverage multiple specialized agents working together to provide comprehensive responses to your queries.

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions. All classes, interfaces, and methods are properly typed for better development experience.

## API Reference

### AgentX

The main client class for interacting with the AgentX API.

#### Constructor

- `new AgentX(apiKey?: string)` - Creates a new AgentX client instance

#### Methods

- `getAgent(id: string): Promise<Agent>` - Get a specific agent by ID
- `listAgents(): Promise<Agent[]>` - List all agents
- `getProfile(): Promise<any>` - Get the current user's profile
- `static listWorkforces(): Promise<Workforce[]>` - List all workforces

### Agent

Represents an individual AI agent.

#### Properties

- `id: string` - Agent ID
- `name: string` - Agent name
- `avatar?: string` - Agent avatar URL
- `createdAt?: string` - Creation timestamp
- `updatedAt?: string` - Last update timestamp

#### Methods

- `getConversation(id: string): Promise<Conversation>` - Get a specific conversation
- `listConversations(): Promise<Conversation[]>` - List all conversations

### Conversation

Represents a conversation between users and agents.

#### Properties

- `id: string` - Conversation ID
- `title?: string` - Conversation title
- `users: string[]` - User IDs in the conversation
- `agents: string[]` - Agent IDs in the conversation
- `createdAt?: string` - Creation timestamp
- `updatedAt?: string` - Last update timestamp

#### Methods

- `newConversation(): Promise<Conversation>` - Create a new conversation
- `listMessages(): Promise<Message[]>` - List all messages in the conversation
- `chat(message: string, context?: number): Promise<any>` - Send a message
- `chatStream(message: string, context?: number): AsyncGenerator<ChatResponse>` - Stream chat responses

### Workforce

Represents a team of agents working together.

#### Properties

- `id: string` - Workforce ID
- `name: string` - Workforce name
- `agents: Agent[]` - List of agents in the workforce
- `manager: Agent` - Manager agent
- `description: string` - Workforce description
- `image: string` - Workforce image URL

#### Methods

- `newConversation(): Promise<Conversation>` - Create a new workforce conversation
- `listConversations(): Promise<Conversation[]>` - List all workforce conversations
- `chatStream(conversationId: string, message: string, context?: number): AsyncGenerator<ChatResponse>` - Stream chat with workforce

## Error Handling

The SDK throws descriptive errors for various failure scenarios:

- Missing API key
- Network errors
- API errors (with status codes)
- Invalid data

```typescript
try {
  const agent = await client.getAgent("invalid-id");
} catch (error) {
  console.error("Error:", error.message);
}
```

## Environment Variables

- `AGENTX_API_KEY` - Your AgentX API key (optional if passed to constructor)

## Automated Publishing

This package uses GitHub Actions for automated publishing to npm. The workflow automatically:

1. **Checks for version changes**: If `src/version.ts` is manually modified, it uses that version
2. **Auto-bumps version**: If `src/version.ts` hasn't changed, it automatically bumps the patch version by 0.0.1
3. **Builds and publishes**: Compiles TypeScript and publishes to npm
4. **Creates releases**: Creates GitHub releases for manual version changes

### Setup Required

To enable automated publishing, you need to set up the following secrets in your GitHub repository:

1. **NPM_TOKEN**: Your npm authentication token

   - Go to npmjs.com → Account → Access Tokens
   - Create a new token with "Automation" type
   - Add it as a repository secret named `NPM_TOKEN`

2. **GITHUB_TOKEN**: This is automatically provided by GitHub Actions

### How It Works

- **Manual version bump**: Edit `src/version.ts` and push to main → triggers publish with your version
- **Automatic version bump**: Push any changes to main without touching `src/version.ts` → automatically bumps patch version and publishes
- **Manual trigger**: You can also manually trigger the workflow from the GitHub Actions tab

### Version Management

- The workflow reads the version from `package.json` and `src/version.ts`
- When auto-bumping, it updates both files and commits the changes
- The `[skip ci]` tag in commit messages prevents infinite loops

## License

MIT License
