import { MermaidDiagram } from "./MermaidDiagram";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES TRAFFIC & SCALING - Interactive Learning Guide (Task 2 of 8)
// Covers: Deployment, ReplicaSet, Service, Ingress
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    trafficFlow: `
flowchart TB
    subgraph INTERNET["🌐 INTERNET"]
        USER["👤 User<br/>browser/app"]
    end
    
    subgraph CLUSTER["☸️ KUBERNETES CLUSTER"]
        subgraph INGRESS["🚪 INGRESS"]
            ING["Ingress Controller<br/>━━━━━━━━━━━━<br/>api.example.com → api-svc<br/>web.example.com → web-svc"]
        end
        
        subgraph SERVICES["📬 SERVICES"]
            SVC1["api-service<br/>ClusterIP: 10.96.0.10"]
            SVC2["web-service<br/>ClusterIP: 10.96.0.11"]
        end
        
        subgraph PODS["🏠 PODS"]
            P1["Pod 1<br/>api:v2"]
            P2["Pod 2<br/>api:v2"]
            P3["Pod 3<br/>api:v2"]
            P4["Pod 4<br/>web:v1"]
            P5["Pod 5<br/>web:v1"]
        end
    end
    
    USER -->|"https://api.example.com"| ING
    ING -->|"route"| SVC1
    ING -->|"route"| SVC2
    SVC1 -->|"load balance"| P1
    SVC1 -->|"load balance"| P2
    SVC1 -->|"load balance"| P3
    SVC2 -->|"load balance"| P4
    SVC2 -->|"load balance"| P5
    
    style INTERNET fill:#0c4a6e,stroke:#38bdf8
    style CLUSTER fill:#0f172a,stroke:#8b5cf6,stroke-width:2px
    style INGRESS fill:#164e63,stroke:#22d3ee
    style SERVICES fill:#312e81,stroke:#818cf8
    style PODS fill:#064e3b,stroke:#34d399
`,

    deployment: `
flowchart TB
    subgraph DEPLOYMENT["📋 DEPLOYMENT: my-app"]
        CONFIG["Config:<br/>━━━━━━━━━━━━<br/>replicas: 3<br/>image: my-app:v2<br/>strategy: RollingUpdate"]
        
        subgraph RS["👯 REPLICASET"]
            COUNTER["Desired: 3<br/>Current: 3<br/>Ready: 3 ✅"]
        end
        
        subgraph PODS["🏠 PODS"]
            P1["Pod 1<br/>my-app:v2"]
            P2["Pod 2<br/>my-app:v2"]
            P3["Pod 3<br/>my-app:v2"]
        end
    end
    
    CONFIG --> RS
    RS --> P1
    RS --> P2
    RS --> P3
    
    style DEPLOYMENT fill:#1e1b4b,stroke:#a78bfa,stroke-width:3px
    style RS fill:#312e81,stroke:#818cf8
    style PODS fill:#064e3b,stroke:#34d399
    style CONFIG fill:#4c1d95,stroke:#c4b5fd
`,

    autoHealing: `
flowchart LR
    subgraph BEFORE["Before: Pod Dies 💀"]
        B_RS["ReplicaSet<br/>━━━━━━━━<br/>Desired: 3<br/>Current: 3"]
        B_P1["🏠 Pod 1"]
        B_P2["💀 Pod 2<br/>(crashed)"]
        B_P3["🏠 Pod 3"]
    end
    
    subgraph DETECT["Detection 👀"]
        CTRL["Controller Manager<br/>notices mismatch!<br/>━━━━━━━━━━━━<br/>Desired: 3<br/>Current: 2 ❌"]
    end
    
    subgraph AFTER["After: Auto-Healed ✅"]
        A_RS["ReplicaSet<br/>━━━━━━━━<br/>Desired: 3<br/>Current: 3"]
        A_P1["🏠 Pod 1"]
        A_P4["🏠 Pod 4<br/>(NEW!)"]
        A_P3["🏠 Pod 3"]
    end
    
    B_RS --> B_P1
    B_RS --> B_P2
    B_RS --> B_P3
    
    BEFORE --> DETECT
    DETECT --> AFTER
    
    A_RS --> A_P1
    A_RS --> A_P4
    A_RS --> A_P3
    
    style BEFORE fill:#450a0a,stroke:#f87171
    style DETECT fill:#422006,stroke:#fbbf24
    style AFTER fill:#052e16,stroke:#4ade80
`,

    rollingUpdate: `
flowchart TB
    subgraph STEP1["Step 1: Start with v1"]
        S1_P1["🏠 Pod<br/>v1"]
        S1_P2["🏠 Pod<br/>v1"]
        S1_P3["🏠 Pod<br/>v1"]
    end
    
    subgraph STEP2["Step 2: Add v2 pod"]
        S2_P1["🏠 Pod<br/>v1"]
        S2_P2["🏠 Pod<br/>v1"]
        S2_P3["🏠 Pod<br/>v1"]
        S2_P4["🆕 Pod<br/>v2"]
    end
    
    subgraph STEP3["Step 3: Remove v1, add v2"]
        S3_P2["🏠 Pod<br/>v1"]
        S3_P3["🏠 Pod<br/>v1"]
        S3_P4["🏠 Pod<br/>v2"]
        S3_P5["🆕 Pod<br/>v2"]
    end
    
    subgraph STEP4["Step 4: All v2 ✅"]
        S4_P4["🏠 Pod<br/>v2"]
        S4_P5["🏠 Pod<br/>v2"]
        S4_P6["🏠 Pod<br/>v2"]
    end
    
    STEP1 --> STEP2
    STEP2 --> STEP3
    STEP3 --> STEP4
    
    style STEP1 fill:#1e1b4b,stroke:#818cf8
    style STEP2 fill:#1e3a5f,stroke:#38bdf8
    style STEP3 fill:#134e4a,stroke:#2dd4bf
    style STEP4 fill:#052e16,stroke:#4ade80
`,

    service: `
flowchart TB
    subgraph PROBLEM["❌ PROBLEM: Pod IPs Change!"]
        OLD["Pod A<br/>IP: 10.1.2.34"]
        CRASH["💥 Crash!"]
        NEW["Pod B<br/>IP: 10.1.2.99<br/>(different IP!)"]
        
        OLD --> CRASH --> NEW
    end
    
    subgraph SOLUTION["✅ SOLUTION: Service = Stable Address"]
        SVC["📬 SERVICE<br/>━━━━━━━━━━━━━━<br/>Name: my-app-svc<br/>ClusterIP: 10.96.0.50<br/>Port: 80<br/>━━━━━━━━━━━━━━<br/>selector: app=my-app"]
        
        P1["🏠 Pod 1<br/>10.1.2.34<br/>app=my-app"]
        P2["🏠 Pod 2<br/>10.1.2.35<br/>app=my-app"]
        P3["🏠 Pod 3<br/>10.1.2.36<br/>app=my-app"]
        
        SVC -->|"load balance"| P1
        SVC -->|"load balance"| P2
        SVC -->|"load balance"| P3
    end
    
    CLIENT["Other Apps<br/>━━━━━━━━<br/>http://my-app-svc:80<br/>(never changes!)"] --> SVC
    
    style PROBLEM fill:#450a0a,stroke:#f87171
    style SOLUTION fill:#052e16,stroke:#4ade80
    style SVC fill:#1e40af,stroke:#60a5fa,stroke-width:3px
`,

    serviceTypes: `
flowchart TB
    subgraph TYPES["📬 SERVICE TYPES"]
        subgraph CLUSTER_IP["ClusterIP (Default)"]
            CI_DESC["Internal only<br/>Other pods can reach it<br/>Not accessible externally"]
        end
        
        subgraph NODE_PORT["NodePort"]
            NP_DESC["Opens a port on EVERY node<br/>External: NodeIP:30000-32767<br/>Use for testing only"]
        end
        
        subgraph LOAD_BAL["LoadBalancer"]
            LB_DESC["Creates cloud load balancer<br/>AWS ELB, GCP LB, etc.<br/>Gets external IP"]
        end
    end
    
    INTERNET["🌐 Internet"] --> LOAD_BAL
    LOAD_BAL --> NODE_PORT
    NODE_PORT --> CLUSTER_IP
    CLUSTER_IP --> PODS["🏠 Pods"]
    
    style CLUSTER_IP fill:#0f766e,stroke:#2dd4bf
    style NODE_PORT fill:#a16207,stroke:#fbbf24
    style LOAD_BAL fill:#7c3aed,stroke:#a78bfa
`,

    ingress: `
flowchart TB
    subgraph INTERNET["🌐 INTERNET"]
        USER["👤 Users"]
    end
    
    subgraph INGRESS["🚪 INGRESS CONTROLLER"]
        RULES["Rules:<br/>━━━━━━━━━━━━━━━━━━━<br/>api.shop.com/users → users-svc<br/>api.shop.com/orders → orders-svc<br/>shop.com/* → frontend-svc<br/>━━━━━━━━━━━━━━━━━━━<br/>Also handles:<br/>• TLS/HTTPS<br/>• Rate limiting<br/>• Authentication"]
    end
    
    subgraph SERVICES["📬 SERVICES"]
        S1["users-svc"]
        S2["orders-svc"]
        S3["frontend-svc"]
    end
    
    subgraph PODS["🏠 PODS"]
        P1["users-api"]
        P2["orders-api"]
        P3["frontend"]
    end
    
    USER -->|"HTTPS"| RULES
    RULES -->|"/users"| S1
    RULES -->|"/orders"| S2
    RULES -->|"/*"| S3
    
    S1 --> P1
    S2 --> P2
    S3 --> P3
    
    style INTERNET fill:#0c4a6e,stroke:#38bdf8
    style INGRESS fill:#164e63,stroke:#22d3ee,stroke-width:3px
    style SERVICES fill:#312e81,stroke:#818cf8
    style PODS fill:#064e3b,stroke:#34d399
`,

    fullPicture: `
flowchart TB
    subgraph DEPLOY["📋 DEPLOYMENT"]
        D_CONFIG["replicas: 3<br/>image: api:v2"]
    end
    
    subgraph RS["👯 REPLICASET"]
        RS_COUNT["maintains 3 pods"]
    end
    
    subgraph PODS["🏠 PODS"]
        P1["Pod 1"]
        P2["Pod 2"]
        P3["Pod 3"]
    end
    
    subgraph SVC["📬 SERVICE"]
        SVC_LB["Load balances<br/>Stable IP"]
    end
    
    subgraph ING["🚪 INGRESS"]
        ING_ROUTE["Routes by URL<br/>TLS termination"]
    end
    
    INTERNET["🌐 Internet"] --> ING
    ING --> SVC
    SVC --> PODS
    RS --> PODS
    DEPLOY --> RS
    
    style DEPLOY fill:#4c1d95,stroke:#a78bfa,stroke-width:2px
    style RS fill:#312e81,stroke:#818cf8
    style PODS fill:#064e3b,stroke:#34d399
    style SVC fill:#1e40af,stroke:#60a5fa
    style ING fill:#164e63,stroke:#22d3ee
`
};

