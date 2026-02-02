import { MermaidDiagram } from "./MermaidDiagram";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KAGENT ARCHITECTURE - Interactive Learning Guide (Task 8 of 8)
// Covers: kagent CRDs, MCP, A2A, ADK, Operator Pattern
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    kagentOverview: `
flowchart TB
    subgraph USER["👤 USER"]
        CHAT["Chat Interface"]
    end
    
    subgraph K8S["☸️ KUBERNETES CLUSTER"]
        subgraph KAGENT_OPERATOR["🤖 KAGENT OPERATOR"]
            CTRL["Controller<br/>━━━━━━━━━━━━━━<br/>Watches Agent CRs<br/>Manages lifecycles"]
        end
        
        subgraph CRS["Agent Custom Resources"]
            AGENT1["Agent: task-planner<br/>━━━━━━━━━━━━━━<br/>model: gpt-4<br/>tools: [kubectl, helm]"]
            AGENT2["Agent: code-reviewer<br/>━━━━━━━━━━━━━━<br/>model: claude-3<br/>tools: [github, jira]"]
        end
        
        subgraph PODS["Agent Pods"]
            POD1["🏠 task-planner-pod<br/>Running ADK runtime"]
            POD2["🏠 code-reviewer-pod<br/>Running ADK runtime"]
        end
        
        subgraph MCP["🔧 MCP SERVERS"]
            MCP1["kubectl-mcp<br/>K8s operations"]
            MCP2["github-mcp<br/>Git operations"]
            MCP3["slack-mcp<br/>Notifications"]
        end
    end
    
    CHAT -->|"messages"| AGENT1
    CTRL -->|"reconciles"| AGENT1
    CTRL -->|"reconciles"| AGENT2
    AGENT1 -->|"creates"| POD1
    AGENT2 -->|"creates"| POD2
    POD1 -->|"uses tools"| MCP1
    POD1 -->|"uses tools"| MCP3
    POD2 -->|"uses tools"| MCP2
    
    style KAGENT_OPERATOR fill:#312e81,stroke:#818cf8,stroke-width:2px
    style CRS fill:#7c2d12,stroke:#fb923c
    style PODS fill:#064e3b,stroke:#34d399
    style MCP fill:#0e7490,stroke:#22d3ee
`,

    agentCRD: `
flowchart TB
    subgraph CRD["📐 AGENT CRD (Schema)"]
        SCHEMA["apiVersion: kagent.dev/v1alpha1<br/>kind: Agent<br/>━━━━━━━━━━━━━━━━━━━━━━<br/>spec:<br/>  model: string<br/>  systemPrompt: string<br/>  tools: []ToolRef<br/>  memory: MemoryConfig<br/>  supervisor: SupervisorRef"]
    end
    
    subgraph CR["📄 AGENT CR (Instance)"]
        INSTANCE["apiVersion: kagent.dev/v1alpha1<br/>kind: Agent<br/>metadata:<br/>  name: devops-assistant<br/>spec:<br/>  model: gpt-4-turbo<br/>  systemPrompt: 'You are a DevOps expert...'<br/>  tools:<br/>    - name: kubectl<br/>    - name: helm<br/>    - name: argocd"]
    end
    
    subgraph RESULT["What Operator Creates"]
        DEPLOY["Deployment<br/>(agent runtime)"]
        SVC["Service<br/>(for A2A)"]
        CM["ConfigMap<br/>(prompts)"]
        SECRET["Secret<br/>(API keys)"]
    end
    
    CRD -->|"validates"| CR
    CR -->|"operator reconciles"| RESULT
    
    style CRD fill:#422006,stroke:#fbbf24
    style CR fill:#052e16,stroke:#22c55e
    style RESULT fill:#0e7490,stroke:#22d3ee
`,

    mcpFlow: `
flowchart LR
    subgraph AGENT["🤖 AGENT"]
        LLM["LLM decides:<br/>'I need to list pods'"]
        CALL["Calls tool:<br/>kubectl_get_pods()"]
    end
    
    subgraph MCP["🔧 MCP SERVER"]
        REGISTRY["Tool Registry<br/>━━━━━━━━━━━━━<br/>kubectl_get_pods<br/>kubectl_apply<br/>kubectl_logs"]
        EXEC["Executes Tool<br/>━━━━━━━━━━━━━<br/>Runs kubectl<br/>Returns result"]
    end
    
    subgraph CLUSTER["☸️ KUBERNETES"]
        API["API Server"]
        PODS["Pods"]
    end
    
    LLM --> CALL
    CALL -->|"JSON-RPC"| REGISTRY
    REGISTRY --> EXEC
    EXEC -->|"kubectl"| API
    API --> PODS
    EXEC -->|"result"| AGENT
    
    style AGENT fill:#312e81,stroke:#818cf8
    style MCP fill:#0e7490,stroke:#22d3ee,stroke-width:2px
    style CLUSTER fill:#064e3b,stroke:#34d399
`,

    a2aFlow: `
flowchart TB
    subgraph SUPERVISOR["👑 SUPERVISOR AGENT"]
        PLAN["1. Plans tasks<br/>2. Delegates to specialists<br/>3. Aggregates results"]
    end
    
    subgraph WORKERS["👷 SPECIALIST AGENTS"]
        W1["DevOps Agent<br/>━━━━━━━━━━━<br/>kubectl, helm"]
        W2["Code Agent<br/>━━━━━━━━━━━<br/>github, review"]
        W3["Test Agent<br/>━━━━━━━━━━━<br/>pytest, coverage"]
    end
    
    SUPERVISOR -->|"A2A: deploy app"| W1
    SUPERVISOR -->|"A2A: review PR"| W2
    SUPERVISOR -->|"A2A: run tests"| W3
    
    W1 -->|"A2A: result"| SUPERVISOR
    W2 -->|"A2A: result"| SUPERVISOR
    W3 -->|"A2A: result"| SUPERVISOR
    
    USER["👤 User"] -->|"Build and deploy feature X"| SUPERVISOR
    SUPERVISOR -->|"Feature X deployed!"| USER
    
    style SUPERVISOR fill:#7c2d12,stroke:#fb923c,stroke-width:2px
    style WORKERS fill:#0e7490,stroke:#22d3ee
`,

    adkRuntime: `
flowchart TB
    subgraph POD["🏠 AGENT POD"]
        subgraph ADK["📦 ADK RUNTIME"]
            LOOP["Agent Loop<br/>━━━━━━━━━━━━<br/>1. Receive message<br/>2. Think (LLM call)<br/>3. Act (tool call)<br/>4. Observe result<br/>5. Repeat or respond"]
            
            MEMORY["Memory<br/>━━━━━━━━━━━━<br/>Conversation history<br/>Context window"]
            
            TOOLING["Tool Interface<br/>━━━━━━━━━━━━<br/>MCP client<br/>A2A client"]
        end
        
        LOOP --> MEMORY
        LOOP --> TOOLING
    end
    
    subgraph EXTERNAL["External Services"]
        LLM_API["🧠 LLM API<br/>OpenAI/Anthropic"]
        MCP_SERVERS["🔧 MCP Servers"]
        OTHER_AGENTS["🤖 Other Agents"]
    end
    
    LOOP -->|"inference"| LLM_API
    TOOLING -->|"tool calls"| MCP_SERVERS
    TOOLING -->|"A2A messages"| OTHER_AGENTS
    
    style ADK fill:#312e81,stroke:#818cf8,stroke-width:2px
    style EXTERNAL fill:#1e293b,stroke:#64748b
`,

    fullArchitecture: `
flowchart TB
    subgraph UI["User Interface"]
        WEB["Web Chat"]
        CLI["CLI"]
        API["REST API"]
    end
    
    subgraph K8S["☸️ Kubernetes Cluster"]
        subgraph CONTROL["Control Plane"]
            OPERATOR["kagent Operator"]
            CRD["Agent CRDs"]
        end
        
        subgraph AGENTS["Agent Pods"]
            SUP["Supervisor<br/>Agent"]
            A1["Agent 1"]
            A2["Agent 2"]
            A3["Agent 3"]
        end
        
        subgraph TOOLS["MCP Servers"]
            T1["kubectl-mcp"]
            T2["github-mcp"]
            T3["custom-mcp"]
        end
    end
    
    subgraph EXT["External"]
        LLM["LLM APIs"]
        DB["Vector DB"]
        SERVICES["External APIs"]
    end
    
    UI --> SUP
    OPERATOR --> AGENTS
    CRD --> OPERATOR
    SUP -->|"A2A"| A1
    SUP -->|"A2A"| A2
    SUP -->|"A2A"| A3
    AGENTS -->|"MCP"| TOOLS
    AGENTS --> LLM
    AGENTS --> DB
    TOOLS --> SERVICES
    
    style CONTROL fill:#312e81,stroke:#818cf8
    style AGENTS fill:#064e3b,stroke:#34d399
    style TOOLS fill:#0e7490,stroke:#22d3ee
`
};

