# COMPT Agent Team Generation

## 🎯 Overview

This backend extension adds agent team generation functionality to the existing PDF processing backend. It implements the COMPT feature that generates pseudo-agents from goal strings using OpenAI's gpt-4o-mini model.

## ✨ Features

- **Goal-to-Team Generation**: Convert text goals into structured agent teams
- **Intelligent Agent Creation**: 3-7 distinct agents with specific roles and responsibilities  
- **System Prompt Generation**: Each agent includes ready-to-use system prompts
- **Session Storage**: Teams persist in sessionStorage with proper schema
- **Space Management**: Full CRUD operations for agent teams
- **Optimized API Calls**: Uses cost-effective gpt-4o-mini model

## 🚀 API Endpoints

### Generate Agent Team
```http
POST /api/agentize
Content-Type: application/json

{
  "goal": "design a marketing campaign",
  "maxAgents": 5
}
```

**Response:**
```json
{
  "success": true,
  "team": {
    "id": "team_1703123456789_abc123",
    "goal": "design a marketing campaign",
    "summary": "A comprehensive marketing team approach...",
    "agents": [
      {
        "id": "agent_1703123456790_def456",
        "role": "Marketing Strategist", 
        "purpose": "Develop comprehensive marketing strategies",
        "responsibilities": [
          "Analyze target market and competitors",
          "Define marketing objectives and KPIs", 
          "Create integrated campaign strategies"
        ],
        "systemPrompt": "You are an expert Marketing Strategist...",
        "style": "Professional and analytical",
        "callHint": "Use when you need strategic marketing guidance"
      }
    ],
    "createdAt": "2024-12-19T10:30:45.789Z"
  },
  "message": "Generated team with 5 agents",
  "teamId": "team_1703123456789_abc123"
}
```

### Get COMPT Space
```http
GET /api/compt/space
```

Returns the complete space structure for sessionStorage sync:
```json
{
  "success": true,
  "space": {
    "teams": [...],
    "metadata": {
      "createdAt": "2024-12-19T10:00:00.000Z",
      "lastUpdated": "2024-12-19T10:30:45.789Z"
    }
  }
}
```

### List All Teams
```http
GET /api/compt/teams
```

### Get Specific Team
```http
GET /api/compt/team/:teamId
```

### Delete Team
```http
DELETE /api/compt/team/:teamId
```

## 📋 Agent Schema

Each generated agent follows this structure:

```typescript
interface Agent {
  id: string;                    // Unique agent ID
  role: string;                  // Agent role title
  purpose: string;               // What this agent does
  responsibilities: string[];     // Specific tasks
  systemPrompt: string;          // Ready-to-use system prompt
  style?: string;                // Communication style
  callHint?: string;             // When to use this agent
}
```

## 🏗️ Team Schema

```typescript
interface AgentTeam {
  id: string;                    // Unique team ID  
  goal: string;                  // Original goal
  summary: string;               // Team approach summary
  agents: Agent[];               // Array of agents (3-7)
  createdAt: string;             // ISO timestamp
}
```

## 💾 Storage Schema

The system maintains a `compt:space` key in sessionStorage with this structure:

```typescript
interface ComptSpace {
  teams: AgentTeam[];
  metadata: {
    createdAt: string;
    lastUpdated: string;
  };
}
```

## 🔧 Configuration

### Environment Variables
```env
OPENAI_API_KEY=sk-your-openai-key-here  # Required for agent generation
PORT=3001                               # Server port
```

### Model Settings
- **Model**: `gpt-4o-mini` (cost-effective)
- **Temperature**: `0.2` (consistent results)
- **Response Format**: `json_object` (structured output)
- **Max Tokens**: `4000` (comprehensive agents)

## 🧪 Testing

### Manual Testing
```bash
# Test agent generation
curl -X POST http://localhost:3001/api/agentize \
  -H "Content-Type: application/json" \
  -d '{"goal": "build a mobile app", "maxAgents": 4}'

# Get all teams
curl http://localhost:3001/api/compt/teams

# Get space for sessionStorage
curl http://localhost:3001/api/compt/space
```

