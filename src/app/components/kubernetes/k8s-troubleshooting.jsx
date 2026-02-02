import { MermaidDiagram } from "./MermaidDiagram";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES: TROUBLESHOOTING GUIDE
// Debugging common issues with flowcharts and solutions
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    debugFlow: `
flowchart TB
    START["🚨 Something is wrong!"]
    
    Q1{"What's the symptom?"}
    
    POD_NOT_RUNNING["Pod not running"]
    CANT_CONNECT["Can't connect to app"]
    APP_CRASHING["App keeps crashing"]
    DEPLOY_STUCK["Deployment stuck"]
    PVC_PENDING["PVC stuck Pending"]
    
    START --> Q1
    Q1 --> POD_NOT_RUNNING
    Q1 --> CANT_CONNECT
    Q1 --> APP_CRASHING
    Q1 --> DEPLOY_STUCK
    Q1 --> PVC_PENDING
    
    style START fill:#dc2626,stroke:#f87171
    style Q1 fill:#1e1b4b,stroke:#a78bfa
`,

    podNotRunning: `
flowchart TB
    START["Pod not Running 🚨"]
    
    CMD1["kubectl describe pod NAME"]
    
    Q1{"Check STATUS field"}
    
    PENDING["Pending"]
    IMAGEPULL["ImagePullBackOff"]
    CRASHLOOP["CrashLoopBackOff"]
    ERROR["Error/Failed"]
    
    START --> CMD1 --> Q1
    Q1 --> PENDING
    Q1 --> IMAGEPULL
    Q1 --> CRASHLOOP
    Q1 --> ERROR
    
    FIX_PENDING["❌ No resources / scheduling<br/>━━━━━━━━━━━━━━━━━━<br/>• Check node capacity<br/>• Check resource requests<br/>• Check node selectors/taints"]
    
    FIX_IMAGE["❌ Can't pull image<br/>━━━━━━━━━━━━━━━━━━<br/>• Image name typo?<br/>• Private registry auth?<br/>• Image doesn't exist?"]
    
    FIX_CRASH["❌ Container crashing<br/>━━━━━━━━━━━━━━━━━━<br/>• Check logs: kubectl logs<br/>• App error? Config issue?<br/>• Check readiness probe"]
    
    FIX_ERROR["❌ Pod failed<br/>━━━━━━━━━━━━━━━━━━<br/>• Check Events section<br/>• Check describe output<br/>• Security context?"]
    
    PENDING --> FIX_PENDING
    IMAGEPULL --> FIX_IMAGE
    CRASHLOOP --> FIX_CRASH
    ERROR --> FIX_ERROR
    
    style START fill:#dc2626,stroke:#f87171
    style FIX_PENDING fill:#0f172a,stroke:#fbbf24
    style FIX_IMAGE fill:#0f172a,stroke:#22d3ee
    style FIX_CRASH fill:#0f172a,stroke:#a78bfa
    style FIX_ERROR fill:#0f172a,stroke:#f87171
`
};