const concepts = [
    {
        id: "kagent",
        icon: "🤖",
        name: "kagent",
        tagline: "Kubernetes-Native AI Agents",
        color: "#818cf8",
        what: "kagent is a Kubernetes operator that manages AI agents as native K8s resources. You define agents as Custom Resources (CRs), and the operator handles their lifecycle: creating pods, configuring tools, enabling communication.",
        why: "Managing AI agents manually is hard: configuration, scaling, updates, observability. kagent treats agents like any K8s workload — declarative, version-controlled, observable, self-healing.",
        analogy: "A talent agency for AI workers. You submit a job description (Agent CR). The agency (Operator) finds/creates a worker, equips them with tools, puts them in an office (Pod), and manages their employment.",
    },
    {
        id: "mcp",
        icon: "🔧",
        name: "MCP (Model Context Protocol)",
        tagline: "Universal Tool Interface",
        color: "#22d3ee",
        what: "MCP is a protocol that lets AI agents call external tools. Instead of hardcoding integrations, agents connect to MCP servers that expose tools via JSON-RPC. Any tool can become an MCP server.",
        why: "Tool sprawl is messy. Every LLM provider has different function calling. MCP standardizes it: one protocol, infinite tools. Add kubectl, GitHub, Slack — all through the same interface.",
        analogy: "A universal remote control. Your TV, sound system, lights all have different remotes. MCP is ONE remote that speaks to all devices. Add a new gadget? Just pair it once.",
    },
    {
        id: "a2a",
        icon: "💬",
        name: "A2A (Agent-to-Agent)",
        tagline: "Multi-Agent Communication",
        color: "#fb923c",
        what: "A2A is a protocol for agents to talk to each other. A supervisor agent can delegate tasks to specialist agents, wait for results, and aggregate them. Agents become microservices that collaborate.",
        why: "Complex tasks need multiple skills. One agent for code, one for DevOps, one for testing. A2A lets a supervisor orchestrate them. Divide and conquer with specialized AI workers.",
        analogy: "A project manager with specialists. PM receives 'launch new feature'. PM assigns: Dev writes code, DevOps deploys, QA tests. PM collects results and reports back. No single person does everything.",
    },
    {
        id: "adk",
        icon: "📦",
        name: "ADK (Agent Development Kit)",
        tagline: "Agent Runtime Framework",
        color: "#22c55e",
        what: "ADK is the runtime that runs inside each agent pod. It handles the agent loop: receive message → LLM inference → tool execution → observe → respond. It also manages memory and context.",
        why: "Building an agent loop from scratch is complex: retries, context management, tool orchestration. ADK provides battle-tested infrastructure. Focus on prompts and tools, not plumbing.",
        analogy: "An operating system for agents. You don't write disk drivers — the OS handles it. ADK handles the 'operating system' parts of running an agent.",
    },
];

