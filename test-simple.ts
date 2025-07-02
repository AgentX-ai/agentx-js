import { AgentX } from "./src/agentx";

const API_KEY = "your agentx api key";

async function testSimpleChatStream() {
  try {
    // Initialize AgentX with your API key
    const agentx = new AgentX(API_KEY);

    console.log("Getting available agents...");
    const agents = await agentx.listAgents();
    console.log(`Found ${agents.length} agents`);

    if (agents.length === 0) {
      console.error("No agents found. Please create an agent first.");
      return;
    }

    // Use the first available agent
    const agent = agents[0];
    console.log(`Using agent: ${agent.name} (${agent.id})`);

    // Get workforces to find a conversation
    console.log("Getting workforces...");
    const workforces = await agentx.listWorkforces();
    console.log(`Found ${workforces.length} workforces`);

    if (workforces.length === 0) {
      console.error("No workforces found. Please create a workforce first.");
      return;
    }

    // For now, let's just test with a direct API call to create a conversation
    // This is a simplified test - in a real scenario you'd need to create a conversation first
    console.log("Note: This test requires an existing conversation ID.");
    console.log("To test properly, you need to:");
    console.log("1. Create a conversation through the AgentX platform");
    console.log("2. Update the conversation ID in this test");
    console.log("3. Run the test");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the test
testSimpleChatStream();
