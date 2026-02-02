import { MermaidDiagram } from "./MermaidDiagram";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES CORE CONCEPTS - Interactive Learning Guide (Task 1 of 8)
// Covers: Cluster, Control Plane, Node, Pod, Container
// ═══════════════════════════════════════════════════════════════════════════

// Mermaid diagram definitions
const diagrams = {
    bigPicture: `
graph TB
    subgraph CLUSTER["🌍 CLUSTER (The City)"]
        subgraph CP["🏛️ CONTROL PLANE (City Hall)"]
            API[API Server<br/>Front Desk]
            SCHED[Scheduler<br/>Task Assigner]
            CM[Controller Manager<br/>Supervisors]
            ETCD[(etcd<br/>City Records)]
        end
        
        subgraph NODES["🏢 WORKER NODES (Buildings)"]
            subgraph N1["Node 1"]
                P1[🏠 Pod A]
                P2[🏠 Pod B]
            end
            subgraph N2["Node 2"]
                P3[🏠 Pod C]
                P4[🏠 Pod D]
            end
            subgraph N3["Node 3"]
                P5[🏠 Pod E]
                P6[🏠 Pod F]
            end
        end
    end
    
    API --> SCHED
    SCHED --> N1
    SCHED --> N2
    SCHED --> N3
    CM --> API
    API --> ETCD
    
    style CLUSTER fill:#0f172a,stroke:#06b6d4,stroke-width:3px
    style CP fill:#164e63,stroke:#22d3ee,stroke-width:2px
    style NODES fill:#1e293b,stroke:#8b5cf6,stroke-width:2px
    style N1 fill:#1e1b4b,stroke:#a78bfa
    style N2 fill:#1e1b4b,stroke:#a78bfa
    style N3 fill:#1e1b4b,stroke:#a78bfa
`,

    cluster: `
graph TB
    subgraph CLUSTER["🌍 CLUSTER"]
        direction TB
        CP["🏛️ Control Plane<br/>(The Brain)"]
        N1["🏢 Node 1"]
        N2["🏢 Node 2"]
        N3["🏢 Node 3"]
        
        CP -->|manages| N1
        CP -->|manages| N2
        CP -->|manages| N3
    end
    
    YOU["👤 You (kubectl)"] -->|commands| CP
    
    style CLUSTER fill:#0f172a,stroke:#06b6d4,stroke-width:3px
    style CP fill:#164e63,stroke:#22d3ee,stroke-width:2px
    style N1 fill:#312e81,stroke:#818cf8
    style N2 fill:#312e81,stroke:#818cf8
    style N3 fill:#312e81,stroke:#818cf8
    style YOU fill:#065f46,stroke:#34d399
`,

    controlPlane: `
graph LR
    subgraph CP["🏛️ CONTROL PLANE"]
        direction TB
        
        API["📞 API Server<br/>━━━━━━━━━━<br/>Front desk<br/>Receives all requests"]
        
        SCHED["📋 Scheduler<br/>━━━━━━━━━━<br/>Task assigner<br/>Decides WHERE pods run"]
        
        CM["👔 Controller Manager<br/>━━━━━━━━━━<br/>Supervisors<br/>Keeps things as desired"]
        
        ETCD["💾 etcd<br/>━━━━━━━━━━<br/>Database<br/>Stores all cluster state"]
        
        API --> SCHED
        API --> CM
        API --> ETCD
        SCHED --> API
        CM --> API
    end
    
    kubectl["⌨️ kubectl"] -->|"kubectl apply"| API
    
    style CP fill:#164e63,stroke:#22d3ee,stroke-width:3px
    style API fill:#0e7490,stroke:#67e8f9
    style SCHED fill:#0e7490,stroke:#67e8f9
    style CM fill:#0e7490,stroke:#67e8f9
    style ETCD fill:#0e7490,stroke:#67e8f9
`,

    node: `
graph TB
    subgraph NODE["🏢 NODE (Worker Machine)"]
        direction TB
        
        KUBELET["🔧 kubelet<br/>━━━━━━━━<br/>Building Super<br/>Reports to Control Plane"]
        
        PROXY["🔀 kube-proxy<br/>━━━━━━━━<br/>Network Manager<br/>Routes traffic"]
        
        RUNTIME["📦 Container Runtime<br/>━━━━━━━━<br/>Docker/containerd<br/>Runs containers"]
        
        subgraph PODS["Pods on this Node"]
            P1["🏠 Pod 1<br/>my-app"]
            P2["🏠 Pod 2<br/>api-server"]
            P3["🏠 Pod 3<br/>database"]
        end
        
        KUBELET --> PODS
        RUNTIME --> PODS
        PROXY --> PODS
    end
    
    CP["🏛️ Control Plane"] <-->|status/commands| KUBELET
    
    style NODE fill:#1e1b4b,stroke:#a78bfa,stroke-width:3px
    style PODS fill:#312e81,stroke:#818cf8
    style KUBELET fill:#4c1d95,stroke:#c4b5fd
    style PROXY fill:#4c1d95,stroke:#c4b5fd
    style RUNTIME fill:#4c1d95,stroke:#c4b5fd
`,

    pod: `
graph TB
    subgraph POD["🏠 POD (IP: 10.1.2.34)"]
        direction TB
        
        subgraph SHARED["Shared Resources"]
            NET["🌐 Network<br/>Same IP address"]
            VOL["💾 Storage<br/>Shared volumes"]
        end
        
        subgraph CONTAINERS["Containers"]
            C1["📦 Main Container<br/>━━━━━━━━━━<br/>my-app:v2<br/>Port 8080"]
            C2["📦 Sidecar<br/>━━━━━━━━━━<br/>log-shipper<br/>Collects logs"]
        end
        
        C1 <--> NET
        C2 <--> NET
        C1 <--> VOL
        C2 <--> VOL
    end
    
    style POD fill:#065f46,stroke:#34d399,stroke-width:3px
    style SHARED fill:#064e3b,stroke:#6ee7b7
    style CONTAINERS fill:#064e3b,stroke:#6ee7b7
    style C1 fill:#047857,stroke:#a7f3d0
    style C2 fill:#047857,stroke:#a7f3d0
`,

    container: `
graph TB
    subgraph BUILD["Build Process"]
        DF["📄 Dockerfile<br/>━━━━━━━━<br/>Recipe"]
        IMG["📀 Image<br/>━━━━━━━━<br/>Frozen snapshot"]
        CONT["📦 Container<br/>━━━━━━━━<br/>Running instance"]
        
        DF -->|"docker build"| IMG
        IMG -->|"docker run"| CONT
    end
    
    subgraph INSIDE["Inside Container"]
        CODE["💻 Your Code"]
        RUNTIME["⚙️ Runtime<br/>Node.js/Python/Java"]
        LIBS["📚 Libraries<br/>All dependencies"]
        ENV["🔧 Environment<br/>Variables & config"]
    end
    
    CONT --- INSIDE
    
    style BUILD fill:#7c2d12,stroke:#fb923c,stroke-width:2px
    style INSIDE fill:#431407,stroke:#fdba74
    style DF fill:#9a3412,stroke:#fed7aa
    style IMG fill:#9a3412,stroke:#fed7aa
    style CONT fill:#ea580c,stroke:#fff7ed,stroke-width:2px
`,

    hierarchy: `
graph TB
    CLUSTER["🌍 CLUSTER<br/>━━━━━━━━━━━━<br/>The whole city"]
    
    CP["🏛️ Control Plane<br/>━━━━━━━━━━━━<br/>City Hall"]
    
    N1["🏢 Node 1"]
    N2["🏢 Node 2"]
    
    P1["🏠 Pod A"]
    P2["🏠 Pod B"]
    P3["🏠 Pod C"]
    
    C1["📦 Container"]
    C2["📦 Container"]
    C3["📦 Container"]
    
    CLUSTER --> CP
    CLUSTER --> N1
    CLUSTER --> N2
    
    N1 --> P1
    N1 --> P2
    N2 --> P3
    
    P1 --> C1
    P2 --> C2
    P3 --> C3
    
    style CLUSTER fill:#06b6d4,stroke:#fff,stroke-width:3px,color:#fff
    style CP fill:#0891b2,stroke:#fff,stroke-width:2px,color:#fff
    style N1 fill:#8b5cf6,stroke:#fff,stroke-width:2px,color:#fff
    style N2 fill:#8b5cf6,stroke:#fff,stroke-width:2px,color:#fff
    style P1 fill:#10b981,stroke:#fff,color:#fff
    style P2 fill:#10b981,stroke:#fff,color:#fff
    style P3 fill:#10b981,stroke:#fff,color:#fff
    style C1 fill:#f59e0b,stroke:#fff,color:#fff
    style C2 fill:#f59e0b,stroke:#fff,color:#fff
    style C3 fill:#f59e0b,stroke:#fff,color:#fff
`
};

