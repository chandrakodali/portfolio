import { MermaidDiagram } from "./MermaidDiagram";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES: THE BIG PICTURE - Interactive Learning Guide (Module 0)
// Your starting point: Why Kubernetes? Prerequisites, Architecture, Learning Path
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    theProblem: `
flowchart TB
    subgraph BEFORE["❌ WITHOUT KUBERNETES"]
        subgraph SERVER1["Server 1"]
            APP1["App A"]
            APP2["App B"]
        end
        subgraph SERVER2["Server 2"]
            APP3["App C"]
        end
        subgraph SERVER3["Server 3 💀"]
            APP4["App D (crashed!)"]
        end
        
        HUMAN["👤 Ops Team<br/>━━━━━━━━━━━<br/>• Manually deploy<br/>• Monitor each server<br/>• Restart crashed apps<br/>• Scale by hand<br/>• 3am pager duty 😩"]
    end
    
    HUMAN --> SERVER1
    HUMAN --> SERVER2
    HUMAN --> SERVER3
    
    style BEFORE fill:#450a0a,stroke:#f87171
    style SERVER3 fill:#7c2d12,stroke:#fb923c
`,

    theSolution: `
flowchart TB
    subgraph AFTER["✅ WITH KUBERNETES"]
        subgraph CLUSTER["☸️ Kubernetes Cluster"]
            CTRL["🧠 Control Plane<br/>━━━━━━━━━━━━━━<br/>• Watches everything<br/>• Auto-heals crashes<br/>• Scales automatically<br/>• Schedules workloads"]
            
            subgraph NODES["Worker Nodes"]
                N1["Node 1<br/>App A, B"]
                N2["Node 2<br/>App C, D"]
                N3["Node 3<br/>App A (replica)"]
            end
        end
        
        YAML["📄 You: 'Run 3 copies of my app'<br/>(YAML file)"]
    end
    
    YAML --> CTRL
    CTRL --> NODES
    
    style AFTER fill:#052e16,stroke:#22c55e
    style CTRL fill:#312e81,stroke:#818cf8,stroke-width:2px
`,

    bigPicture: `
flowchart TB
    subgraph USERS["🌐 USERS"]
        BROWSER["Browsers/Apps"]
    end
    
    subgraph CLUSTER["☸️ KUBERNETES CLUSTER"]
        subgraph CONTROL["🧠 Control Plane"]
            API["API Server<br/>━━━━━━━━<br/>All requests<br/>go here"]
            SCHED["Scheduler<br/>━━━━━━━━<br/>Where to run?"]
            CTRL["Controller<br/>━━━━━━━━<br/>Self-healing"]
            ETCD["etcd<br/>━━━━━━━━<br/>Database"]
        end
        
        subgraph WORKERS["🏢 Worker Nodes"]
            subgraph N1["Node 1"]
                P1["📦 Pod"]
                P2["📦 Pod"]
            end
            subgraph N2["Node 2"]
                P3["📦 Pod"]
                P4["📦 Pod"]
            end
        end
        
        INGRESS["🚪 Ingress<br/>Traffic entry point"]
        SVC["📬 Services<br/>Load balancing"]
    end
    
    BROWSER --> INGRESS
    INGRESS --> SVC
    SVC --> WORKERS
    API --> SCHED --> WORKERS
    CTRL --> WORKERS
    
    style CONTROL fill:#312e81,stroke:#818cf8
    style WORKERS fill:#064e3b,stroke:#34d399
    style SVC fill:#0e7490,stroke:#22d3ee
`,

    learningPath: `
flowchart LR
    subgraph START["🎯 START HERE"]
        M0["Module 0<br/>Big Picture<br/>(You are here!)"]
    end
    
    subgraph FOUNDATION["📚 FOUNDATION"]
        M1["Module 1<br/>Core Concepts"]
        M2["Module 2<br/>Traffic & Deploy"]
        STORAGE["Storage<br/>Module"]
    end
    
    subgraph PRODUCTION["🚀 PRODUCTION"]
        M3["Module 3<br/>Security"]
        M4["Module 4<br/>Helm"]
        M5["Module 5<br/>Observability"]
    end
    
    subgraph ADVANCED["🔧 ADVANCED"]
        M6["Module 6<br/>Operators"]
        M7["Module 7<br/>Commands"]
        M8["Module 8<br/>kagent"]
    end
    
    M0 --> M1 --> M2 --> STORAGE
    STORAGE --> M3 --> M4 --> M5
    M5 --> M6 --> M7 --> M8
    
    style START fill:#7c2d12,stroke:#fb923c,stroke-width:3px
    style FOUNDATION fill:#0e7490,stroke:#22d3ee
    style PRODUCTION fill:#312e81,stroke:#818cf8
    style ADVANCED fill:#065f46,stroke:#34d399
`
};

