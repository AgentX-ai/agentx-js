## To Test locally

Get credentials and IDs from AgentX dashboard and replace those in `test` files

```
API_KEY
AGENT_ID
CONVERSATION_ID
```

## Quick Test

Run the basic connectivity test:

```bash
npx ts-node test-streaming.ts
```

This will test:

- ✅ API connection
- ✅ Agents listing
- ✅ Workforces listing
- ✅ Profile retrieval

## Testing the Streaming Functionality

```bash
npx ts-node test-streaming.ts
```

## Expected Output

If the streaming is working correctly, you should see output like:

```
📦 Chunk 1 (150ms)
  Text: null
  CoT: The user's question 'How can you help me?' is a ge
  Bot ID: 6862e8d0414914e72f4f77c2

📦 Chunk 2 (200ms)
  Text: null
  CoT: neral inquiry about the capabilities of the AI age
  Bot ID: 6862e8d0414914e72f4f77c2

📦 Chunk 3 (250ms)
  Text: Hello
  CoT: null
  Bot ID: 6862e8d0414914e72f4f77c2
```