### Automated Testing
```bash
node test-agentize.js  # Full agent generation test
```

## 🎨 Frontend Integration

### Client-Side Flow
1. **Input**: User enters goal in text field
2. **Generate**: Call `/api/agentize` with goal
3. **Store**: Team automatically saved to session
4. **Display**: Render agent cards with details
5. **Interact**: "Try Agent" buttons start mini-chats

### SessionStorage Integration
```javascript
// The backend automatically manages this key:
const space = JSON.parse(sessionStorage.getItem('compt:space') || '{}');

// Sync with server:
fetch('/api/compt/space')
  .then(res => res.json())
  .then(data => {
    sessionStorage.setItem('compt:space', JSON.stringify(data.space));
  });
```

### Agent Card Example
```jsx
function AgentCard({ agent }) {
  const tryAgent = () => {
    // Start chat with agent.systemPrompt as system message
    startChat(agent.systemPrompt);
  };

  return (
    <div className="agent-card">
      <h3>{agent.role}</h3>
      <p>{agent.purpose}</p>
      <ul>
        {agent.responsibilities.map(r => <li key={r}>{r}</li>)}
      </ul>
      <details>
        <summary>System Prompt</summary>
        <pre>{agent.systemPrompt}</pre>
      </details>
      <button onClick={tryAgent}>Try Agent</button>
    </div>
  );
}
```

## ⚡ Performance

- **Generation Time**: ~3-8 seconds per team
- **Cost**: ~$0.01-0.03 per team (gpt-4o-mini)
- **Storage**: Session-based (no database required)
- **Concurrency**: Handles multiple simultaneous requests

## 🛠️ Development

### Adding Custom Agent Types
Modify `agentService.js` to include specialized prompts:

```javascript
// Add industry-specific templates
const industryPrompts = {
  healthcare: "Focus on patient care and medical accuracy...",
  finance: "Emphasize risk management and compliance...",
  // ...
};
```

### Extending Agent Schema
Update the generation prompt in `agentService.js` to include new fields:

```javascript
const newFields = `
"expertise": "Specific domain knowledge",
"tools": ["tool1", "tool2"],
"metrics": ["success metric 1", "success metric 2"]
`;
```

## 🔒 Security & Best Practices

- ✅ Input validation on goal string
- ✅ Agent count limits (3-7)
- ✅ Session-based storage (user isolation)
- ✅ Error handling with detailed messages
- ✅ Rate limiting inherent from OpenAI API
- ✅ No persistent storage of sensitive data

## 📊 Example Generated Teams

### Goal: "Launch a SaaS Product"
- **Product Manager**: Strategy and roadmap
- **UX Designer**: User experience and research  
- **Full Stack Developer**: Technical implementation
- **Marketing Specialist**: Go-to-market strategy
- **Customer Success Manager**: User onboarding and support

### Goal: "Write a Research Paper"
- **Research Coordinator**: Literature review and methodology
- **Data Analyst**: Statistical analysis and interpretation
- **Technical Writer**: Academic writing and structure
- **Peer Reviewer**: Quality assurance and feedback

## 🚨 Troubleshooting

### Common Issues

1. **OpenAI Quota Exceeded**
   - Check billing at https://platform.openai.com/
   - Add payment method or increase quota

2. **Invalid JSON Response** 
   - OpenAI occasionally returns malformed JSON
   - The system includes retry logic and validation

3. **Agent Count Issues**
   - System enforces 3-7 agents automatically
   - Adjust maxAgents parameter if needed

4. **Session Storage Full**
   - Each team ~5-15KB in storage
   - Clear old teams if needed

## 🎯 Future Enhancements

- [ ] Agent skill matching and recommendations
- [ ] Team collaboration simulation
- [ ] Custom agent templates
- [ ] Integration with external tools
- [ ] Performance analytics and optimization
- [ ] Multi-language agent generation

---

This COMPT implementation provides a solid foundation for pseudo-agent team generation with clean API design, robust error handling, and efficient storage management.