const whyKubernetes = [
    {
        problem: "Manual server management",
        before: "SSH into each server, install apps, configure networking, restart when crashed",
        after: "Write one YAML file, Kubernetes handles the rest",
        icon: "🖥️"
    },
    {
        problem: "Application crashes",
        before: "Get paged at 3am, manually restart the app, hope it doesn't crash again",
        after: "Kubernetes auto-restarts crashed containers in seconds",
        icon: "💀"
    },
    {
        problem: "Scaling for traffic",
        before: "Predict traffic, manually spin up new servers, configure load balancers",
        after: "'Run 10 copies' → done. Auto-scale based on CPU/memory",
        icon: "📈"
    },
    {
        problem: "Deploying updates",
        before: "Take down app, deploy new version, pray nothing breaks, rollback manually",
        after: "Rolling updates with zero downtime, one-command rollback",
        icon: "🚀"
    },
    {
        problem: "Different environments",
        before: "'Works on my machine!' Config drift between dev/staging/prod",
        after: "Same container runs identically everywhere",
        icon: "🔧"
    }
];

const prerequisites = [
    {
        name: "Docker Basics",
        description: "Understand containers, images, Dockerfile, docker run",
        required: true,
        icon: "🐳",
        check: "Can you build a Docker image and run a container?"
    },
    {
        name: "Terminal/Command Line",
        description: "Comfortable with bash/zsh, navigating directories, running commands",
        required: true,
        icon: "💻",
        check: "Can you navigate folders and run commands in terminal?"
    },
    {
        name: "YAML Syntax",
        description: "Key-value pairs, lists, indentation (Kubernetes configs are YAML)",
        required: true,
        icon: "📄",
        check: "Can you read and write basic YAML files?"
    },
    {
        name: "Basic Networking",
        description: "IP addresses, ports, DNS, HTTP — helpful but not required",
        required: false,
        icon: "🌐",
        check: "Do you know what port 80 is?"
    },
    {
        name: "Linux Basics",
        description: "File permissions, processes, environment variables — helpful",
        required: false,
        icon: "🐧",
        check: "Have you used a Linux terminal before?"
    }
];

const glossary = [
    { term: "Cluster", def: "Your entire Kubernetes environment — all nodes and control plane" },
    { term: "Node", def: "A single machine (virtual or physical) that runs your apps" },
    { term: "Pod", def: "The smallest unit in K8s — one or more containers that run together" },
    { term: "Container", def: "A packaged application with all its dependencies (like Docker)" },
    { term: "Deployment", def: "Tells K8s how many copies of your app to run" },
    { term: "Service", def: "A stable network address that load-balances to your Pods" },
    { term: "Namespace", def: "Virtual cluster to organize and isolate resources" },
    { term: "kubectl", def: "Command-line tool to interact with Kubernetes" },
    { term: "YAML manifest", def: "A file describing what you want Kubernetes to create" },
    { term: "Control Plane", def: "The 'brain' that manages the cluster" },
    { term: "etcd", def: "Database that stores all cluster state" },
    { term: "Ingress", def: "Routes external HTTP traffic to your Services" },
    { term: "ConfigMap", def: "Stores non-sensitive configuration data" },
    { term: "Secret", def: "Stores sensitive data like passwords and API keys" },
    { term: "PersistentVolume", def: "Storage that survives pod restarts" },
];

const quickStartSteps = [
    {
        step: 1,
        title: "Install kubectl",
        command: "brew install kubectl  # or download from kubernetes.io",
        note: "The command-line tool to talk to Kubernetes"
    },
    {
        step: 2,
        title: "Get a cluster (easiest options)",
        command: "# Option A: Docker Desktop → Enable Kubernetes\n# Option B: brew install minikube && minikube start\n# Option C: kind create cluster",
        note: "You need a cluster to practice on"
    },
    {
        step: 3,
        title: "Verify it works",
        command: "kubectl cluster-info\nkubectl get nodes",
        note: "You should see your cluster and at least 1 node"
    },
    {
        step: 4,
        title: "Run your first pod",
        command: "kubectl run hello --image=nginx --port=80\nkubectl get pods",
        note: "Congrats! You just deployed nginx to Kubernetes"
    },
    {
        step: 5,
        title: "Access it locally",
        command: "kubectl port-forward pod/hello 8080:80\n# Visit http://localhost:8080",
        note: "Opens a tunnel from your machine to the pod"
    },
    {
        step: 6,
        title: "Clean up",
        command: "kubectl delete pod hello",
        note: "Always clean up when experimenting"
    }
];