// Concept data
const concepts = [
    {
        id: "cluster",
        icon: "🌍",
        name: "Cluster",
        tagline: "The Whole City",
        color: "#06b6d4",
        diagram: "cluster",
        what: "A cluster is your entire Kubernetes environment — all machines working together as one unified system. It's the boundary that contains everything: the brain (Control Plane) and the workers (Nodes).",
        why: "Without a cluster, you'd manage each server individually. A cluster gives you ONE place to deploy apps, and Kubernetes figures out the rest — which machine to use, how to recover from failures, how to scale.",
        analogy: "Think of it as an entire CITY. The cluster boundary is the city limits. Everything inside — government buildings, apartment complexes, roads — is part of the cluster. You don't manage individual buildings; you manage the city.",
        components: [
            { name: "Control Plane", desc: "The government/city hall — makes decisions" },
            { name: "Worker Nodes", desc: "The apartment buildings — where apps live" },
            { name: "Networking", desc: "The roads — how apps talk to each other" },
        ],
        commands: [
            { cmd: "kubectl cluster-info", desc: "See cluster details" },
            { cmd: "kubectl get nodes", desc: "List all machines in cluster" },
        ]
    },
    {
        id: "control-plane",
        icon: "🏛️",
        name: "Control Plane",
        tagline: "City Hall",
        color: "#0891b2",
        diagram: "controlPlane",
        what: "The Control Plane is the brain of Kubernetes. It's a set of components that make ALL the decisions: where to run pods, what's healthy, what needs fixing. It watches everything and keeps the cluster in the desired state.",
        why: "Someone has to be in charge. When you say 'run 3 copies of my app', the Control Plane decides WHICH nodes to use, monitors their health, and automatically restarts them if they crash.",
        analogy: "City Hall. It's where all decisions are made — zoning (scheduling), emergency response (auto-healing), resource allocation (node selection). Citizens (pods) don't talk to each other about city planning; City Hall handles it.",
        components: [
            { name: "API Server", desc: "Front desk — receives all kubectl commands" },
            { name: "Scheduler", desc: "Task assigner — decides which node runs each pod" },
            { name: "Controller Manager", desc: "Supervisors — keeps replica counts, handles failures" },
            { name: "etcd", desc: "City records — stores all cluster state as a database" },
        ],
        commands: [
            { cmd: "kubectl get componentstatuses", desc: "Check control plane health" },
            { cmd: "kubectl api-resources", desc: "List all resource types API server knows" },
        ]
    },
    {
        id: "node",
        icon: "🏢",
        name: "Node",
        tagline: "Apartment Building",
        color: "#8b5cf6",
        diagram: "node",
        what: "A Node is a single machine (physical server or virtual machine) where your applications actually run. Each cluster has multiple nodes. If one node fails, your apps on other nodes keep running.",
        why: "One machine isn't enough. By spreading apps across multiple nodes: (1) if one crashes, others survive, (2) you can handle more traffic by adding nodes, (3) different apps can run on different machines.",
        analogy: "An apartment building. Each building (node) has a superintendent (kubelet) who reports to City Hall. The building contains apartments (pods). The city has many buildings, so if one has a fire, residents in other buildings are safe.",
        components: [
            { name: "kubelet", desc: "Building superintendent — talks to Control Plane, manages pods" },
            { name: "kube-proxy", desc: "Network manager — routes traffic to the right pods" },
            { name: "Container Runtime", desc: "Docker/containerd — actually runs containers" },
        ],
        commands: [
            { cmd: "kubectl get nodes", desc: "List all nodes" },
            { cmd: "kubectl describe node <name>", desc: "See node details, capacity, pods" },
            { cmd: "kubectl top nodes", desc: "See CPU/memory usage per node" },
        ]
    },
    {
        id: "pod",
        icon: "🏠",
        name: "Pod",
        tagline: "Apartment Unit",
        color: "#10b981",
        diagram: "pod",
        what: "A Pod is the smallest deployable unit in Kubernetes. It's a wrapper around one or more containers that share the same network (IP address) and storage. Kubernetes doesn't manage containers directly — it manages pods.",
        why: "Some apps need helpers right next to them. A web server might need a log collector running alongside it, sharing the same files. A pod keeps these containers together, guaranteeing they're on the same machine and can talk via localhost.",
        analogy: "An apartment unit with a unique address (IP). Roommates (containers) inside share the kitchen (storage) and mailbox (network). They can talk to each other easily, but the outside world sees one address.",
        components: [
            { name: "Containers", desc: "The actual applications running inside" },
            { name: "Shared Network", desc: "All containers share one IP, talk via localhost" },
            { name: "Shared Storage", desc: "Volumes mounted into multiple containers" },
            { name: "Lifecycle", desc: "All containers start/stop together" },
        ],
        commands: [
            { cmd: "kubectl get pods", desc: "List all pods" },
            { cmd: "kubectl describe pod <name>", desc: "Full pod details + events" },
            { cmd: "kubectl logs <pod>", desc: "View container logs" },
            { cmd: "kubectl exec -it <pod> -- /bin/sh", desc: "Shell into pod" },
        ]
    },
    {
        id: "container",
        icon: "📦",
        name: "Container",
        tagline: "Person in the Apartment",
        color: "#f59e0b",
        diagram: "container",
        what: "A container is a packaged application with EVERYTHING it needs to run: code, runtime, libraries, and settings. It's completely isolated from other containers and from the host machine. Containers are built from images.",
        why: "Containers solve 'it works on my machine.' Whether you're on a Mac, Linux server, or cloud VM, the container runs identically. No more missing dependencies or version conflicts.",
        analogy: "A person with all their belongings in a portable unit. They bring their own furniture (libraries), clothes (code), and preferences (config). They can live in any apartment (pod) and function exactly the same way.",
        components: [
            { name: "Image", desc: "Frozen snapshot — the template containers are created from" },
            { name: "Dockerfile", desc: "Recipe — instructions to build the image" },
            { name: "Runtime", desc: "The language environment (Node, Python, Java, etc.)" },
            { name: "Process", desc: "Your actual application code running" },
        ],
        commands: [
            { cmd: "docker build -t myapp:v1 .", desc: "Build image from Dockerfile" },
            { cmd: "docker push myapp:v1", desc: "Push image to registry" },
            { cmd: "kubectl logs <pod> -c <container>", desc: "Logs from specific container" },
        ]
    }
];