const concepts = [
    {
        id: "deployment",
        icon: "📋",
        name: "Deployment",
        tagline: "Building Management Company",
        color: "#a78bfa",
        diagram: "deployment",
        what: "A Deployment tells Kubernetes HOW to run your app: which image, how many copies (replicas), and how to update it. It's the most common way to deploy applications. It manages ReplicaSets, which manage Pods.",
        why: "You don't want to create pods manually. A Deployment: (1) ensures the right number are always running, (2) handles updates without downtime, (3) lets you rollback if something breaks, (4) self-heals when pods crash.",
        analogy: "A building management company. You tell them: 'I need 3 apartments ready with this floor plan.' They hire the property manager (ReplicaSet) who maintains exactly 3 units. If one burns down, they rebuild it automatically.",
        components: [
            { name: "replicas", desc: "How many pod copies to run" },
            { name: "selector", desc: "Labels to find which pods belong to this deployment" },
            { name: "template", desc: "The pod specification (what each pod looks like)" },
            { name: "strategy", desc: "How to update (RollingUpdate or Recreate)" },
        ],
        yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3                    # Run 3 copies
  selector:
    matchLabels:
      app: my-app                # Find pods with this label
  template:
    metadata:
      labels:
        app: my-app              # Give pods this label
    spec:
      containers:
      - name: my-app
        image: my-app:v2         # The image to run
        ports:
        - containerPort: 8080`,
        commands: [
            { cmd: "kubectl apply -f deployment.yaml", desc: "Create/update deployment" },
            { cmd: "kubectl get deployments", desc: "List all deployments" },
            { cmd: "kubectl scale deployment my-app --replicas=5", desc: "Scale to 5 pods" },
            { cmd: "kubectl rollout status deployment/my-app", desc: "Watch rollout progress" },
            { cmd: "kubectl rollout undo deployment/my-app", desc: "Rollback to previous" },
        ]
    },
    {
        id: "replicaset",
        icon: "👯",
        name: "ReplicaSet",
        tagline: "Property Manager",
        color: "#818cf8",
        diagram: "autoHealing",
        what: "A ReplicaSet ensures a specified number of pod replicas are running at any given time. It's the worker behind Deployments. You rarely create ReplicaSets directly — Deployments create them for you.",
        why: "Pods are mortal — they crash, get killed, or nodes fail. ReplicaSet is the watchdog that constantly counts pods and creates/deletes them to match the desired count. It's the actual self-healing mechanism.",
        analogy: "A property manager who counts apartments every hour. 'The contract says 3 units. I count 2. I must build 1 more immediately.' They don't care WHY one is missing — fire, earthquake, tenant problems — they just restore the count.",
        components: [
            { name: "replicas", desc: "The desired pod count" },
            { name: "selector", desc: "Labels to identify which pods it owns" },
            { name: "template", desc: "What new pods should look like" },
        ],
        yaml: `# You don't write this directly!
# Deployments create ReplicaSets automatically.
# But here's what one looks like:

apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: my-app-7d9f8c6b5          # Auto-generated name
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    # ... pod spec`,
        commands: [
            { cmd: "kubectl get replicasets", desc: "List all ReplicaSets" },
            { cmd: "kubectl get rs", desc: "Short form" },
            { cmd: "kubectl describe rs my-app-7d9f8c6b5", desc: "See ReplicaSet details" },
        ]
    },
    {
        id: "service",
        icon: "📬",
        name: "Service",
        tagline: "PO Box / Receptionist",
        color: "#60a5fa",
        diagram: "service",
        what: "A Service is a stable network endpoint for a set of pods. Pods come and go with different IPs, but the Service IP never changes. It load-balances traffic across all matching pods.",
        why: "Pod IPs are temporary — every restart, every scale, every failure creates new IPs. Other apps can't track this chaos. A Service gives you ONE stable address that automatically routes to healthy pods.",
        analogy: "A PO Box at the post office. Your friends (other apps) send mail to Box 100. The post office (Service) knows which apartment (pod) you're in today and forwards the mail. You can move apartments; your PO Box never changes.",
        components: [
            { name: "ClusterIP", desc: "Internal IP that never changes" },
            { name: "Port", desc: "The port clients connect to" },
            { name: "TargetPort", desc: "The port on the pod containers" },
            { name: "Selector", desc: "Labels to find which pods to route to" },
        ],
        yaml: `apiVersion: v1
kind: Service
metadata:
  name: my-app-svc
spec:
  type: ClusterIP               # Internal only (default)
  selector:
    app: my-app                 # Route to pods with this label
  ports:
  - port: 80                    # Clients connect here
    targetPort: 8080            # Pods listen here
    
# Clients use: http://my-app-svc:80
# Service forwards to: pod-ip:8080`,
        commands: [
            { cmd: "kubectl get services", desc: "List all services" },
            { cmd: "kubectl get svc", desc: "Short form" },
            { cmd: "kubectl describe svc my-app-svc", desc: "See endpoints (pod IPs)" },
            { cmd: "kubectl port-forward svc/my-app-svc 8080:80", desc: "Access locally" },
        ]
    },
    {
        id: "ingress",
        icon: "🚪",
        name: "Ingress",
        tagline: "City Gate / Security Checkpoint",
        color: "#22d3ee",
        diagram: "ingress",
        what: "Ingress is the smart front door of your cluster. It routes external HTTP/HTTPS traffic to the right Services based on the URL (hostname + path). It also handles TLS certificates.",
        why: "Without Ingress, you'd need a LoadBalancer Service for each app (expensive!). Ingress consolidates all external traffic through ONE entry point with smart routing rules. One IP, many services.",
        analogy: "The city gate with a directory. Visitors arrive and say 'I'm looking for the Tax Office.' The guard checks the map: 'Tax Office is on 3rd Street, Building B.' They route you to the right place. One gate, many destinations.",
        components: [
            { name: "Ingress Controller", desc: "The actual software (NGINX, Traefik, etc.)" },
            { name: "Host", desc: "The domain name (api.example.com)" },
            { name: "Path", desc: "URL path (/users, /orders, etc.)" },
            { name: "TLS", desc: "HTTPS certificate configuration" },
        ],
        yaml: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: tls-secret       # TLS certificate
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /users
        pathType: Prefix
        backend:
          service:
            name: users-svc       # Route /users here
            port:
              number: 80
      - path: /orders
        pathType: Prefix
        backend:
          service:
            name: orders-svc      # Route /orders here
            port:
              number: 80`,
        commands: [
            { cmd: "kubectl get ingress", desc: "List all ingresses" },
            { cmd: "kubectl describe ingress my-ingress", desc: "See routing rules" },
            { cmd: "kubectl get ingressclass", desc: "See available controllers" },
        ]
    }
];

const requestFlowSteps = [
    {
        step: 1,
        title: "User makes request",
        desc: "https://api.shop.com/users",
        icon: "👤",
        color: "#38bdf8",
        detail: "Browser/app sends HTTPS request to your domain"
    },
    {
        step: 2,
        title: "DNS resolves to Load Balancer",
        desc: "api.shop.com → 34.120.55.99",
        icon: "🌐",
        color: "#06b6d4",
        detail: "DNS returns the external IP of your Ingress Controller's LoadBalancer"
    },
    {
        step: 3,
        title: "Ingress routes by path",
        desc: "/users → users-service",
        icon: "🚪",
        color: "#22d3ee",
        detail: "Ingress looks at the URL path and finds the matching Service"
    },
    {
        step: 4,
        title: "Service load balances",
        desc: "Picks healthy pod",
        icon: "📬",
        color: "#60a5fa",
        detail: "Service randomly selects one of the healthy pods (round-robin)"
    },
    {
        step: 5,
        title: "Pod handles request",
        desc: "Container processes it",
        icon: "🏠",
        color: "#10b981",
        detail: "Your app code runs, queries database, builds response"
    },
    {
        step: 6,
        title: "Response returns",
        desc: "Same path in reverse",
        icon: "✅",
        color: "#4ade80",
        detail: "Response travels: Pod → Service → Ingress → User (200 OK)"
    }
];

// MermaidDiagram is now imported from shared component

function CodeBlock({ code, language = "yaml" }) {
    return (
        <div style={{
            background: "rgba(0,0,0,0.4)",
            borderRadius: 12,
            overflow: "hidden"
        }}>
            <div style={{
                padding: "8px 16px",
                background: "rgba(0,0,0,0.3)",
                fontSize: 11,
                color: "#64748b",
                borderBottom: "1px solid #1e293b"
            }}>
                {language}
            </div>
            <pre style={{
                padding: 16,
                margin: 0,
                fontSize: 12,
                lineHeight: 1.6,
                color: "#e2e8f0",
                fontFamily: "'Fira Code', 'SF Mono', monospace",
                overflow: "auto"
            }}>
                <code>{code}</code>
            </pre>
        </div>
    );
}

function ConceptCard({ concept, isExpanded, onToggle }) {
    return (
        <div
            onClick={!isExpanded ? onToggle : undefined}
            style={{
                background: isExpanded
                    ? `linear-gradient(135deg, ${concept.color}10 0%, ${concept.color}05 100%)`
                    : "rgba(15, 23, 42, 0.6)",
                border: `1px solid ${isExpanded ? concept.color + "40" : "#1e293b"}`,
                borderRadius: 16,
                overflow: "hidden",
                cursor: isExpanded ? "default" : "pointer",
                transition: "all 0.3s ease"
            }}
        >
            <div
                onClick={isExpanded ? onToggle : undefined}
                style={{
                    padding: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    cursor: "pointer",
                    borderBottom: isExpanded ? `1px solid ${concept.color}20` : "none"
                }}
            >
                <div style={{
                    fontSize: 36,
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${concept.color}20`,
                    borderRadius: 12
                }}>
                    {concept.icon}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: concept.color }}>
                        {concept.name}
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8" }}>
                        {concept.tagline}
                    </div>
                </div>
                <div style={{
                    fontSize: 20,
                    color: concept.color,
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease"
                }}>▼</div>
            </div>

            {isExpanded && (
                <div style={{ padding: 24 }}>
                    <MermaidDiagram chart={diagrams[concept.diagram]} title="Architecture" />

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: 16,
                        marginTop: 24
                    }}>
                        {[
                            { label: "📌 What is it?", text: concept.what },
                            { label: "💡 Why use it?", text: concept.why },
                            { label: "🏙️ Analogy", text: concept.analogy },
                        ].map((section, i) => (
                            <div key={i} style={{
                                background: "rgba(0,0,0,0.2)",
                                borderRadius: 12,
                                padding: 16
                            }}>
                                <div style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: concept.color,
                                    marginBottom: 8,
                                    textTransform: "uppercase"
                                }}>
                                    {section.label}
                                </div>
                                <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>
                                    {section.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 24 }}>
                        <div style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: concept.color,
                            marginBottom: 12,
                            textTransform: "uppercase"
                        }}>
                            📄 Example YAML
                        </div>
                        <CodeBlock code={concept.yaml} />
                    </div>

                    <div style={{ marginTop: 24 }}>
                        <div style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: concept.color,
                            marginBottom: 12,
                            textTransform: "uppercase"
                        }}>
                            ⌨️ Commands
                        </div>
                        <div style={{
                            background: "rgba(0,0,0,0.4)",
                            borderRadius: 12,
                            overflow: "hidden"
                        }}>
                            {concept.commands.map((cmd, i) => (
                                <div key={i} style={{
                                    padding: "10px 16px",
                                    borderBottom: i < concept.commands.length - 1 ? "1px solid #1e293b" : "none",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: 16
                                }}>
                                    <code style={{ color: "#67e8f9", fontSize: 12 }}>{cmd.cmd}</code>
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

function RequestFlowAnimation() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % requestFlowSteps.length);
        }, 2500);
        return () => clearInterval(timer);
    }, [isPlaying]);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(6, 182, 212, 0.3)"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>
                    🌐 Request Journey: User to Pod
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
                        cursor: "pointer"
                    }}
                >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {requestFlowSteps.map((step, i) => {
                    const isActive = i === currentStep;
                    const isPast = i < currentStep;
                    return (
                        <div
                            key={step.step}
                            onClick={() => setCurrentStep(i)}
                            style={{ display: "flex", gap: 16, cursor: "pointer", opacity: isActive ? 1 : 0.5, transition: "all 0.3s" }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    background: isActive ? step.color : isPast ? step.color + "50" : "#1e293b",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 18,
                                    boxShadow: isActive ? `0 0 20px ${step.color}50` : "none"
                                }}>
                                    {step.icon}
                                </div>
                                {i < requestFlowSteps.length - 1 && (
                                    <div style={{
                                        width: 2,
                                        height: 32,
                                        background: isPast ? step.color : "#1e293b"
                                    }} />
                                )}
                            </div>
                            <div style={{ flex: 1, paddingBottom: 16 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? step.color : "#64748b" }}>
                                    {step.step}. {step.title}
                                </div>
                                <div style={{ fontSize: 12, color: "#94a3b8" }}>{step.desc}</div>
                                {isActive && (
                                    <div style={{
                                        fontSize: 12,
                                        color: "#cbd5e1",
                                        background: "rgba(0,0,0,0.3)",
                                        padding: "8px 12px",
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

function RollingUpdateDemo() {
    const [step, setStep] = useState(0);
    const steps = [
        { pods: [{ v: 1 }, { v: 1 }, { v: 1 }], label: "Before: All v1" },
        { pods: [{ v: 1 }, { v: 1 }, { v: 1 }, { v: 2, isNew: true }], label: "Add new v2 pod" },
        { pods: [{ v: 1 }, { v: 1 }, { v: 2 }, { v: 2, isNew: true }], label: "Remove v1, add v2" },
        { pods: [{ v: 1 }, { v: 2 }, { v: 2 }, { v: 2, isNew: true }], label: "Continue rolling..." },
        { pods: [{ v: 2 }, { v: 2 }, { v: 2 }], label: "Complete: All v2 ✅" },
    ];

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 20 }}>
                🔄 Rolling Update: Zero Downtime Deploys
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {steps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setStep(i)}
                        style={{
                            padding: "6px 14px",
                            borderRadius: 8,
                            border: step === i ? "1px solid #a78bfa" : "1px solid #1e293b",
                            background: step === i ? "rgba(139,92,246,0.2)" : "transparent",
                            color: step === i ? "#a78bfa" : "#64748b",
                            cursor: "pointer",
                            fontSize: 12
                        }}
                    >
                        Step {i + 1}
                    </button>
                ))}
            </div>

            <div style={{ textAlign: "center", marginBottom: 16, color: "#a78bfa", fontWeight: 600 }}>
                {steps[step].label}
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                {steps[step].pods.map((pod, i) => (
                    <div key={i} style={{
                        padding: 16,
                        background: pod.v === 2 ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.2)",
                        border: `2px solid ${pod.v === 2 ? "#10b981" : "#6366f1"}`,
                        borderRadius: 12,
                        textAlign: "center",
                        transition: "all 0.3s",
                        transform: pod.isNew ? "scale(1.1)" : "scale(1)"
                    }}>
                        <div style={{ fontSize: 24 }}>🏠</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: pod.v === 2 ? "#10b981" : "#818cf8" }}>
                            v{pod.v}
                        </div>
                        {pod.isNew && <div style={{ fontSize: 10, color: "#10b981" }}>NEW!</div>}
                    </div>
                ))}
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
            {/* Welcome */}
            <div style={{
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(6, 182, 212, 0.3)"
            }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#22d3ee", marginBottom: 16 }}>
                    👋 Welcome to Traffic & Scaling!
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8 }}>
                    <strong>In Module 1, you learned the building blocks.</strong> Now let's learn how users actually
                    reach your apps and how Kubernetes handles thousands of requests. This module covers
                    how traffic flows from the internet to your containers.
                </div>
            </div>

            {/* The journey of a request */}
            <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fb923c", marginBottom: 16 }}>
                    🌐 The Journey of a Request (Simplified)
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.8, marginBottom: 16 }}>
                    When a user visits your website, here's what happens in Kubernetes:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        { step: "1", title: "User types your URL", detail: "e.g., https://myapp.com/api/products", color: "#38bdf8" },
                        { step: "2", title: "Ingress receives the request", detail: "The 'front door' that decides where to send traffic based on URL", color: "#22d3ee" },
                        { step: "3", title: "Service routes to pods", detail: "A stable address that load-balances across multiple pods", color: "#a78bfa" },
                        { step: "4", title: "Pod handles the request", detail: "Your actual container processes the request and returns a response", color: "#22c55e" },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 16,
                            padding: 16,
                            background: `${item.color}10`,
                            borderRadius: 12,
                            borderLeft: `4px solid ${item.color}`
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: item.color,
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 14,
                                flexShrink: 0
                            }}>
                                {item.step}
                            </div>
                            <div>
                                <div style={{ color: item.color, fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                                <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>{item.detail}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Analogies */}
            <div style={{
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(139, 92, 246, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 16 }}>
                    📮 Everyday Analogies for This Module
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                        {
                            k8s: "Deployment",
                            analogy: "A franchise owner",
                            icon: "📋",
                            color: "#a78bfa",
                            explain: "Says 'I want 3 McDonald's restaurants running with this menu.' Kubernetes builds and maintains them. If one closes, a new one opens automatically."
                        },
                        {
                            k8s: "ReplicaSet",
                            analogy: "The property manager",
                            icon: "👯",
                            color: "#818cf8",
                            explain: "Constantly counts: 'We need 3 restaurants. I see 2. Must build 1 more!' The actual 'counter' that keeps the right number of pods running."
                        },
                        {
                            k8s: "Service",
                            analogy: "A phone number",
                            icon: "📬",
                            color: "#60a5fa",
                            explain: "Your business has ONE phone number (Service). Calls get forwarded to any available employee (Pod). Employees change, but the number stays the same."
                        },
                        {
                            k8s: "Ingress",
                            analogy: "A building reception desk",
                            icon: "🚪",
                            color: "#22d3ee",
                            explain: "Visitors arrive at reception (Ingress). 'Going to Sales? Floor 3. HR? Floor 5.' Routes people based on who they're visiting, handles visitor badges (HTTPS/TLS)."
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
                                    <span style={{ color: "#e2e8f0", fontSize: 14 }}>{item.analogy}</span>
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
                background: "rgba(34, 197, 94, 0.1)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(34, 197, 94, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e", marginBottom: 16 }}>
                    🎯 Key Takeaways
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        "Deployment = Tells K8s how many copies of your app to run",
                        "ReplicaSet = The counter that maintains the exact number of pods",
                        "Service = A stable address that never changes (even when pods do)",
                        "Ingress = The front door that routes traffic based on URL paths",
                        "Traffic flow: Internet → Ingress → Service → Pods",
                        "When you scale up, more pods are created automatically!",
                    ].map((point, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 10,
                            fontSize: 13,
                            color: "#86efac"
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
                background: "rgba(6, 182, 212, 0.1)",
                borderRadius: 12,
                border: "1px solid rgba(6, 182, 212, 0.3)"
            }}>
                <div style={{ fontSize: 16, color: "#22d3ee", fontWeight: 600 }}>
                    👆 Click the tabs above to explore each concept!
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                    "📖 Concepts" for details • "🌐 Request Flow" for animated traffic • "🔄 Rolling Update" to see zero-downtime deploys
                </div>
            </div>
        </div>
    );
}