const issues = [
    {
        id: "imagepullbackoff",
        title: "ImagePullBackOff",
        icon: "🖼️",
        severity: "high",
        color: "#fb923c",
        symptoms: [
            "Pod stuck in 'ImagePullBackOff' or 'ErrImagePull' status",
            "Events show 'Failed to pull image'"
        ],
        causes: [
            "Image name or tag is misspelled",
            "Image doesn't exist in the registry",
            "Private registry without imagePullSecrets",
            "Network issues reaching the registry"
        ],
        diagnosis: [
            { cmd: "kubectl describe pod <name>", explain: "Check Events at bottom" },
            { cmd: "kubectl get pod <name> -o yaml | grep image", explain: "Verify image name" },
        ],
        solutions: [
            {
                cause: "Wrong image name",
                fix: "Check spelling: nginx vs ngnix, :latest vs :latests",
                yaml: `# Correct:
image: nginx:1.21
# Wrong:
image: ngnix:1.21`
            },
            {
                cause: "Private registry",
                fix: "Create imagePullSecret and reference it",
                yaml: `# Create secret
kubectl create secret docker-registry my-secret \\
  --docker-server=registry.example.com \\
  --docker-username=user \\
  --docker-password=pass

# Use in Pod
spec:
  imagePullSecrets:
  - name: my-secret`
            }
        ]
    },
    {
        id: "crashloopbackoff",
        title: "CrashLoopBackOff",
        icon: "🔄",
        severity: "high",
        color: "#f87171",
        symptoms: [
            "Pod status shows 'CrashLoopBackOff'",
            "RESTARTS counter keeps increasing",
            "Pod starts then immediately crashes"
        ],
        causes: [
            "Application crashes on startup (bug, missing config)",
            "Liveness probe failing",
            "Missing environment variables or secrets",
            "Wrong command or entrypoint",
            "File/permission issues"
        ],
        diagnosis: [
            { cmd: "kubectl logs <pod> --previous", explain: "See logs from last crash" },
            { cmd: "kubectl describe pod <pod>", explain: "Check Events and probe config" },
            { cmd: "kubectl get pod <pod> -o yaml", explain: "Check full pod spec" },
        ],
        solutions: [
            {
                cause: "App startup failure",
                fix: "Check logs for errors",
                yaml: `# Check current logs
kubectl logs my-pod

# Check PREVIOUS container logs (before crash)
kubectl logs my-pod --previous

# Follow logs live
kubectl logs my-pod -f`
            },
            {
                cause: "Liveness probe too aggressive",
                fix: "Add initialDelaySeconds to give app time to start",
                yaml: `livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30  # Wait 30s before first check
  periodSeconds: 10
  failureThreshold: 3      # Allow 3 failures`
            },
            {
                cause: "Missing config/secret",
                fix: "Check environment variables exist",
                yaml: `# First, verify secret exists
kubectl get secret my-secret

# Check if all keys are present
kubectl describe secret my-secret`
            }
        ]
    },
    {
        id: "pending",
        title: "Pod Stuck in Pending",
        icon: "⏳",
        severity: "medium",
        color: "#fbbf24",
        symptoms: [
            "Pod status stuck at 'Pending'",
            "Pod never starts running"
        ],
        causes: [
            "No nodes with sufficient CPU/memory",
            "Node selector doesn't match any node",
            "Taints without tolerations",
            "PVC not bound (for pods with volumes)"
        ],
        diagnosis: [
            { cmd: "kubectl describe pod <pod>", explain: "Events show WHY it can't schedule" },
            { cmd: "kubectl get nodes", explain: "Check node status" },
            { cmd: "kubectl describe node <node>", explain: "Check node capacity" },
        ],
        solutions: [
            {
                cause: "Insufficient resources",
                fix: "Lower resource requests or add more nodes",
                yaml: `# Check what pod is requesting
resources:
  requests:
    memory: "200Mi"  # Maybe too high?
    cpu: "500m"

# Check node capacity
kubectl describe node | grep -A5 "Allocated resources"`
            },
            {
                cause: "Node selector mismatch",
                fix: "Check labels on nodes",
                yaml: `# See labels on nodes
kubectl get nodes --show-labels

# Pod requires this label:
nodeSelector:
  disktype: ssd

# But nodes have:
disktype: hdd  # No match!`
            },
            {
                cause: "Taints blocking",
                fix: "Add toleration or remove taint",
                yaml: `# Check node taints
kubectl describe node | grep Taints

# Add toleration to pod
tolerations:
- key: "key"
  operator: "Equal"
  value: "value"
  effect: "NoSchedule"`
            }
        ]
    },
    {
        id: "service-no-endpoints",
        title: "Service Has No Endpoints",
        icon: "🔌",
        severity: "high",
        color: "#22d3ee",
        symptoms: [
            "Can't connect to service",
            "curl to service IP times out",
            "kubectl get endpoints shows empty"
        ],
        causes: [
            "Service selector doesn't match pod labels",
            "No pods running that match selector",
            "Pods not in 'Ready' state"
        ],
        diagnosis: [
            { cmd: "kubectl get endpoints <service>", explain: "Should list pod IPs" },
            { cmd: "kubectl describe service <service>", explain: "Check Selector field" },
            { cmd: "kubectl get pods --show-labels", explain: "Compare labels to selector" },
        ],
        solutions: [
            {
                cause: "Label mismatch",
                fix: "Service selector must exactly match pod labels",
                yaml: `# Service has:
selector:
  app: my-app    # Looking for app=my-app

# But Pod has:
labels:
  app: myapp     # Wrong! (no hyphen)

# Fix: make them match exactly`
            },
            {
                cause: "Pods not ready",
                fix: "Check why pods aren't passing readiness probe",
                yaml: `# Check pod readiness
kubectl get pods -o wide

# READY should be 1/1, not 0/1
# If 0/1, check readiness probe
kubectl describe pod <pod> | grep -A5 Readiness`
            }
        ]
    },
    {
        id: "pvc-pending",
        title: "PVC Stuck in Pending",
        icon: "💾",
        severity: "medium",
        color: "#a78bfa",
        symptoms: [
            "PVC status shows 'Pending'",
            "Pods waiting for PVC timeout",
            "Events show 'waiting for a volume to be created'"
        ],
        causes: [
            "No PV matches the PVC requirements",
            "StorageClass doesn't exist",
            "Cloud provisioner quota exceeded",
            "Wrong access mode"
        ],
        diagnosis: [
            { cmd: "kubectl describe pvc <pvc>", explain: "Check Events for reason" },
            { cmd: "kubectl get pv", explain: "Any available PVs?" },
            { cmd: "kubectl get storageclass", explain: "Does requested class exist?" },
        ],
        solutions: [
            {
                cause: "StorageClass not found",
                fix: "Create the StorageClass or use an existing one",
                yaml: `# List available storage classes
kubectl get storageclass

# If PVC requests non-existent class:
storageClassName: fast-ssd  # Doesn't exist!

# Either create it or change to existing one:
storageClassName: standard  # Use default`
            },
            {
                cause: "No matching PV",
                fix: "Create a PV or use dynamic provisioning",
                yaml: `# For static provisioning, PV must match:
# - Storage >= requested
# - AccessModes match
# - StorageClassName matches

# PVC wants:
resources:
  requests:
    storage: 10Gi
accessModes: [ReadWriteOnce]

# PV must offer >= 10Gi with same access mode`
            }
        ]
    },
    {
        id: "deployment-not-progressing",
        title: "Deployment Not Progressing",
        icon: "📋",
        severity: "medium",
        color: "#22c55e",
        symptoms: [
            "Deployment shows 'Progressing' or 'Waiting'",
            "New pods not starting",
            "Rollout seems stuck"
        ],
        causes: [
            "New pods can't start (resource/scheduling issues)",
            "Readiness probe never passes",
            "Deployment strategy constraints"
        ],
        diagnosis: [
            { cmd: "kubectl rollout status deployment/<name>", explain: "Shows rollout progress" },
            { cmd: "kubectl get replicaset", explain: "Check old vs new RS" },
            { cmd: "kubectl describe deployment <name>", explain: "Check conditions" },
        ],
        solutions: [
            {
                cause: "New pods failing",
                fix: "Check pod events (same as other pod issues)",
                yaml: `# Find the new ReplicaSet
kubectl get rs -l app=my-app

# Check its pods
kubectl describe rs <new-rs-name>

# Fix the underlying pod issue first`
            },
            {
                cause: "Frozen rollout",
                fix: "Rollback or force restart",
                yaml: `# Rollback to previous version
kubectl rollout undo deployment/my-app

# Or force a restart
kubectl rollout restart deployment/my-app

# Check history
kubectl rollout history deployment/my-app`
            }
        ]
    }
];