// Animation steps for the "How It All Works" flow
const flowSteps = [
    {
        step: 1,
        title: "You run a command",
        desc: "kubectl apply -f deployment.yaml",
        icon: "⌨️",
        color: "#06b6d4",
        detail: "You tell Kubernetes: 'Run 3 copies of my-app image'"
    },
    {
        step: 2,
        title: "API Server receives it",
        desc: "Request arrives at Control Plane",
        icon: "📞",
        color: "#0891b2",
        detail: "API Server validates the request and stores it in etcd"
    },
    {
        step: 3,
        title: "Scheduler picks nodes",
        desc: "Decides WHERE to run each pod",
        icon: "📋",
        color: "#8b5cf6",
        detail: "Scheduler checks: Which nodes have enough CPU/memory? Assigns pods to nodes."
    },
    {
        step: 4,
        title: "kubelet creates pods",
        desc: "Nodes receive instructions",
        icon: "🔧",
        color: "#a78bfa",
        detail: "kubelet on each node pulls the image and starts containers"
    },
    {
        step: 5,
        title: "Containers start running",
        desc: "Your app is live!",
        icon: "✅",
        color: "#10b981",
        detail: "3 pods are now running across 2 nodes. Traffic can be routed to them."
    },
    {
        step: 6,
        title: "Controller watches forever",
        desc: "Auto-healing kicks in",
        icon: "👀",
        color: "#f59e0b",
        detail: "If a pod dies, Controller Manager notices and tells Scheduler to create a new one"
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// MermaidDiagram is now imported from shared component

function ConceptCard({ concept, isExpanded, onToggle }) {
    return (
        <div
            onClick={onToggle}
            style={{
                background: isExpanded
                    ? `linear-gradient(135deg, ${concept.color}15 0%, ${concept.color}08 100%)`
                    : "rgba(15, 23, 42, 0.6)",
                border: `1px solid ${isExpanded ? concept.color + "50" : "#1e293b"}`,
                borderRadius: 16,
                padding: isExpanded ? 0 : 20,
                cursor: "pointer",
                transition: "all 0.3s ease",
                overflow: "hidden"
            }}
        >
            {/* Header - always visible */}
            <div style={{
                padding: isExpanded ? 20 : 0,
                display: "flex",
                alignItems: "center",
                gap: 16,
                borderBottom: isExpanded ? `1px solid ${concept.color}30` : "none"
            }}>
                <div style={{
                    fontSize: 40,
                    width: 64,
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${concept.color}20`,
                    borderRadius: 12
                }}>
                    {concept.icon}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: concept.color,
                        marginBottom: 4
                    }}>
                        {concept.name}
                    </div>
                    <div style={{ fontSize: 14, color: "#94a3b8" }}>
                        {concept.tagline}
                    </div>
                </div>
                <div style={{
                    fontSize: 24,
                    color: concept.color,
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease"
                }}>
                    ▼
                </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
                <div style={{ padding: 24 }}>
                    {/* Diagram */}
                    <MermaidDiagram chart={diagrams[concept.diagram]} title="Architecture Diagram" />

                    {/* What / Why / Analogy */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 16,
                        marginTop: 24
                    }}>
                        {[
                            { label: "📌 What is it?", text: concept.what, bg: "rgba(6,182,212,0.1)" },
                            { label: "💡 Why does it exist?", text: concept.why, bg: "rgba(139,92,246,0.1)" },
                            { label: "🏙️ City Analogy", text: concept.analogy, bg: "rgba(16,185,129,0.1)" },
                        ].map((section, i) => (
                            <div key={i} style={{
                                background: section.bg,
                                borderRadius: 12,
                                padding: 20
                            }}>
                                <div style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: concept.color,
                                    marginBottom: 8,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em"
                                }}>
                                    {section.label}
                                </div>
                                <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7 }}>
                                    {section.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Components */}
                    <div style={{ marginTop: 24 }}>
                        <div style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: concept.color,
                            marginBottom: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                        }}>
                            🔧 Key Components
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {concept.components.map((comp, i) => (
                                <div key={i} style={{
                                    background: "rgba(0,0,0,0.3)",
                                    borderRadius: 8,
                                    padding: "10px 14px",
                                    border: `1px solid ${concept.color}30`
                                }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
                                        {comp.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                                        {comp.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Commands */}
                    <div style={{ marginTop: 24 }}>
                        <div style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: concept.color,
                            marginBottom: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                        }}>
                            ⌨️ Essential Commands
                        </div>
                        <div style={{
                            background: "rgba(0,0,0,0.4)",
                            borderRadius: 12,
                            overflow: "hidden",
                            fontFamily: "'Fira Code', 'SF Mono', monospace"
                        }}>
                            {concept.commands.map((cmd, i) => (
                                <div key={i} style={{
                                    padding: "12px 16px",
                                    borderBottom: i < concept.commands.length - 1 ? "1px solid #1e293b" : "none",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 16
                                }}>
                                    <code style={{ color: "#67e8f9", fontSize: 13 }}>{cmd.cmd}</code>
                                    <span style={{ color: "#64748b", fontSize: 11 }}>{cmd.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FlowAnimation() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % flowSteps.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [isPlaying]);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24
            }}>
                <div style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#e2e8f0"
                }}>
                    🎬 How It All Works Together
                </div>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                        padding: "8px 20px",
                        borderRadius: 20,
                        border: "none",
                        background: isPlaying ? "#ef4444" : "#10b981",
                        color: "white",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 13
                    }}
                >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
            </div>

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {flowSteps.map((step, i) => {
                    const isActive = i === currentStep;
                    const isPast = i < currentStep;
                    return (
                        <div
                            key={step.step}
                            onClick={() => setCurrentStep(i)}
                            style={{
                                display: "flex",
                                gap: 16,
                                cursor: "pointer",
                                opacity: isActive ? 1 : 0.5,
                                transition: "all 0.3s ease"
                            }}
                        >
                            {/* Timeline */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "50%",
                                    background: isActive ? step.color : isPast ? step.color + "50" : "#1e293b",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 20,
                                    border: isActive ? `3px solid ${step.color}` : "none",
                                    boxShadow: isActive ? `0 0 20px ${step.color}50` : "none",
                                    transition: "all 0.3s ease"
                                }}>
                                    {step.icon}
                                </div>
                                {i < flowSteps.length - 1 && (
                                    <div style={{
                                        width: 2,
                                        height: 40,
                                        background: isPast ? `linear-gradient(${step.color}, ${flowSteps[i + 1].color})` : "#1e293b"
                                    }} />
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, paddingBottom: 20 }}>
                                <div style={{
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: isActive ? step.color : "#64748b",
                                    marginBottom: 4
                                }}>
                                    Step {step.step}: {step.title}
                                </div>
                                <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
                                    {step.desc}
                                </div>
                                {isActive && (
                                    <div style={{
                                        fontSize: 13,
                                        color: "#cbd5e1",
                                        background: "rgba(0,0,0,0.3)",
                                        padding: "10px 14px",
                                        borderRadius: 8,
                                        marginTop: 8,
                                        borderLeft: `3px solid ${step.color}`
                                    }}>
                                        {step.detail}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// BEGINNER INTRODUCTION - Plain English explanations for complete beginners
// ═══════════════════════════════════════════════════════════════════════════

function BeginnerIntro() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* What is this module about */}
            <div style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(34, 197, 94, 0.3)"
            }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e", marginBottom: 16 }}>
                    👋 Welcome! Let's Learn Kubernetes Core Concepts
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8 }}>
                    <strong>Don't worry if you know nothing about Kubernetes.</strong> This module will teach you
                    everything from scratch using simple everyday examples. By the end, you'll understand
                    how Kubernetes organizes and runs your applications.
                </div>
            </div>

            {/* What problem does Kubernetes solve */}
            <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f87171", marginBottom: 16 }}>
                    🤔 First, What Problem Does Kubernetes Solve?
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, marginBottom: 16 }}>
                    Imagine you built a website. At first, you run it on your laptop. But then:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        { problem: "More users come", pain: "Your laptop can't handle the traffic" },
                        { problem: "Your app crashes", pain: "Users see an error until you manually restart it" },
                        { problem: "You want to update", pain: "You have to stop the old version, users get downtime" },
                        { problem: "Multiple apps", pain: "Managing 10+ servers manually becomes a nightmare" },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 12,
                            padding: 12,
                            background: "rgba(248, 113, 113, 0.1)",
                            borderRadius: 8,
                            borderLeft: "3px solid #f87171"
                        }}>
                            <span style={{ fontSize: 20 }}>❌</span>
                            <div>
                                <div style={{ color: "#fca5a5", fontWeight: 600, fontSize: 13 }}>{item.problem}</div>
                                <div style={{ color: "#94a3b8", fontSize: 12 }}>{item.pain}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{
                    marginTop: 20,
                    padding: 16,
                    background: "rgba(34, 197, 94, 0.1)",
                    borderRadius: 12,
                    borderLeft: "4px solid #22c55e"
                }}>
                    <div style={{ color: "#22c55e", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                        ✅ Kubernetes solves ALL of these problems automatically!
                    </div>
                    <div style={{ color: "#86efac", fontSize: 13, lineHeight: 1.6 }}>
                        It spreads your app across multiple machines, restarts crashed apps automatically,
                        updates without downtime, and manages hundreds of services for you.
                    </div>
                </div>
            </div>

            {/* The City Analogy */}
            <div style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(14, 116, 144, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(139, 92, 246, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 16 }}>
                    🏙️ The City Analogy — Understanding Kubernetes
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8, marginBottom: 20 }}>
                    Think of Kubernetes like managing a <strong>city</strong>. This analogy will help you understand every concept:
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                        {
                            k8s: "Cluster",
                            city: "The Entire City",
                            icon: "🌍",
                            color: "#06b6d4",
                            explain: "Your whole Kubernetes environment. Everything lives inside the cluster, just like everything in a city is within city limits."
                        },
                        {
                            k8s: "Control Plane",
                            city: "City Hall",
                            icon: "🏛️",
                            color: "#0891b2",
                            explain: "The 'brain' that makes all decisions. It decides where to put new buildings (pods), handles emergencies, and keeps records of everything."
                        },
                        {
                            k8s: "Node",
                            city: "Apartment Building",
                            icon: "🏢",
                            color: "#8b5cf6",
                            explain: "A single machine (computer/server) where your apps actually run. A city has many buildings, a cluster has many nodes."
                        },
                        {
                            k8s: "Pod",
                            city: "Apartment Unit",
                            icon: "🏠",
                            color: "#10b981",
                            explain: "The smallest unit you can deploy. Each apartment (pod) has a unique address (IP). It can have one or more rooms (containers)."
                        },
                        {
                            k8s: "Container",
                            city: "Person with their stuff",
                            icon: "📦",
                            color: "#f59e0b",
                            explain: "Your actual application running inside a pod. A person brings all their belongings (code, libraries, settings) and can live in any apartment."
                        },
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: 16,
                            background: `${item.color}10`,
                            borderRadius: 12,
                            borderLeft: `4px solid ${item.color}`
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                <span style={{ fontSize: 28 }}>{item.icon}</span>
                                <div>
                                    <span style={{ color: item.color, fontWeight: 700, fontSize: 15 }}>{item.k8s}</span>
                                    <span style={{ color: "#64748b", fontSize: 13 }}> = </span>
                                    <span style={{ color: "#e2e8f0", fontSize: 14 }}>{item.city}</span>
                                </div>
                            </div>
                            <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, paddingLeft: 40 }}>
                                {item.explain}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Key takeaways */}
            <div style={{
                background: "rgba(251, 146, 60, 0.1)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(251, 146, 60, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fb923c", marginBottom: 16 }}>
                    🎯 Key Takeaways for Beginners
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        "Cluster = Your entire Kubernetes environment (the city)",
                        "Control Plane = The brain that makes decisions (city hall)",
                        "Node = A machine that runs your apps (a building)",
                        "Pod = The smallest thing you deploy, has an IP address (an apartment)",
                        "Container = Your actual app running inside a pod (a person in the apartment)",
                        "Kubernetes watches everything and fixes problems automatically!",
                    ].map((point, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 10,
                            fontSize: 13,
                            color: "#fcd34d"
                        }}>
                            <span>✓</span>
                            <span>{point}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ready prompt */}
            <div style={{
                textAlign: "center",
                padding: 20,
                background: "rgba(139, 92, 246, 0.1)",
                borderRadius: 12,
                border: "1px solid rgba(139, 92, 246, 0.3)"
            }}>
                <div style={{ fontSize: 16, color: "#a78bfa", fontWeight: 600 }}>
                    👆 Ready to learn more? Click the tabs above!
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                    "📖 Concepts" explains each piece in detail • "🗺️ Big Picture" shows the full architecture • "🎬 Flow" shows how it all works
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default function KubernetesCoreConceptsApp() {
    const [expandedConcept, setExpandedConcept] = useState(null);
    const [activeTab, setActiveTab] = useState("start"); // start | concepts | bigpicture | flow

    return (
        <div style={{
            minHeight: "100vh",
            background: "#030712",
            color: "#e2e8f0",
            fontFamily: "'Inter', -apple-system, sans-serif"
        }}>
            {/* Gradient overlay */}
            <div style={{
                position: "fixed",
                inset: 0,
                background: "radial-gradient(ellipse at top, rgba(139,92,246,0.1) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        background: "rgba(139,92,246,0.1)",
                        border: "1px solid rgba(139,92,246,0.3)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#a78bfa",
                        marginBottom: 16
                    }}>
                        <span>📚</span>
                        <span>Module 1 • Core Concepts</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Kubernetes Core Concepts
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Cluster → Node → Pod → Container — The building blocks of K8s
                    </p>
                </div>

                {/* Tab Navigation */}
                <div style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 32,
                    justifyContent: "center",
                    flexWrap: "wrap"
                }}>
                    {[
                        { id: "start", label: "🚀 Start Here", desc: "Beginner intro" },
                        { id: "concepts", label: "📖 Concepts", desc: "Learn each piece" },
                        { id: "bigpicture", label: "🗺️ Big Picture", desc: "Full architecture" },
                        { id: "flow", label: "🎬 Flow", desc: "How it works" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "12px 24px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? "1px solid #8b5cf660" : "1px solid #1e293b",
                                background: activeTab === tab.id ? "rgba(139,92,246,0.1)" : "rgba(15,23,42,0.6)",
                                color: activeTab === tab.id ? "#a78bfa" : "#64748b",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 14,
                                transition: "all 0.2s ease"
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === "start" && <BeginnerIntro />}

                {activeTab === "concepts" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {concepts.map(concept => (
                            <ConceptCard
                                key={concept.id}
                                concept={concept}
                                isExpanded={expandedConcept === concept.id}
                                onToggle={() => setExpandedConcept(
                                    expandedConcept === concept.id ? null : concept.id
                                )}
                            />
                        ))}
                    </div>
                )}

                {activeTab === "bigpicture" && (
                    <div>
                        <MermaidDiagram
                            chart={diagrams.bigPicture}
                            title="Complete Kubernetes Architecture"
                        />
                        <div style={{
                            marginTop: 20,
                            padding: 20,
                            background: "rgba(139, 92, 246, 0.1)",
                            borderRadius: 12,
                            border: "1px solid rgba(139, 92, 246, 0.3)",
                            borderLeft: "4px solid #a78bfa"
                        }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 12 }}>
                                📖 What This Diagram Shows
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#c4b5fd", lineHeight: 1.7 }}>
                                <li><strong>CLUSTER:</strong> The blue outer box is your entire Kubernetes environment</li>
                                <li><strong>CONTROL PLANE:</strong> The "City Hall" with API Server (front desk), Scheduler (assigns work), Controller Manager (supervisors), and etcd (database)</li>
                                <li><strong>WORKER NODES:</strong> The buildings where your apps actually run. Each has multiple Pods</li>
                                <li><strong>PODS:</strong> The apartments inside buildings — each runs your application containers</li>
                            </ul>
                        </div>
                        <div style={{ marginTop: 24 }}>
                            <MermaidDiagram
                                chart={diagrams.hierarchy}
                                title="Hierarchy: Cluster → Node → Pod → Container"
                            />
                            <div style={{
                                marginTop: 20,
                                padding: 20,
                                background: "rgba(34, 197, 94, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(34, 197, 94, 0.3)",
                                borderLeft: "4px solid #22c55e"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#22c55e", marginBottom: 12 }}>
                                    📖 Understanding the Hierarchy
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#86efac", lineHeight: 1.7 }}>
                                    <li><strong>Top level:</strong> Cluster contains everything</li>
                                    <li><strong>Level 2:</strong> Control Plane + Nodes live inside the Cluster</li>
                                    <li><strong>Level 3:</strong> Pods live inside Nodes</li>
                                    <li><strong>Level 4:</strong> Containers live inside Pods</li>
                                    <li><strong>Remember:</strong> You deploy Pods, not Containers directly!</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "flow" && <FlowAnimation />}

                {/* Footer */}
                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(6,182,212,0.05)",
                    border: "1px solid rgba(6,182,212,0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#67e8f9", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Module 1 Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now understand: Cluster, Control Plane, Node, Pod, Container
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 2 — Traffic & Scaling (Deployment, Service, Ingress)
                    </div>
                </div>
            </div>
        </div>
    );
}