function PrerequisiteCard({ item }) {
    const [checked, setChecked] = useState(false);

    return (
        <div
            onClick={() => setChecked(!checked)}
            style={{
                background: checked ? "rgba(34, 197, 94, 0.1)" : "rgba(15, 23, 42, 0.6)",
                border: `1px solid ${checked ? "#22c55e" : item.required ? "#f59e0b" : "#334155"}`,
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.3s"
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
                            {item.name}
                        </span>
                        {item.required && (
                            <span style={{
                                fontSize: 10,
                                padding: "2px 8px",
                                borderRadius: 10,
                                background: "rgba(245, 158, 11, 0.2)",
                                color: "#fbbf24"
                            }}>
                                Required
                            </span>
                        )}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                        {item.description}
                    </div>
                </div>
                <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    border: `2px solid ${checked ? "#22c55e" : "#475569"}`,
                    background: checked ? "#22c55e" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 14
                }}>
                    {checked && "✓"}
                </div>
            </div>
            <div style={{
                fontSize: 11,
                color: "#64748b",
                marginTop: 8,
                fontStyle: "italic"
            }}>
                Self-check: {item.check}
            </div>
        </div>
    );
}

function WhyKubernetesCard() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 20 }}>
                🤔 Why Does Kubernetes Exist?
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {whyKubernetes.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            border: activeIndex === i ? "1px solid #a78bfa" : "1px solid #334155",
                            background: activeIndex === i ? "rgba(139,92,246,0.2)" : "transparent",
                            color: activeIndex === i ? "#a78bfa" : "#64748b",
                            cursor: "pointer",
                            fontSize: 20
                        }}
                    >
                        {item.icon}
                    </button>
                ))}
            </div>

            <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", marginBottom: 16 }}>
                Problem: {whyKubernetes[activeIndex].problem}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{
                    background: "rgba(127, 29, 29, 0.3)",
                    border: "1px solid rgba(248, 113, 113, 0.3)",
                    borderRadius: 12,
                    padding: 16
                }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>
                        ❌ WITHOUT KUBERNETES
                    </div>
                    <div style={{ fontSize: 13, color: "#fca5a5" }}>
                        {whyKubernetes[activeIndex].before}
                    </div>
                </div>
                <div style={{
                    background: "rgba(5, 46, 22, 0.3)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: 12,
                    padding: 16
                }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", marginBottom: 8 }}>
                        ✅ WITH KUBERNETES
                    </div>
                    <div style={{ fontSize: 13, color: "#86efac" }}>
                        {whyKubernetes[activeIndex].after}
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickStartGuide() {
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #052e16 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(34, 197, 94, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e", marginBottom: 20 }}>
                ⚡ 5-Minute Quick Start
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {quickStartSteps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentStep(i)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: currentStep === i ? "2px solid #22c55e" : i < currentStep ? "2px solid #22c55e50" : "1px solid #334155",
                            background: currentStep === i ? "rgba(34,197,94,0.2)" : i < currentStep ? "rgba(34,197,94,0.1)" : "transparent",
                            color: currentStep >= i ? "#22c55e" : "#64748b",
                            cursor: "pointer",
                            fontSize: 14,
                            fontWeight: 700
                        }}
                    >
                        {s.step}
                    </button>
                ))}
            </div>

            <div style={{
                padding: 20,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                borderLeft: "4px solid #22c55e"
            }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#22c55e", marginBottom: 8 }}>
                    Step {quickStartSteps[currentStep].step}: {quickStartSteps[currentStep].title}
                </div>
                <pre style={{
                    background: "rgba(0,0,0,0.4)",
                    padding: 12,
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#67e8f9",
                    fontFamily: "monospace",
                    overflow: "auto",
                    margin: "12px 0"
                }}>
                    {quickStartSteps[currentStep].command}
                </pre>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    💡 {quickStartSteps[currentStep].note}
                </div>
            </div>
        </div>
    );
}