const agentCRExample = `apiVersion: kagent.dev/v1alpha1
kind: Agent
metadata:
  name: devops-assistant
  namespace: ai-agents
spec:
  # LLM Configuration
  model:
    provider: openai
    name: gpt-4-turbo
    temperature: 0.1
  
  # Agent Identity
  systemPrompt: |
    You are a DevOps expert who helps with Kubernetes
    operations. You can deploy apps, debug issues,
    and manage infrastructure.
  
  # Available Tools (MCP Servers)
  tools:
    - name: kubectl
      mcpServer: kubectl-mcp.tools.svc:8080
    - name: helm
      mcpServer: helm-mcp.tools.svc:8080
    - name: argocd
      mcpServer: argocd-mcp.tools.svc:8080
  
  # Optional: Supervisor (for multi-agent)
  supervisor:
    agentRef: task-planner
    capabilities: ["deployment", "debugging"]
  
  # Memory configuration
  memory:
    type: conversation
    maxTokens: 8000

status:
  ready: true
  podName: devops-assistant-pod-7d8f9
  lastActive: "2024-01-15T10:30:00Z"`;

const mcpToolExample = `// MCP Server exposing kubectl tools

{
  "tools": [
    {
      "name": "kubectl_get_pods",
      "description": "List pods in a namespace",
      "inputSchema": {
        "type": "object",
        "properties": {
          "namespace": { "type": "string" },
          "labelSelector": { "type": "string" }
        }
      }
    },
    {
      "name": "kubectl_apply",
      "description": "Apply a Kubernetes manifest",
      "inputSchema": {
        "type": "object",
        "properties": {
          "manifest": { "type": "string" },
          "namespace": { "type": "string" }
        }
      }
    },
    {
      "name": "kubectl_logs",
      "description": "Get logs from a pod",
      "inputSchema": {
        "type": "object",
        "properties": {
          "podName": { "type": "string" },
          "namespace": { "type": "string" },
          "tailLines": { "type": "integer" }
        }
      }
    }
  ]
}`;

