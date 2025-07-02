import { AgentX } from "./src/agentx";
import { Conversation } from "./src/resources/conversation";

const API_KEY = "your agentx api key";
const AGENT_ID = "your agent id";
const CONVERSATION_ID = "your conversation id";

async function testChatStream() {
  try {
    // Initialize AgentX with your API key
    const agentx = new AgentX(API_KEY);

    // Get an agent (you'll need to replace with a real agent ID)
    const agent = await agentx.getAgent(AGENT_ID);
    console.log("Agent loaded:", agent.name);

    // Create a conversation (you'll need to replace with a real conversation ID)
    const conversation = new Conversation({
      agent_id: AGENT_ID,
      id: CONVERSATION_ID,
      users: [],
      agents: [],
    });

    console.log("Testing chatStream method...");
    console.log("Sending message: 'How can you help me?'");
    console.log("=".repeat(50));

    // Test the chatStream method
    const stream = conversation.chatStream("How can you help me?", 0);

    let chunkCount = 0;
    let totalText = "";
    let totalCot = "";

    for await (const chunk of stream) {
      chunkCount++;
      console.log(`\n--- Chunk ${chunkCount} ---`);
      console.log("Text:", chunk.text);
      console.log("CoT:", chunk.cot);
      console.log("Bot ID:", chunk.botId);
      console.log("Reference:", chunk.reference);
      console.log("Tasks:", chunk.tasks);

      if (chunk.text) totalText += chunk.text;
      if (chunk.cot) totalCot += chunk.cot;
    }

    console.log("\n" + "=".repeat(50));
    console.log("Stream completed!");
    console.log(`Total chunks received: ${chunkCount}`);
    console.log(`Total text length: ${totalText.length}`);
    console.log(`Total CoT length: ${totalCot.length}`);
    console.log("\nFinal text:", totalText);
    console.log("\nFinal CoT:", totalCot);
  } catch (error) {
    console.error("Error testing chatStream:", error);
  }
}

// Run the test
testChatStream();