function Glossary() {
    const [search, setSearch] = useState("");

    const filtered = glossary.filter(item =>
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.def.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(34, 211, 238, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 16 }}>
                📖 Key Terms Glossary
            </div>

            <input
                type="text"
                placeholder="Search terms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #22d3ee40",
                    background: "rgba(0,0,0,0.3)",
                    color: "#e2e8f0",
                    fontSize: 14,
                    marginBottom: 16,
                    outline: "none"
                }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                {filtered.map((item, i) => (
                    <div key={i} style={{
                        padding: "10px 14px",
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: 8,
                        display: "flex",
                        gap: 8
                    }}>
                        <code style={{ color: "#22d3ee", fontSize: 12, fontWeight: 700, minWidth: 100 }}>
                            {item.term}
                        </code>
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>{item.def}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LearningPathCard() {
    const modules = [
        { num: 0, name: "Big Picture", status: "current", color: "#fb923c" },
        { num: 1, name: "Core Concepts", status: "next", color: "#06b6d4" },
        { num: 2, name: "Traffic & Deploy", status: "next", color: "#a78bfa" },
        { num: "S", name: "Storage", status: "next", color: "#f59e0b" },
        { num: 3, name: "Security", status: "future", color: "#22c55e" },
        { num: 4, name: "Helm", status: "future", color: "#a78bfa" },
        { num: 5, name: "Observability", status: "future", color: "#fb923c" },
        { num: 6, name: "Operators", status: "future", color: "#a78bfa" },
        { num: 7, name: "Commands", status: "future", color: "#67e8f9" },
        { num: 8, name: "kagent", status: "future", color: "#818cf8" },
    ];

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #422006 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(251, 146, 60, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fb923c", marginBottom: 16 }}>
                🗺️ Recommended Learning Path
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {modules.map((m, i) => (
                    <div key={i} style={{
                        padding: "8px 14px",
                        borderRadius: 8,
                        background: m.status === "current" ? `${m.color}30` : "rgba(0,0,0,0.2)",
                        border: `1px solid ${m.status === "current" ? m.color : "#334155"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}>
                        <span style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: m.status === "current" ? m.color : "#334155",
                            color: m.status === "current" ? "#000" : "#64748b",
                            fontSize: 10,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            {m.num}
                        </span>
                        <span style={{
                            fontSize: 12,
                            color: m.status === "current" ? m.color : m.status === "next" ? "#94a3b8" : "#64748b"
                        }}>
                            {m.name}
                        </span>
                        {m.status === "current" && (
                            <span style={{ fontSize: 10, color: m.color }}>← You are here</span>
                        )}
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: 16,
                padding: 12,
                background: "rgba(0,0,0,0.2)",
                borderRadius: 8,
                fontSize: 12,
                color: "#fcd34d"
            }}>
                <strong>Recommended order:</strong> Complete modules 0 → 1 → 2 → Storage first.
                These give you the foundation to understand everything else.
            </div>
        </div>
    );
}

export default function KubernetesBigPictureApp() {
    const [activeTab, setActiveTab] = useState("why");

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
                background: "radial-gradient(ellipse at top, rgba(251,146,60,0.08) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        background: "rgba(251,146,60,0.1)",
                        border: "1px solid rgba(251,146,60,0.3)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#fb923c",
                        marginBottom: 16
                    }}>
                        <span>🎯</span>
                        <span>START HERE — Module 0</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #fb923c 0%, #a78bfa 50%, #22d3ee 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Kubernetes: The Big Picture
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Why K8s exists • Prerequisites • Architecture • Your learning path
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "why", label: "🤔 Why K8s?" },
                        { id: "prereqs", label: "✅ Prerequisites" },
                        { id: "architecture", label: "🏗️ Architecture" },
                        { id: "quickstart", label: "⚡ Quick Start" },
                        { id: "glossary", label: "📖 Glossary" },
                        { id: "path", label: "🗺️ Learning Path" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 16px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? "1px solid #fb923c60" : "1px solid #1e293b",
                                background: activeTab === tab.id ? "rgba(251,146,60,0.1)" : "transparent",
                                color: activeTab === tab.id ? "#fb923c" : "#64748b",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 13
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "why" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <WhyKubernetesCard />

                        {/* Problem Diagram with Explanation */}
                        <div>
                            <MermaidDiagram chart={diagrams.theProblem} title="The Problem: Manual Operations" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(248, 113, 113, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(248, 113, 113, 0.3)",
                                borderLeft: "4px solid #f87171"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#f87171", marginBottom: 8 }}>
                                    📖 What This Diagram Shows
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#fca5a5", lineHeight: 1.7 }}>
                                    <li><strong>Manual Management:</strong> Operations team must SSH into each server individually</li>
                                    <li><strong>No Self-Healing:</strong> When Server 3 crashes, someone must manually restart it</li>
                                    <li><strong>Scale Challenges:</strong> Adding capacity means manually provisioning new servers</li>
                                    <li><strong>Human Bottleneck:</strong> Every change requires human intervention — not scalable</li>
                                </ul>
                            </div>
                        </div>

                        {/* Solution Diagram with Explanation */}
                        <div>
                            <MermaidDiagram chart={diagrams.theSolution} title="The Solution: Kubernetes" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(34, 197, 94, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(34, 197, 94, 0.3)",
                                borderLeft: "4px solid #22c55e"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#22c55e", marginBottom: 8 }}>
                                    📖 What This Diagram Shows
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#86efac", lineHeight: 1.7 }}>
                                    <li><strong>Declarative:</strong> You write YAML saying "I want 3 copies" — Kubernetes makes it happen</li>
                                    <li><strong>Control Plane:</strong> The "brain" that watches, schedules, and self-heals automatically</li>
                                    <li><strong>Worker Nodes:</strong> Machines that actually run your apps (managed by K8s)</li>
                                    <li><strong>Auto-healing:</strong> If an app crashes, K8s restarts it automatically in seconds</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "prereqs" && (
                    <div>
                        <div style={{ marginBottom: 20, padding: 16, background: "rgba(245,158,11,0.1)", borderRadius: 12, border: "1px solid rgba(245,158,11,0.3)" }}>
                            <div style={{ fontSize: 14, color: "#fbbf24", fontWeight: 600 }}>
                                👆 Click each prerequisite to check it off as you go
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {prerequisites.map((item, i) => (
                                <PrerequisiteCard key={i} item={item} />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "architecture" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <MermaidDiagram chart={diagrams.bigPicture} title="Kubernetes Architecture Overview" />

                        {/* Architecture Explanation */}
                        <div style={{
                            padding: 20,
                            background: "rgba(139,92,246,0.1)",
                            borderRadius: 12,
                            border: "1px solid rgba(139,92,246,0.3)",
                            borderLeft: "4px solid #a78bfa"
                        }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 12 }}>
                                📖 Understanding the Architecture
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#818cf8", marginBottom: 6 }}>
                                        🧠 Control Plane Components
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#c4b5fd", lineHeight: 1.6 }}>
                                        <li><strong>API Server:</strong> Front door to K8s — all requests go here</li>
                                        <li><strong>Scheduler:</strong> Decides which node runs which pod</li>
                                        <li><strong>Controller:</strong> Watches state and makes corrections</li>
                                        <li><strong>etcd:</strong> Stores all cluster data (the database)</li>
                                    </ul>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#22d3ee", marginBottom: 6 }}>
                                        🏢 Worker Node Components
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "#67e8f9", lineHeight: 1.6 }}>
                                        <li><strong>Kubelet:</strong> Agent on each node talking to control plane</li>
                                        <li><strong>Pods:</strong> Your containers actually running here</li>
                                        <li><strong>Kube-proxy:</strong> Handles networking on each node</li>
                                        <li><strong>Container Runtime:</strong> Docker/containerd runs pods</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Quick Summary */}
                        <div style={{
                            padding: 20,
                            background: "rgba(251, 146, 60, 0.1)",
                            borderRadius: 12,
                            border: "1px solid rgba(251, 146, 60, 0.3)"
                        }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#fb923c", marginBottom: 12 }}>
                                🎯 The 30-Second Summary
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 20, color: "#fcd34d", lineHeight: 1.8, fontSize: 13 }}>
                                <li><strong>Cluster</strong> = Your entire K8s environment (control plane + nodes)</li>
                                <li><strong>Control Plane</strong> = The "brain" that makes decisions and stores state</li>
                                <li><strong>Nodes</strong> = Machines (VMs/physical) that run your containers</li>
                                <li><strong>Pods</strong> = One or more containers running together on a node</li>
                                <li><strong>Services</strong> = Stable network addresses that route to your Pods</li>
                                <li><strong>Ingress</strong> = Entry point for external HTTP/HTTPS traffic</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === "quickstart" && <QuickStartGuide />}
                {activeTab === "glossary" && <Glossary />}
                {activeTab === "path" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <LearningPathCard />
                        <MermaidDiagram chart={diagrams.learningPath} title="Module Progression" />
                    </div>
                )}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(251,146,60,0.05)",
                    border: "1px solid rgba(251,146,60,0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#fb923c", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Module 0 Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now understand: Why Kubernetes exists, Prerequisites, Architecture overview
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 1 — Core Concepts (Cluster, Node, Pod, Container deep-dive)
                    </div>
                </div>
            </div>
        </div>
    );
}