// MermaidDiagram is imported from shared component above

function AgentLifecycleAnimation() {
    const [step, setStep] = useState(0);
    const steps = [
        { phase: "CR Created", icon: "📄", desc: "User applies Agent CR to cluster", color: "#fbbf24" },
        { phase: "Operator Reconciles", icon: "🤖", desc: "kagent operator detects new Agent CR", color: "#818cf8" },
        { phase: "Pod Created", icon: "🏠", desc: "Operator creates pod with ADK runtime", color: "#22c55e" },
        { phase: "MCP Connected", icon: "🔧", desc: "Agent connects to configured MCP servers", color: "#22d3ee" },
        { phase: "Ready!", icon: "✅", desc: "Agent is ready to receive messages", color: "#4ade80" },
        { phase: "User Message", icon: "💬", desc: "User: 'Deploy nginx to staging'", color: "#fb923c" },
        { phase: "LLM Thinks", icon: "🧠", desc: "Agent calls LLM, decides to use kubectl", color: "#818cf8" },
        { phase: "Tool Call", icon: "🔧", desc: "Agent calls kubectl-mcp to create deployment", color: "#22d3ee" },
        { phase: "Response", icon: "📤", desc: "Agent: 'nginx deployed to staging ✅'", color: "#4ade80" },
    ];

    useEffect(() => {
        const timer = setInterval(() => setStep(s => (s + 1) % steps.length), 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(129, 140, 248, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#818cf8", marginBottom: 20 }}>
                🔄 Agent Lifecycle Animation
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
                {steps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setStep(i)}
                        style={{
                            padding: "4px 8px",
                            borderRadius: 6,
                            border: step === i ? `1px solid ${s.color}` : "1px solid #334155",
                            background: step === i ? `${s.color}20` : "transparent",
                            fontSize: 14,
                            cursor: "pointer"
                        }}
                    >
                        {s.icon}
                    </button>
                ))}
            </div>

            <div style={{
                padding: 20,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                borderLeft: `4px solid ${steps[step].color}`
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: steps[step].color }}>
                        {steps[step].icon} Step {step + 1}: {steps[step].phase}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                        {step <= 4 ? "Setup" : "Runtime"}
                    </div>
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>
                    {steps[step].desc}
                </div>
            </div>
        </div>
    );
}