export default function KubernetesTrafficApp() {
    const [expandedConcept, setExpandedConcept] = useState(null);
    const [activeTab, setActiveTab] = useState("start");

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
                background: "radial-gradient(ellipse at top, rgba(6,182,212,0.1) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        background: "rgba(6,182,212,0.1)",
                        border: "1px solid rgba(6,182,212,0.3)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#22d3ee",
                        marginBottom: 16
                    }}>
                        <span>🚀</span>
                        <span>Module 2 • Traffic & Scaling</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #22d3ee 0%, #8b5cf6 50%, #10b981 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Traffic & Scaling
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Deployment → Service → Ingress — How traffic flows to your apps
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "start", label: "🚀 Start Here" },
                        { id: "concepts", label: "📖 Concepts" },
                        { id: "flow", label: "🌐 Request Flow" },
                        { id: "rolling", label: "🔄 Rolling Update" },
                        { id: "bigpicture", label: "🗺️ Full Picture" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? "1px solid #22d3ee60" : "1px solid #1e293b",
                                background: activeTab === tab.id ? "rgba(6,182,212,0.1)" : "transparent",
                                color: activeTab === tab.id ? "#22d3ee" : "#64748b",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 13
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "start" && <BeginnerIntro />}

                {activeTab === "concepts" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {concepts.map(concept => (
                            <ConceptCard
                                key={concept.id}
                                concept={concept}
                                isExpanded={expandedConcept === concept.id}
                                onToggle={() => setExpandedConcept(expandedConcept === concept.id ? null : concept.id)}
                            />
                        ))}
                    </div>
                )}

                {activeTab === "flow" && <RequestFlowAnimation />}
                {activeTab === "rolling" && <RollingUpdateDemo />}

                {activeTab === "bigpicture" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div>
                            <MermaidDiagram chart={diagrams.trafficFlow} title="Complete Traffic Flow" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(6, 182, 212, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(6, 182, 212, 0.3)",
                                borderLeft: "4px solid #22d3ee"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#22d3ee", marginBottom: 8 }}>
                                    📖 What This Diagram Shows
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#67e8f9", lineHeight: 1.7 }}>
                                    <li><strong>Internet → Ingress:</strong> Users hit your domain, Ingress routes by URL path</li>
                                    <li><strong>Ingress → Service:</strong> Each path maps to a different Service</li>
                                    <li><strong>Service → Pods:</strong> Service load-balances across all matching pods</li>
                                </ul>
                            </div>
                        </div>
                        <MermaidDiagram chart={diagrams.fullPicture} title="How Everything Connects" />
                        <MermaidDiagram chart={diagrams.serviceTypes} title="Service Types Explained" />
                    </div>
                )}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(6,182,212,0.05)",
                    border: "1px solid rgba(6,182,212,0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#22d3ee", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Module 2 Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now understand: Deployment, ReplicaSet, Service, Ingress
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 3 — Security & Config (Namespace, ConfigMap, Secret, RBAC)
                    </div>
                </div>
            </div>
        </div>
    );
}
