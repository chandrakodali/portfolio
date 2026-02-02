import { MermaidDiagram } from "./MermaidDiagram";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES: QUICK START - Interactive Hands-On Guide
// From zero to deployed in 10 minutes with real commands
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    deploymentFlow: `
flowchart LR
    subgraph YOU["👤 YOU"]
        CMD["kubectl apply -f app.yaml"]
    end
    
    subgraph CLUSTER["☸️ CLUSTER"]
        API["API Server"]
        DEP["Deployment"]
        RS["ReplicaSet"]
        PODS["Pod 1<br/>Pod 2<br/>Pod 3"]
    end
    
    CMD --> API --> DEP --> RS --> PODS
    
    style YOU fill:#1e1b4b,stroke:#a78bfa
    style CLUSTER fill:#064e3b,stroke:#34d399
`,

    serviceFlow: `
flowchart TB
    subgraph EXTERNAL["🌐 EXTERNAL"]
        USER["You: localhost:8080"]
    end
    
    subgraph CLUSTER["☸️ CLUSTER"]
        SVC["📬 Service<br/>my-app-service<br/>ClusterIP: 10.96.x.x"]
        subgraph PODS["Pods"]
            P1["Pod 1<br/>10.244.0.5"]
            P2["Pod 2<br/>10.244.0.6"]
            P3["Pod 3<br/>10.244.0.7"]
        end
    end
    
    USER -->|"port-forward"| SVC
    SVC -->|"load balance"| P1
    SVC -->|"load balance"| P2
    SVC -->|"load balance"| P3
    
    style EXTERNAL fill:#7c2d12,stroke:#fb923c
    style CLUSTER fill:#0f172a,stroke:#8b5cf6
`
};

const environments = [
    {
        name: "Docker Desktop",
        icon: "🐳",
        difficulty: "Easiest",
        setup: "Docker Desktop → Settings → Kubernetes → Enable",
        pros: ["One click setup", "Works on Mac/Windows", "Includes kubectl"],
        cons: ["Uses more memory", "Mac/Windows only"],
        recommended: true
    },
    {
        name: "Minikube",
        icon: "🔷",
        difficulty: "Easy",
        setup: "brew install minikube && minikube start",
        pros: ["Cross-platform", "Lightweight", "Addons system"],
        cons: ["Extra install step", "Runs in VM/container"],
        recommended: true
    },
    {
        name: "kind (Kubernetes in Docker)",
        icon: "📦",
        difficulty: "Easy",
        setup: "brew install kind && kind create cluster",
        pros: ["Very fast", "Multiple nodes possible", "Good for testing"],
        cons: ["Less beginner friendly", "No GUI dashboard"],
        recommended: false
    },
    {
        name: "Cloud (EKS/GKE/AKS)",
        icon: "☁️",
        difficulty: "Advanced",
        setup: "Use cloud provider console or CLI",
        pros: ["Production-like", "Managed control plane", "Scaling built-in"],
        cons: ["Costs money", "More complex setup", "Networking complexity"],
        recommended: false
    }
];