function ConceptCards() {
    const [expanded, setExpanded] = useState(null);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {concepts.map(c => (
                <div
                    key={c.id}
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    style={{
                        background: expanded === c.id ? `${c.color}10` : "rgba(15, 23, 42, 0.6)",
                        border: `1px solid ${expanded === c.id ? c.color + "40" : "#1e293b"}`,
                        borderRadius: 12,
                        padding: 16,
                        cursor: "pointer",
                        transition: "all 0.3s"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 28 }}>{c.icon}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: c.color }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: "#94a3b8" }}>{c.tagline}</div>
                        </div>
                        <div style={{ color: c.color, transform: expanded === c.id ? "rotate(180deg)" : "", transition: "0.3s" }}>▼</div>
                    </div>

                    {expanded === c.id && (
                        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                            <div style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: c.color, marginBottom: 4 }}>📌 WHAT</div>
                                <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{c.what}</div>
                            </div>
                            <div style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: c.color, marginBottom: 4 }}>💡 WHY</div>
                                <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{c.why}</div>
                            </div>
                            <div style={{ background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 8 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: c.color, marginBottom: 4 }}>🏙️ ANALOGY</div>
                                <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{c.analogy}</div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function CodeExample({ title, code, language, color }) {
    return (
        <div style={{
            background: `linear-gradient(135deg, #0f172a 0%, ${color}15 100%)`,
            borderRadius: 16,
            padding: 24,
            border: `1px solid ${color}30`
        }}>
            <div style={{ fontSize: 16, fontWeight: 700, color, marginBottom: 16 }}>
                {title}
            </div>
            <pre style={{
                background: "rgba(0,0,0,0.4)",
                padding: 16,
                borderRadius: 12,
                fontSize: 11,
                lineHeight: 1.5,
                color: "#e2e8f0",
                fontFamily: "monospace",
                overflow: "auto",
                maxHeight: 400
            }}>
                {code}
            </pre>
        </div>
    );
}

function MultiAgentDemo() {
    const [activeAgent, setActiveAgent] = useState(null);
    const agents = [
        { id: "supervisor", name: "Task Planner", icon: "👑", color: "#fb923c", role: "Breaks down tasks, delegates, aggregates" },
        { id: "devops", name: "DevOps Agent", icon: "🔧", color: "#22d3ee", role: "kubectl, helm, argocd operations" },
        { id: "code", name: "Code Agent", icon: "💻", color: "#818cf8", role: "GitHub, code review, refactoring" },
        { id: "test", name: "Test Agent", icon: "🧪", color: "#22c55e", role: "pytest, coverage, test generation" },
    ];

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #422006 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(251, 146, 60, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fb923c", marginBottom: 20 }}>
                💬 Multi-Agent Collaboration (A2A)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {agents.map(a => (
                    <div
                        key={a.id}
                        onClick={() => setActiveAgent(activeAgent === a.id ? null : a.id)}
                        style={{
                            padding: 16,
                            background: activeAgent === a.id ? `${a.color}20` : "rgba(0,0,0,0.3)",
                            border: `2px solid ${activeAgent === a.id ? a.color : "#334155"}`,
                            borderRadius: 12,
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.3s"
                        }}
                    >
                        <div style={{ fontSize: 32 }}>{a.icon}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: a.color, marginTop: 8 }}>{a.name}</div>
                        {activeAgent === a.id && (
                            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 8 }}>{a.role}</div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: 20,
                padding: 16,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                fontSize: 12,
                color: "#fcd34d"
            }}>
                <strong>Flow:</strong> User → Supervisor delegates via A2A → Specialists execute → Results aggregate → User gets response
            </div>
        </div>
    );
}

