import { AgentX } from "./src/agentx";
import { Conversation } from "./src/resources/conversation";

const API_KEY = "your agentx api key";
const AGENT_ID = "your agent id";
const CONVERSATION_ID = "your conversation id";

async function testStreaming() {
  try {
    // Initialize AgentX with your API key
    const agentx = new AgentX(API_KEY);

    console.log("🔍 Testing AgentX Streaming Functionality");
    console.log("=".repeat(60));

    // Test 1: List agents
    console.log("\n📋 Step 1: Listing available agents...");
    const agents = await agentx.listAgents();
    console.log(`✅ Found ${agents.length} agents`);

    if (agents.length > 0) {
      console.log("Available agents:");
      agents.forEach((agent, index) => {
        console.log(`  ${index + 1}. ${agent.name} (${agent.id})`);
      });
    }

    // Test 2: List workforces
    console.log("\n📋 Step 2: Listing available workforces...");
    const workforces = await agentx.listWorkforces();
    console.log(`✅ Found ${workforces.length} workforces`);

    if (workforces.length > 0) {
      console.log("Available workforces:");
      workforces.forEach((workforce, index) => {
        console.log(`  ${index + 1}. ${workforce.name} (${workforce.id})`);
      });
    }

    // Test 3: Get profile
    console.log("\n📋 Step 3: Getting user profile...");
    const profile = await agentx.getProfile();
    console.log("✅ Profile retrieved successfully");
    console.log("User info:", {
      name: profile.name,
      email: profile.email,
      id: profile._id,
    });

    // Test 4: Test streaming (if you have a conversation ID)
    console.log("\n📋 Step 4: Testing chat streaming...");
    console.log("🚀 Starting stream test with existing conversation...");

    // Using the conversation ID from the curl example
    const conversation = new Conversation({
      agent_id: AGENT_ID, // Website Prompter agent
      id: CONVERSATION_ID, // Conversation ID from curl example
      users: [],
      agents: [],
    });

    console.log("🚀 Starting stream test...");
    const stream = conversation.chatStream("How can you help me?", 0);

    let chunkCount = 0;
    const startTime = Date.now();

    for await (const chunk of stream) {
      chunkCount++;
      const elapsed = Date.now() - startTime;
      console.log(`\n📦 Chunk ${chunkCount} (${elapsed}ms)`);
      console.log("  Text:", chunk.text || "null");
      console.log("  CoT:", chunk.cot || "null");
      console.log("  Bot ID:", chunk.botId);
    }

    const totalTime = Date.now() - startTime;
    console.log(
      `\n✅ Stream completed in ${totalTime}ms with ${chunkCount} chunks`
    );

    console.log("\n🎯 Testing Summary:");
    console.log("✅ API connection: Working");
    console.log("✅ Agents listing: Working");
    console.log("✅ Workforces listing: Working");
    console.log("✅ Profile retrieval: Working");
    console.log("⚠️  Streaming test: Requires conversation ID");

    console.log("\n📝 To test streaming:");
    console.log("1. Create a conversation in AgentX platform");
    console.log("2. Update the conversation ID in the test script");
    console.log("3. Uncomment the streaming test section");
    console.log("4. Run: npx ts-node test-streaming.ts");
  } catch (error: any) {
    console.error("❌ Error during testing:", error);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Run the test
testStreaming();