const tutorials = [
    {
        id: "hello",
        title: "🚀 Tutorial 1: Hello Kubernetes",
        subtitle: "Your first pod in 2 minutes",
        difficulty: "Beginner",
        time: "2 min",
        steps: [
            {
                title: "Run your first pod",
                command: "kubectl run hello-nginx --image=nginx",
                explanation: "Creates a Pod named 'hello-nginx' running the nginx web server",
                verify: "kubectl get pods\n# Should show 'hello-nginx' with STATUS: Running"
            },
            {
                title: "Access the pod",
                command: "kubectl port-forward pod/hello-nginx 8080:80",
                explanation: "Creates a tunnel from localhost:8080 to the pod's port 80",
                verify: "# Open browser: http://localhost:8080\n# You should see the Nginx welcome page!"
            },
            {
                title: "See what's inside",
                command: "kubectl describe pod hello-nginx",
                explanation: "Shows all details: image, events, IP, node, status",
                verify: "# Look for the 'Events' section at the bottom"
            },
            {
                title: "Check the logs",
                command: "kubectl logs hello-nginx",
                explanation: "Shows stdout/stderr from the container",
                verify: "# You should see nginx access logs from your browser visit"
            },
            {
                title: "Clean up",
                command: "kubectl delete pod hello-nginx",
                explanation: "Removes the pod completely",
                verify: "kubectl get pods\n# Should show 'No resources found'"
            }
        ]
    },
    {
        id: "deployment",
        title: "📋 Tutorial 2: Deployment (Self-Healing)",
        subtitle: "Let Kubernetes manage your app",
        difficulty: "Beginner",
        time: "5 min",
        steps: [
            {
                title: "Create a deployment",
                command: "kubectl create deployment nginx-app --image=nginx --replicas=3",
                explanation: "Creates a Deployment that maintains 3 copies of nginx",
                verify: "kubectl get deployments\n# Should show 'nginx-app' with 3/3 READY"
            },
            {
                title: "See all pods created",
                command: "kubectl get pods -l app=nginx-app",
                explanation: "The '-l app=nginx-app' filters pods by label",
                verify: "# Should show 3 pods with random suffixes"
            },
            {
                title: "Test self-healing: kill a pod",
                command: "kubectl delete pod <POD_NAME>\n# Replace <POD_NAME> with actual name from previous step",
                explanation: "Delete one pod and watch Kubernetes recreate it",
                verify: "kubectl get pods -l app=nginx-app -w\n# Watch with -w flag. A new pod replaces the deleted one!"
            },
            {
                title: "Scale up",
                command: "kubectl scale deployment nginx-app --replicas=5",
                explanation: "Increases to 5 replicas",
                verify: "kubectl get pods -l app=nginx-app\n# Now shows 5 pods"
            },
            {
                title: "Scale down",
                command: "kubectl scale deployment nginx-app --replicas=2",
                explanation: "Decreases to 2 replicas (3 pods are terminated)",
                verify: "kubectl get pods -l app=nginx-app\n# Now shows only 2 pods"
            },
            {
                title: "Clean up",
                command: "kubectl delete deployment nginx-app",
                explanation: "Deletes deployment AND all its pods",
                verify: "kubectl get pods,deployments\n# Both should be gone"
            }
        ]
    },
    {
        id: "service",
        title: "📬 Tutorial 3: Service (Network Access)",
        subtitle: "Give your pods a stable address",
        difficulty: "Intermediate",
        time: "5 min",
        steps: [
            {
                title: "Create deployment first",
                command: "kubectl create deployment web-app --image=nginx --replicas=3",
                explanation: "We need pods before we can create a service for them",
                verify: "kubectl get pods -l app=web-app"
            },
            {
                title: "Expose as a Service",
                command: "kubectl expose deployment web-app --port=80 --name=web-service",
                explanation: "Creates a ClusterIP Service that load-balances to all 3 pods",
                verify: "kubectl get service web-service\n# Shows ClusterIP and PORT"
            },
            {
                title: "Access via port-forward",
                command: "kubectl port-forward service/web-service 8080:80",
                explanation: "Port-forward through the service instead of a specific pod",
                verify: "# Open http://localhost:8080 - hits a random pod each time"
            },
            {
                title: "See the endpoints",
                command: "kubectl get endpoints web-service",
                explanation: "Shows all pod IPs that receive traffic from this service",
                verify: "# Shows 3 IP addresses (one for each pod)"
            },
            {
                title: "Clean up",
                command: "kubectl delete deployment web-app\nkubectl delete service web-service",
                explanation: "Remove both resources",
                verify: "kubectl get all"
            }
        ]
    },
    {
        id: "yaml",
        title: "📄 Tutorial 4: YAML Manifests",
        subtitle: "Define resources as code (the real way)",
        difficulty: "Intermediate",
        time: "7 min",
        steps: [
            {
                title: "Create a YAML file",
                command: `cat << 'EOF' > my-app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: nginx
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 80
EOF`,
                explanation: "Creates a file with Deployment + Service defined in YAML",
                verify: "cat my-app.yaml\n# Should display the YAML content"
            },
            {
                title: "Apply the YAML",
                command: "kubectl apply -f my-app.yaml",
                explanation: "Creates/updates all resources defined in the file",
                verify: "kubectl get all -l app=my-app\n# Shows deployment, pods, service"
            },
            {
                title: "Make a change (edit replicas)",
                command: "# Edit my-app.yaml: change 'replicas: 3' to 'replicas: 5'\n# OR use sed:\nsed -i '' 's/replicas: 3/replicas: 5/' my-app.yaml",
                explanation: "YAML is your source of truth - edit and re-apply",
                verify: "kubectl apply -f my-app.yaml\n# Watch the change take effect"
            },
            {
                title: "View what would change (dry-run)",
                command: "kubectl apply -f my-app.yaml --dry-run=client -o yaml",
                explanation: "Shows what WOULD happen without actually applying",
                verify: "# Review the output to see the final state"
            },
            {
                title: "Delete everything via YAML",
                command: "kubectl delete -f my-app.yaml",
                explanation: "Deletes all resources defined in the file",
                verify: "kubectl get all -l app=my-app\n# Everything gone"
            },
            {
                title: "Clean up the file",
                command: "rm my-app.yaml",
                explanation: "Remove the local YAML file",
                verify: "# File deleted"
            }
        ]
    }
];