export default function KagentArchitectureApp() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <div style={{
            minHeight: "100vh",
            background: "#030712",
            color: "#e2e8f0",
            fontFamily: "'Inter', -apple-system, sans-serif"
        }}>
            <div style={{
                position: "fixed",
                inset: 0,
                background: "radial-gradient(ellipse at top, rgba(129,140,248,0.08) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        background: "rgba(129,140,248,0.1)",
                        border: "1px solid rgba(129,140,248,0.3)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#818cf8",
                        marginBottom: 16
                    }}>
                        <span>🎉</span>
                        <span>Task 8 of 8 — FINAL!</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 50%, #fb923c 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        kagent Architecture
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Kubernetes-Native AI Agents • CRDs • MCP • A2A • ADK
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "overview", label: "🗺️ Overview" },
                        { id: "concepts", label: "📖 Concepts" },
                        { id: "lifecycle", label: "🔄 Lifecycle" },
                        { id: "multiagent", label: "💬 Multi-Agent" },
                        { id: "yaml", label: "📝 YAML" },
                        { id: "diagrams", label: "🏗️ Architecture" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 16px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? "1px solid #818cf860" : "1px solid #1e293b",
                                background: activeTab === tab.id ? "rgba(129,140,248,0.1)" : "transparent",
                                color: activeTab === tab.id ? "#818cf8" : "#64748b",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 13
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "overview" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <MermaidDiagram chart={diagrams.kagentOverview} title="kagent Overview" />
                        <div style={{
                            padding: 20,
                            background: "rgba(129,140,248,0.1)",
                            borderRadius: 16,
                            border: "1px solid rgba(129,140,248,0.2)"
                        }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#818cf8", marginBottom: 12 }}>
                                🎯 Key Takeaways
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 20, color: "#cbd5e1", lineHeight: 1.8, fontSize: 13 }}>
                                <li><strong>kagent</strong> = K8s operator that manages AI agents as CRs</li>
                                <li><strong>Agent CR</strong> = Declarative agent definition (model, tools, prompts)</li>
                                <li><strong>MCP</strong> = Protocol for agents to call external tools</li>
                                <li><strong>A2A</strong> = Protocol for agent-to-agent communication</li>
                                <li><strong>ADK</strong> = Runtime that powers each agent pod</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === "concepts" && <ConceptCards />}
                {activeTab === "lifecycle" && <AgentLifecycleAnimation />}
                {activeTab === "multiagent" && <MultiAgentDemo />}

                {activeTab === "yaml" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <CodeExample
                            title="📄 Agent Custom Resource"
                            code={agentCRExample}
                            language="yaml"
                            color="#22c55e"
                        />
                        <CodeExample
                            title="🔧 MCP Tool Registry"
                            code={mcpToolExample}
                            language="json"
                            color="#22d3ee"
                        />
                    </div>
                )}

                {activeTab === "diagrams" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <MermaidDiagram chart={diagrams.agentCRD} title="Agent CRD → CR → Resources" />
                        <MermaidDiagram chart={diagrams.mcpFlow} title="MCP Tool Call Flow" />
                        <MermaidDiagram chart={diagrams.a2aFlow} title="A2A Multi-Agent Flow" />
                        <MermaidDiagram chart={diagrams.adkRuntime} title="ADK Runtime" />
                        <MermaidDiagram chart={diagrams.fullArchitecture} title="Complete Architecture" />
                    </div>
                )}

                <div style={{
                    marginTop: 48,
                    padding: 32,
                    background: "linear-gradient(135deg, rgba(129,140,248,0.1) 0%, rgba(34,211,238,0.1) 100%)",
                    border: "2px solid rgba(129,140,248,0.3)",
                    borderRadius: 20,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
                    <div style={{ fontSize: 22, color: "#818cf8", fontWeight: 700, marginBottom: 8 }}>
                        All 8 Tasks Complete!
                    </div>
                    <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8 }}>
                        You now understand Kubernetes from core concepts to kagent AI agents!<br />
                        <strong>Tasks covered:</strong> Core Concepts • Traffic & Scaling • Security & Config • Helm • Observability • CRDs & Operators • Commands • kagent Architecture
                    </div>
                </div>
            </div>
        </div>
    );
}