const quickCommands = [
    { cmd: "kubectl get pods -A", desc: "See ALL pods in ALL namespaces" },
    { cmd: "kubectl describe pod <name>", desc: "Full pod details + events" },
    { cmd: "kubectl logs <pod> --previous", desc: "Logs from previous crash" },
    { cmd: "kubectl logs <pod> -f", desc: "Follow logs live" },
    { cmd: "kubectl exec -it <pod> -- /bin/sh", desc: "Shell into container" },
    { cmd: "kubectl get events --sort-by=.metadata.creationTimestamp", desc: "Recent events sorted by time" },
    { cmd: "kubectl get endpoints <service>", desc: "Check service targets" },
    { cmd: "kubectl port-forward pod/<pod> 8080:80", desc: "Quick local access" },
    { cmd: "kubectl top pod", desc: "Resource usage (requires metrics-server)" },
    { cmd: "kubectl api-resources", desc: "All available resource types" },
];

function IssueCard({ issue }) {
    const [expanded, setExpanded] = useState(false);
    const [activeSolution, setActiveSolution] = useState(0);

    return (
        <div style={{
            background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, ${issue.color}10 100%)`,
            border: `1px solid ${issue.color}40`,
            borderRadius: 16,
            padding: 20,
            marginBottom: 16
        }}>
            <div
                onClick={() => setExpanded(!expanded)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
            >
                <span style={{ fontSize: 32 }}>{issue.icon}</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: issue.color }}>
                        {issue.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                        {issue.symptoms[0]}
                    </div>
                </div>
                <span style={{
                    padding: "4px 10px",
                    borderRadius: 12,
                    background: issue.severity === "high" ? "rgba(220, 38, 38, 0.2)" : "rgba(245, 158, 11, 0.2)",
                    color: issue.severity === "high" ? "#f87171" : "#fbbf24",
                    fontSize: 10,
                    fontWeight: 600
                }}>
                    {issue.severity.toUpperCase()}
                </span>
                <span style={{ color: "#64748b" }}>{expanded ? "▼" : "▶"}</span>
            </div>

            {expanded && (
                <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                            🔍 Symptoms
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {issue.symptoms.map((s, i) => (
                                <li key={i} style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{s}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                            ❓ Possible Causes
                        </div>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {issue.causes.map((c, i) => (
                                <li key={i} style={{ fontSize: 11, color: "#fcd34d", marginBottom: 4 }}>{c}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                            🔬 Diagnosis Commands
                        </div>
                        {issue.diagnosis.map((d, i) => (
                            <div key={i} style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 12px",
                                background: "rgba(0,0,0,0.3)",
                                borderRadius: 8,
                                marginBottom: 4
                            }}>
                                <code style={{ color: "#67e8f9", fontSize: 11, flex: "0 0 auto" }}>{d.cmd}</code>
                                <span style={{ color: "#64748b", fontSize: 10 }}>→ {d.explain}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", marginBottom: 12 }}>
                            ✅ Solutions
                        </div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                            {issue.solutions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveSolution(i)}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        border: activeSolution === i ? `1px solid ${issue.color}` : "1px solid #334155",
                                        background: activeSolution === i ? `${issue.color}20` : "transparent",
                                        color: activeSolution === i ? issue.color : "#64748b",
                                        cursor: "pointer",
                                        fontSize: 11
                                    }}
                                >
                                    {s.cause}
                                </button>
                            ))}
                        </div>
                        <div style={{
                            padding: 16,
                            background: "rgba(0,0,0,0.3)",
                            borderRadius: 12,
                            borderLeft: `4px solid ${issue.color}`
                        }}>
                            <div style={{ fontSize: 12, color: "#86efac", marginBottom: 8 }}>
                                <strong>Fix:</strong> {issue.solutions[activeSolution].fix}
                            </div>
                            <pre style={{
                                background: "rgba(0,0,0,0.4)",
                                padding: 12,
                                borderRadius: 8,
                                fontSize: 10,
                                color: "#67e8f9",
                                fontFamily: "monospace",
                                overflow: "auto",
                                whiteSpace: "pre-wrap"
                            }}>
                                {issue.solutions[activeSolution].yaml}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function KubernetesTroubleshootingApp() {
    const [activeTab, setActiveTab] = useState("flowchart");
    const [search, setSearch] = useState("");

    const filteredIssues = issues.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.symptoms.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

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
                background: "radial-gradient(ellipse at top, rgba(220, 38, 38, 0.08) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        background: "rgba(220, 38, 38, 0.1)",
                        border: "1px solid rgba(220, 38, 38, 0.3)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#f87171",
                        marginBottom: 16
                    }}>
                        <span>🔧</span>
                        <span>WHEN THINGS GO WRONG</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #f87171 0%, #fbbf24 50%, #22c55e 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Kubernetes Troubleshooting
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Debug common issues with flowcharts and solutions
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "flowchart", label: "📊 Debug Flowchart" },
                        { id: "issues", label: "🐛 Common Issues" },
                        { id: "commands", label: "💻 Quick Commands" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 16px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? "1px solid #f8717160" : "1px solid #1e293b",
                                background: activeTab === tab.id ? "rgba(248, 113, 113, 0.1)" : "transparent",
                                color: activeTab === tab.id ? "#f87171" : "#64748b",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 13
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "flowchart" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* Debug Flow Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.debugFlow} title="Start Here: What's the Symptom?" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(248, 113, 113, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(248, 113, 113, 0.3)",
                                borderLeft: "4px solid #f87171"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#f87171", marginBottom: 8 }}>
                                    📖 How to Use This Flowchart
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#fca5a5", lineHeight: 1.7 }}>
                                    <li><strong>Start with symptoms:</strong> What's the observable problem?</li>
                                    <li><strong>Pod not running:</strong> Check pod status with <code style={{ color: "#67e8f9" }}>kubectl get pods</code></li>
                                    <li><strong>Can't connect:</strong> Check service and endpoints</li>
                                    <li><strong>App crashing:</strong> Check logs with <code style={{ color: "#67e8f9" }}>kubectl logs</code></li>
                                    <li><strong>PVC pending:</strong> Check StorageClass and PV availability</li>
                                </ul>
                            </div>
                        </div>

                        {/* Pod Not Running Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.podNotRunning} title="Pod Not Running? Follow This Flow" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(139, 92, 246, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                borderLeft: "4px solid #a78bfa"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>
                                    📖 Understanding Pod Failure States
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: "#fbbf24", marginBottom: 4 }}>⏳ Pending</div>
                                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Pod can't be scheduled — no resources or node issues</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: "#22d3ee", marginBottom: 4 }}>🖼️ ImagePullBackOff</div>
                                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Can't download container image — typo or auth issue</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: "#a78bfa", marginBottom: 4 }}>🔄 CrashLoopBackOff</div>
                                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Container starts then crashes — check logs!</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 600, color: "#f87171", marginBottom: 4 }}>❌ Error/Failed</div>
                                        <div style={{ fontSize: 11, color: "#94a3b8" }}>Pod couldn't start — check events section</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "issues" && (
                    <div>
                        <input
                            type="text"
                            placeholder="Search issues... (e.g., 'crashloop', 'pending')"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid #334155",
                                background: "rgba(15, 23, 42, 0.6)",
                                color: "#e2e8f0",
                                fontSize: 14,
                                marginBottom: 24,
                                outline: "none"
                            }}
                        />
                        {filteredIssues.map(issue => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))}
                    </div>
                )}

                {activeTab === "commands" && (
                    <div style={{
                        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                        borderRadius: 16,
                        padding: 24,
                        border: "1px solid rgba(139, 92, 246, 0.3)"
                    }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 20 }}>
                            🛠️ Essential Debugging Commands
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {quickCommands.map((c, i) => (
                                <div key={i} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 14px",
                                    background: "rgba(0,0,0,0.3)",
                                    borderRadius: 8,
                                    borderLeft: "3px solid #a78bfa"
                                }}>
                                    <code style={{
                                        color: "#67e8f9",
                                        fontSize: 11,
                                        fontFamily: "monospace",
                                        flex: "0 0 auto",
                                        minWidth: 280
                                    }}>
                                        {c.cmd}
                                    </code>
                                    <span style={{ color: "#94a3b8", fontSize: 11 }}>{c.desc}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{
                            marginTop: 24,
                            padding: 16,
                            background: "rgba(34, 197, 94, 0.1)",
                            borderRadius: 12,
                            border: "1px solid rgba(34, 197, 94, 0.2)"
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: "#22c55e", marginBottom: 8 }}>
                                💡 Pro Tip: The Debug Loop
                            </div>
                            <ol style={{ margin: 0, paddingLeft: 20, fontSize: 11, color: "#86efac" }}>
                                <li>Get the resource status: <code>kubectl get &lt;resource&gt;</code></li>
                                <li>See details and events: <code>kubectl describe &lt;resource&gt; &lt;name&gt;</code></li>
                                <li>Check logs if applicable: <code>kubectl logs &lt;pod&gt;</code></li>
                                <li>Get full YAML: <code>kubectl get &lt;resource&gt; &lt;name&gt; -o yaml</code></li>
                            </ol>
                        </div>
                    </div>
                )}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(248, 113, 113, 0.05)",
                    border: "1px solid rgba(248, 113, 113, 0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#f87171", fontWeight: 600, marginBottom: 8 }}>
                        🔧 Troubleshooting Guide Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now know how to debug: Pod issues, Service connectivity, PVC problems
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Remember: kubectl describe and kubectl logs are your best friends!
                    </div>
                </div>
            </div>
        </div>
    );
}