const commonMistakes = [
    {
        mistake: "Editing pods directly",
        why: "Pods are ephemeral - any change is lost when they restart",
        instead: "Edit the Deployment, not the Pod. Pods are managed by Deployments."
    },
    {
        mistake: "Using 'kubectl run' for production",
        why: "It creates a standalone pod with no self-healing",
        instead: "Use Deployments via 'kubectl create deployment' or YAML manifests."
    },
    {
        mistake: "Hardcoding pod IPs",
        why: "Pod IPs change every time they restart",
        instead: "Use Services to get a stable DNS name and IP."
    },
    {
        mistake: "Forgetting namespace",
        why: "Resources might be in a different namespace than default",
        instead: "Always specify -n <namespace> or check with 'kubectl get pods -A'"
    },
    {
        mistake: "Not checking events",
        why: "Events tell you WHY something failed",
        instead: "Use 'kubectl describe pod <name>' and check the Events section"
    }
];

function EnvironmentCard({ env }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            style={{
                background: env.recommended ? "rgba(34, 197, 94, 0.1)" : "rgba(15, 23, 42, 0.6)",
                border: `1px solid ${env.recommended ? "#22c55e" : "#334155"}`,
                borderRadius: 12,
                padding: 16,
                cursor: "pointer",
                transition: "all 0.3s"
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{env.icon}</span>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
                            {env.name}
                        </span>
                        {env.recommended && (
                            <span style={{
                                fontSize: 10,
                                padding: "2px 8px",
                                borderRadius: 10,
                                background: "rgba(34, 197, 94, 0.2)",
                                color: "#22c55e"
                            }}>
                                Recommended
                            </span>
                        )}
                        <span style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 10,
                            background: "rgba(139, 92, 246, 0.2)",
                            color: "#a78bfa"
                        }}>
                            {env.difficulty}
                        </span>
                    </div>
                </div>
                <span style={{ color: "#64748b" }}>{expanded ? "▼" : "▶"}</span>
            </div>

            {expanded && (
                <div style={{ marginTop: 16 }}>
                    <pre style={{
                        background: "rgba(0,0,0,0.3)",
                        padding: 12,
                        borderRadius: 8,
                        color: "#67e8f9",
                        fontSize: 11,
                        fontFamily: "monospace",
                        overflow: "auto"
                    }}>
                        {env.setup}
                    </pre>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                        <div>
                            <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginBottom: 4 }}>✅ Pros</div>
                            {env.pros.map((p, i) => (
                                <div key={i} style={{ fontSize: 11, color: "#86efac" }}>• {p}</div>
                            ))}
                        </div>
                        <div>
                            <div style={{ fontSize: 11, color: "#f87171", fontWeight: 600, marginBottom: 4 }}>⚠️ Cons</div>
                            {env.cons.map((c, i) => (
                                <div key={i} style={{ fontSize: 11, color: "#fca5a5" }}>• {c}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function TutorialCard({ tutorial }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)",
            marginBottom: 24
        }}>
            <div
                onClick={() => setExpanded(!expanded)}
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa" }}>
                        {tutorial.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                        {tutorial.subtitle} • {tutorial.difficulty} • {tutorial.time}
                    </div>
                </div>
                <span style={{ color: "#64748b", fontSize: 20 }}>{expanded ? "▼" : "▶"}</span>
            </div>

            {expanded && (
                <div style={{ marginTop: 20 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                        {tutorial.steps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    border: currentStep === i ? "2px solid #a78bfa" : "1px solid #334155",
                                    background: currentStep === i ? "rgba(139,92,246,0.2)" : i < currentStep ? "rgba(34,197,94,0.2)" : "transparent",
                                    color: currentStep === i ? "#a78bfa" : i < currentStep ? "#22c55e" : "#64748b",
                                    cursor: "pointer",
                                    fontSize: 12,
                                    fontWeight: 700
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <div style={{
                        padding: 20,
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: 12,
                        borderLeft: "4px solid #a78bfa"
                    }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 8 }}>
                            Step {currentStep + 1}: {tutorial.steps[currentStep].title}
                        </div>

                        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                            {tutorial.steps[currentStep].explanation}
                        </div>

                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Command:</div>
                        <pre style={{
                            background: "rgba(0,0,0,0.4)",
                            padding: 12,
                            borderRadius: 8,
                            fontSize: 11,
                            color: "#67e8f9",
                            fontFamily: "monospace",
                            overflow: "auto",
                            marginBottom: 12,
                            whiteSpace: "pre-wrap"
                        }}>
                            {tutorial.steps[currentStep].command}
                        </pre>

                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Verify:</div>
                        <pre style={{
                            background: "rgba(34,197,94,0.1)",
                            padding: 12,
                            borderRadius: 8,
                            fontSize: 11,
                            color: "#86efac",
                            fontFamily: "monospace",
                            overflow: "auto",
                            whiteSpace: "pre-wrap"
                        }}>
                            {tutorial.steps[currentStep].verify}
                        </pre>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                        <button
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "1px solid #334155",
                                background: "transparent",
                                color: currentStep === 0 ? "#334155" : "#64748b",
                                cursor: currentStep === 0 ? "not-allowed" : "pointer"
                            }}
                        >
                            ← Previous
                        </button>
                        <button
                            onClick={() => setCurrentStep(Math.min(tutorial.steps.length - 1, currentStep + 1))}
                            disabled={currentStep === tutorial.steps.length - 1}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "1px solid #a78bfa",
                                background: currentStep === tutorial.steps.length - 1 ? "transparent" : "rgba(139,92,246,0.2)",
                                color: currentStep === tutorial.steps.length - 1 ? "#334155" : "#a78bfa",
                                cursor: currentStep === tutorial.steps.length - 1 ? "not-allowed" : "pointer"
                            }}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function KubernetesQuickStartApp() {
    const [activeTab, setActiveTab] = useState("setup");

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
                background: "radial-gradient(ellipse at top, rgba(34,197,94,0.08) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        background: "rgba(34,197,94,0.1)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#22c55e",
                        marginBottom: 16
                    }}>
                        <span>⚡</span>
                        <span>HANDS-ON LEARNING</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #22c55e 0%, #67e8f9 50%, #a78bfa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Quick Start: Hands-On Kubernetes
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        From zero to deployed in 10 minutes with real commands
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "setup", label: "🖥️ Environment Setup" },
                        { id: "tutorials", label: "📚 Tutorials" },
                        { id: "diagrams", label: "📊 How It Works" },
                        { id: "mistakes", label: "⚠️ Common Mistakes" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 16px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? "1px solid #22c55e60" : "1px solid #1e293b",
                                background: activeTab === tab.id ? "rgba(34,197,94,0.1)" : "transparent",
                                color: activeTab === tab.id ? "#22c55e" : "#64748b",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 13
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "setup" && (
                    <div>
                        <div style={{
                            padding: 16,
                            background: "rgba(34, 197, 94, 0.1)",
                            borderRadius: 12,
                            border: "1px solid rgba(34, 197, 94, 0.3)",
                            marginBottom: 24
                        }}>
                            <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 600 }}>
                                🎯 Goal: Get a local Kubernetes cluster running for practice
                            </div>
                            <div style={{ fontSize: 12, color: "#86efac", marginTop: 4 }}>
                                Pick any option below. Docker Desktop or Minikube are recommended for beginners.
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {environments.map((env, i) => (
                                <EnvironmentCard key={i} env={env} />
                            ))}
                        </div>

                        <div style={{
                            marginTop: 24,
                            padding: 16,
                            background: "rgba(0,0,0,0.3)",
                            borderRadius: 12,
                            borderLeft: "4px solid #67e8f9"
                        }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#67e8f9", marginBottom: 8 }}>
                                ✅ Verify Your Setup
                            </div>
                            <pre style={{
                                background: "rgba(0,0,0,0.3)",
                                padding: 12,
                                borderRadius: 8,
                                fontSize: 12,
                                color: "#86efac",
                                fontFamily: "monospace"
                            }}>
                                {`kubectl cluster-info
# Should show: Kubernetes control plane is running at...

kubectl get nodes
# Should show at least 1 node with STATUS: Ready`}
                            </pre>
                        </div>
                    </div>
                )}

                {activeTab === "tutorials" && (
                    <div>
                        {tutorials.map(tutorial => (
                            <TutorialCard key={tutorial.id} tutorial={tutorial} />
                        ))}
                    </div>
                )}

                {activeTab === "diagrams" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* Deployment Flow Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.deploymentFlow} title="What happens when you apply a Deployment" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(139, 92, 246, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                borderLeft: "4px solid #a78bfa"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>
                                    📖 Understanding Deployment Flow
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#c4b5fd", lineHeight: 1.7 }}>
                                    <li><strong>kubectl apply:</strong> Sends your YAML to the API Server</li>
                                    <li><strong>Deployment:</strong> Created in the cluster, defines desired state</li>
                                    <li><strong>ReplicaSet:</strong> Created by Deployment, ensures exact pod count</li>
                                    <li><strong>Pods:</strong> Created by ReplicaSet, run your containers</li>
                                    <li><strong>Key insight:</strong> If pods die, ReplicaSet creates replacements automatically!</li>
                                </ul>
                            </div>
                        </div>

                        {/* Service Flow Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.serviceFlow} title="How Services route traffic to Pods" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(34, 197, 94, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(34, 197, 94, 0.3)",
                                borderLeft: "4px solid #22c55e"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#22c55e", marginBottom: 8 }}>
                                    📖 Understanding Service Networking
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#86efac", lineHeight: 1.7 }}>
                                    <li><strong>Problem:</strong> Pod IPs change every time they restart — can't hardcode them!</li>
                                    <li><strong>Solution:</strong> Service provides a stable IP/DNS that never changes</li>
                                    <li><strong>Load balancing:</strong> Traffic is distributed across all healthy pods</li>
                                    <li><strong>ClusterIP:</strong> Internal-only address (10.96.x.x), only reachable inside cluster</li>
                                    <li><strong>port-forward:</strong> Creates a tunnel from your laptop to the Service for dev/testing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "mistakes" && (
                    <div>
                        <div style={{
                            padding: 16,
                            background: "rgba(251, 146, 60, 0.1)",
                            borderRadius: 12,
                            border: "1px solid rgba(251, 146, 60, 0.3)",
                            marginBottom: 24
                        }}>
                            <div style={{ fontSize: 14, color: "#fb923c", fontWeight: 600 }}>
                                ⚠️ Beginner Mistakes to Avoid
                            </div>
                            <div style={{ fontSize: 12, color: "#fcd34d", marginTop: 4 }}>
                                Everyone makes these - here's how to avoid them
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {commonMistakes.map((item, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: "rgba(15, 23, 42, 0.6)",
                                        border: "1px solid #334155",
                                        borderRadius: 12,
                                        padding: 16
                                    }}
                                >
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>
                                        ❌ {item.mistake}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
                                        <strong>Why it's bad:</strong> {item.why}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#86efac" }}>
                                        <strong>✅ Instead:</strong> {item.instead}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(34, 197, 94, 0.05)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Quick Start Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You've run pods, deployments, and services. You're ready for the deep dive.
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 1 — Core Concepts (understand WHAT you just did)
                    </div>
                </div>
            </div>
        </div>
    );
}
