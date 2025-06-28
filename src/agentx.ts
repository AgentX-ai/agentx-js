import axios, { AxiosResponse } from "axios";
import { getHeaders } from "./util";
import { Agent } from "./resources/agent";
import { Workforce } from "./resources/workforce";

export class AgentX {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.AGENTX_API_KEY || "";
    if (!this.apiKey) {
      throw new Error(
        "API key is required. Set AGENTX_API_KEY environment variable or pass apiKey parameter."
      );
    } else {
      process.env.AGENTX_API_KEY = this.apiKey;
    }
  }

  async getAgent(id: string): Promise<Agent> {
    const url = `https://api.agentx.so/api/v1/access/agents/${id}`;
    const response: AxiosResponse = await axios.get(url, {
      headers: getHeaders(),
    });

    if (response.status === 200) {
      const agentRes = response.data;
      return new Agent({
        id: agentRes._id,
        name: agentRes.name,
        avatar: agentRes.avatar,
        createdAt: agentRes.createdAt,
        updatedAt: agentRes.updatedAt,
      });
    } else {
      throw new Error(`Failed to retrieve agent: ${response.statusText}`);
    }
  }

  async listAgents(): Promise<Agent[]> {
    const url = "https://api.agentx.so/api/v1/access/agents";
    const response: AxiosResponse = await axios.get(url, {
      headers: getHeaders(),
    });

    if (response.status === 200) {
      return response.data.map(
        (agent: any) =>
          new Agent({
            id: agent._id,
            name: agent.name,
            avatar: agent.avatar,
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt,
          })
      );
    } else {
      throw new Error(`Failed to list agents: ${response.statusText}`);
    }
  }

  async listWorkforces(): Promise<Workforce[]> {
    const url = "https://api.agentx.so/api/v1/access/teams";
    const response: AxiosResponse = await axios.get(url, {
      headers: getHeaders(),
    });

    if (response.status === 200) {
      return response.data.map(
        (workforce: any) =>
          new Workforce({
            id: workforce._id,
            agents: workforce.agents.map(
              (agent: any) =>
                new Agent({
                  id: agent._id,
                  name: agent.name,
                  avatar: agent.avatar,
                  createdAt: agent.createdAt,
                  updatedAt: agent.updatedAt,
                })
            ),
            name: workforce.name,
            image: workforce.image,
            description: workforce.description,
            manager: new Agent({
              id: workforce.manager._id,
              name: workforce.manager.name,
              avatar: workforce.manager.avatar,
              createdAt: workforce.manager.createdAt,
              updatedAt: workforce.manager.updatedAt,
            }),
            creator: workforce.creator,
            context: workforce.context,
            references: workforce.references,
            workspace: workforce.workspace,
            createdAt: workforce.createdAt,
            updatedAt: workforce.updatedAt,
          })
      );
    } else {
      throw new Error(
        `Failed to list workforces: ${response.status} - ${response.statusText}`
      );
    }
  }

  async getProfile(): Promise<any> {
    const url = "https://api.agentx.so/api/v1/access/getProfile";
    const response: AxiosResponse = await axios.get(url, {
      headers: getHeaders(),
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(
        `Failed to get profile: ${response.status} - ${response.statusText}`
      );
    }
  }
}
