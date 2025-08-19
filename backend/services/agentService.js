import OpenAI from 'openai';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

class AgentService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Use gpt-4o-mini as specified
    this.model = 'gpt-4o-mini';
  }

  /**
   * Generate a team of pseudo-agents based on a goal
   * @param {string} goal - The goal string
   * @param {number} maxAgents - Maximum number of agents (default: 5)
   * @returns {Promise<object>} - Generated agent team
   */
  async generateAgentTeam(goal, maxAgents = 5) {
    try {
      if (!goal || goal.trim().length === 0) {
        throw new Error('Goal is required for agent generation');
      }

      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      console.log(`Generating agent team for goal: "${goal}"`);

      const systemPrompt = `You are an expert at creating specialized agent teams for complex goals. 
Your task is to analyze a given goal and create a team of 3-7 distinct pseudo-agents, each with specific roles and responsibilities.

Important requirements:
- Create between 3 and ${maxAgents} agents maximum
- Each agent should have a distinct, non-overlapping role
- Focus on practical, actionable agents that can help achieve the goal
- Make responsibilities specific and detailed
- Create compelling system prompts that define each agent's personality and approach
- Include style guidelines and call hints where relevant

Return ONLY valid JSON in this exact format:`;

      const userPrompt = `Goal: "${goal}"

Create a specialized agent team for this goal. Return JSON with this structure:
{
  "team": {
    "goal": "${goal}",
    "summary": "Brief description of the overall approach and how this team will achieve the goal",
    "agents": [
      {
        "role": "Agent role title",
        "purpose": "What this agent is designed to do",
        "responsibilities": [
          "Specific responsibility 1",
          "Specific responsibility 2",
          "Specific responsibility 3"
        ],
        "systemPrompt": "Detailed system prompt that defines this agent's personality, expertise, and approach. Should be ready to use as-is in a chat interface.",
        "style": "Communication style (e.g., 'Professional and analytical', 'Creative and enthusiastic')",
        "callHint": "When to use this agent (e.g., 'Use when you need data analysis', 'Call for creative brainstorming')"
      }
    ]
  }
}

Focus on creating agents that complement each other and cover all aspects needed to achieve the goal.`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.2, // Low temperature for consistent structure
        response_format: { type: "json_object" }, // Ensure JSON response
        max_tokens: 4000
      });

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response received from OpenAI');
      }

      const content = response.choices[0].message.content.trim();
      let agentTeam;
      
      try {
        agentTeam = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', content);
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Validate and enhance the response
      if (!agentTeam.team || !agentTeam.team.agents || !Array.isArray(agentTeam.team.agents)) {
        throw new Error('Invalid team structure in response');
      }

      // Add IDs and timestamps to the team and agents
      const teamId = this.generateId('team');
      const enhancedTeam = {
        id: teamId,
        goal: agentTeam.team.goal,
        summary: agentTeam.team.summary,
        agents: agentTeam.team.agents.map(agent => ({
          id: this.generateId('agent'),
          ...agent
        })),
        createdAt: new Date().toISOString()
      };

      // Validate agent count
      if (enhancedTeam.agents.length < 3 || enhancedTeam.agents.length > maxAgents) {
        console.warn(`Generated ${enhancedTeam.agents.length} agents, expected 3-${maxAgents}`);
      }

      console.log(`Successfully generated team with ${enhancedTeam.agents.length} agents`);
      console.log(`Tokens used: ${response.usage?.total_tokens || 'unknown'}`);

      return { team: enhancedTeam };

    } catch (error) {
      console.error('Error generating agent team:', error);
      
      // Provide helpful error messages
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or not configured');
      } else if (error.message.includes('quota')) {
        throw new Error('OpenAI API quota exceeded');
      } else if (error.message.includes('rate')) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`Failed to generate agent team: ${error.message}`);
    }
  }

  /**
   * Generate a unique ID for team/agent
   * @param {string} prefix - Prefix for the ID
   * @returns {string} - Unique ID
   */
  generateId(prefix) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(3).toString('hex');
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Validate agent team structure
   * @param {object} team - Team object to validate
   * @returns {boolean} - True if valid
   */
  validateTeamStructure(team) {
    if (!team || typeof team !== 'object') return false;
    if (!team.id || !team.goal || !team.summary) return false;
    if (!Array.isArray(team.agents)) return false;

    return team.agents.every(agent => 
      agent.id &&
      agent.role &&
      agent.purpose &&
      Array.isArray(agent.responsibilities) &&
      agent.systemPrompt
    );
  }

  /**
   * Generate a single agent based on specific criteria
   * @param {string} role - The agent role
   * @param {string} context - Context for the agent
   * @returns {Promise<object>} - Generated agent
   */
  async generateSingleAgent(role, context) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "Create a single specialized agent with the given role and context. Return valid JSON only."
          },
          {
            role: "user",
            content: `Create an agent with role: "${role}" for context: "${context}".

Return JSON:
{
  "agent": {
    "role": "${role}",
    "purpose": "What this agent does",
    "responsibilities": ["responsibility1", "responsibility2", "responsibility3"],
    "systemPrompt": "Complete system prompt defining the agent",
    "style": "Communication style",
    "callHint": "When to use this agent"
  }
}`
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
        max_tokens: 1000
      });

      const content = response.choices[0].message.content.trim();
      const result = JSON.parse(content);
      
      return {
        id: this.generateId('agent'),
        ...result.agent,
        createdAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error generating single agent:', error);
      throw new Error(`Failed to generate agent: ${error.message}`);
    }
  }

  /**
   * Check if agent service is properly configured
   * @returns {boolean} - True if properly configured
   */
  isConfigured() {
    return !!process.env.OPENAI_API_KEY;
  }
}

export const agentService = new AgentService();
