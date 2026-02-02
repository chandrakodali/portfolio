import { MermaidDiagram } from "./MermaidDiagram";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES COMMANDS QUICK REFERENCE - Interactive Guide (Task 7 of 8)
// Covers: kubectl, helm, debugging, common patterns
// ═══════════════════════════════════════════════════════════════════════════

const kubectlCommands = {
    "Get Resources": [
        { cmd: "kubectl get pods", desc: "List all pods in current namespace" },
        { cmd: "kubectl get pods -A", desc: "List pods in ALL namespaces" },
        { cmd: "kubectl get pods -o wide", desc: "Show more details (node, IP)" },
        { cmd: "kubectl get pods -w", desc: "Watch for changes in real-time" },
        { cmd: "kubectl get all", desc: "List pods, services, deployments, etc." },
        { cmd: "kubectl get nodes", desc: "List all cluster nodes" },
        { cmd: "kubectl get svc", desc: "List services (short for services)" },
        { cmd: "kubectl get deploy", desc: "List deployments" },
        { cmd: "kubectl get ns", desc: "List namespaces" },
        { cmd: "kubectl get events --sort-by='.lastTimestamp'", desc: "Recent events sorted by time" },
    ],
    "Describe & Inspect": [
        { cmd: "kubectl describe pod <name>", desc: "Detailed info about a pod" },
        { cmd: "kubectl describe node <name>", desc: "Node capacity, conditions, pods" },
        { cmd: "kubectl get pod <name> -o yaml", desc: "Full YAML definition" },
        { cmd: "kubectl get pod <name> -o json", desc: "Full JSON definition" },
        { cmd: "kubectl get pod <name> -o jsonpath='{.status.podIP}'", desc: "Extract specific field" },
        { cmd: "kubectl explain pod.spec.containers", desc: "API docs for a field" },
    ],
    "Create & Apply": [
        { cmd: "kubectl apply -f file.yaml", desc: "Create or update from file" },
        { cmd: "kubectl apply -f ./dir/", desc: "Apply all YAML in directory" },
        { cmd: "kubectl apply -f https://url/file.yaml", desc: "Apply from URL" },
        { cmd: "kubectl create deployment nginx --image=nginx", desc: "Create deployment imperatively" },
        { cmd: "kubectl create namespace dev", desc: "Create a namespace" },
        { cmd: "kubectl run debug --image=busybox -it --rm -- sh", desc: "Run temporary debug pod" },
    ],
    "Edit & Update": [
        { cmd: "kubectl edit deploy <name>", desc: "Edit deployment in editor" },
        { cmd: "kubectl set image deploy/<name> <container>=<image>", desc: "Update container image" },
        { cmd: "kubectl scale deploy <name> --replicas=5", desc: "Scale deployment" },
        { cmd: "kubectl rollout restart deploy <name>", desc: "Restart all pods" },
        { cmd: "kubectl patch deploy <name> -p '{\"spec\":{\"replicas\":3}}'", desc: "Patch resource" },
        { cmd: "kubectl label pod <name> env=prod", desc: "Add label to pod" },
        { cmd: "kubectl annotate pod <name> description='My pod'", desc: "Add annotation" },
    ],
    "Delete": [
        { cmd: "kubectl delete pod <name>", desc: "Delete a pod" },
        { cmd: "kubectl delete -f file.yaml", desc: "Delete resources in file" },
        { cmd: "kubectl delete pods --all", desc: "Delete all pods in namespace" },
        { cmd: "kubectl delete pod <name> --force --grace-period=0", desc: "Force delete stuck pod" },
        { cmd: "kubectl delete ns <name>", desc: "Delete namespace (and all resources!)" },
    ],
    "Logs & Debug": [
        { cmd: "kubectl logs <pod>", desc: "View pod logs" },
        { cmd: "kubectl logs <pod> -f", desc: "Stream logs (follow)" },
        { cmd: "kubectl logs <pod> --tail=100", desc: "Last 100 lines" },
        { cmd: "kubectl logs <pod> -c <container>", desc: "Logs for specific container" },
        { cmd: "kubectl logs <pod> --previous", desc: "Logs from crashed container" },
        { cmd: "kubectl exec -it <pod> -- sh", desc: "Shell into pod" },
        { cmd: "kubectl exec -it <pod> -- cat /etc/config", desc: "Run command in pod" },
        { cmd: "kubectl port-forward pod/<name> 8080:80", desc: "Forward local port to pod" },
        { cmd: "kubectl port-forward svc/<name> 8080:80", desc: "Forward to service" },
        { cmd: "kubectl cp <pod>:/path/file ./local", desc: "Copy file from pod" },
    ],
    "Context & Config": [
        { cmd: "kubectl config get-contexts", desc: "List all contexts" },
        { cmd: "kubectl config current-context", desc: "Show current context" },
        { cmd: "kubectl config use-context <name>", desc: "Switch context" },
        { cmd: "kubectl config set-context --current --namespace=dev", desc: "Set default namespace" },
        { cmd: "kubectl cluster-info", desc: "Show cluster endpoints" },
        { cmd: "kubectl api-resources", desc: "List all resource types" },
        { cmd: "kubectl api-versions", desc: "List API versions" },
    ],
    "Rollouts": [
        { cmd: "kubectl rollout status deploy <name>", desc: "Watch rollout progress" },
        { cmd: "kubectl rollout history deploy <name>", desc: "Show revision history" },
        { cmd: "kubectl rollout undo deploy <name>", desc: "Rollback to previous" },
        { cmd: "kubectl rollout undo deploy <name> --to-revision=2", desc: "Rollback to specific revision" },
        { cmd: "kubectl rollout pause deploy <name>", desc: "Pause rollout" },
        { cmd: "kubectl rollout resume deploy <name>", desc: "Resume rollout" },
    ],
    "Advanced": [
        { cmd: "kubectl top nodes", desc: "Show node CPU/memory usage" },
        { cmd: "kubectl top pods", desc: "Show pod CPU/memory usage" },
        { cmd: "kubectl auth can-i create pods", desc: "Check if you can do action" },
        { cmd: "kubectl auth can-i '*' '*'", desc: "Check if you're admin" },
        { cmd: "kubectl diff -f file.yaml", desc: "Show what would change" },
        { cmd: "kubectl wait --for=condition=ready pod/<name>", desc: "Wait for condition" },
        { cmd: "kubectl drain <node> --ignore-daemonsets", desc: "Drain node for maintenance" },
        { cmd: "kubectl cordon <node>", desc: "Mark node as unschedulable" },
        { cmd: "kubectl uncordon <node>", desc: "Mark node as schedulable" },
    ],
};

const helmCommands = {
    "Install & Upgrade": [
        { cmd: "helm install <release> <chart>", desc: "Install a chart" },
        { cmd: "helm install <release> ./local-chart", desc: "Install from local folder" },
        { cmd: "helm install <release> <chart> -f values.yaml", desc: "With custom values file" },
        { cmd: "helm install <release> <chart> --set key=value", desc: "Override single value" },
        { cmd: "helm install <release> <chart> -n <namespace>", desc: "Install in namespace" },
        { cmd: "helm install <release> <chart> --create-namespace", desc: "Create namespace if needed" },
        { cmd: "helm upgrade <release> <chart>", desc: "Upgrade existing release" },
        { cmd: "helm upgrade --install <release> <chart>", desc: "Install or upgrade" },
        { cmd: "helm upgrade <release> <chart> --reuse-values", desc: "Keep existing values" },
    ],
    "List & Status": [
        { cmd: "helm list", desc: "List releases in current namespace" },
        { cmd: "helm list -A", desc: "List releases in all namespaces" },
        { cmd: "helm status <release>", desc: "Show release status" },
        { cmd: "helm history <release>", desc: "Show revision history" },
        { cmd: "helm get values <release>", desc: "Show current values" },
        { cmd: "helm get values <release> --all", desc: "Show all values (incl defaults)" },
        { cmd: "helm get manifest <release>", desc: "Show generated YAML" },
        { cmd: "helm get notes <release>", desc: "Show release notes" },
    ],
    "Rollback & Uninstall": [
        { cmd: "helm rollback <release> <revision>", desc: "Rollback to revision" },
        { cmd: "helm rollback <release> 0", desc: "Rollback to previous" },
        { cmd: "helm uninstall <release>", desc: "Uninstall release" },
        { cmd: "helm uninstall <release> --keep-history", desc: "Uninstall but keep history" },
    ],
    "Repository": [
        { cmd: "helm repo add <name> <url>", desc: "Add chart repository" },
        { cmd: "helm repo add bitnami https://charts.bitnami.com/bitnami", desc: "Example: add Bitnami" },
        { cmd: "helm repo update", desc: "Update repo index" },
        { cmd: "helm repo list", desc: "List configured repos" },
        { cmd: "helm repo remove <name>", desc: "Remove repository" },
    ],
    "Search & Inspect": [
        { cmd: "helm search repo <keyword>", desc: "Search repos for chart" },
        { cmd: "helm search hub <keyword>", desc: "Search Artifact Hub" },
        { cmd: "helm show values <chart>", desc: "Show chart's default values" },
        { cmd: "helm show chart <chart>", desc: "Show chart metadata" },
        { cmd: "helm show readme <chart>", desc: "Show chart README" },
        { cmd: "helm show all <chart>", desc: "Show all chart info" },
    ],
    "Development": [
        { cmd: "helm create <name>", desc: "Create new chart scaffold" },
        { cmd: "helm template <release> <chart>", desc: "Render templates locally" },
        { cmd: "helm template <chart> --debug", desc: "Render with debug info" },
        { cmd: "helm lint <chart>", desc: "Check chart for issues" },
        { cmd: "helm package <chart>", desc: "Package chart into .tgz" },
        { cmd: "helm pull <chart>", desc: "Download chart locally" },
        { cmd: "helm pull <chart> --untar", desc: "Download and extract" },
        { cmd: "helm dependency update <chart>", desc: "Update chart dependencies" },
    ],
};

const commonPatterns = [
    {
        title: "Debug a failing pod",
        commands: [
            "kubectl get pods                    # Check pod status",
            "kubectl describe pod <name>         # See events, errors",
            "kubectl logs <pod>                  # Check app logs",
            "kubectl logs <pod> --previous       # Logs from crashed container",
            "kubectl exec -it <pod> -- sh        # Shell in for debugging",
        ],
    },
    {
        title: "Force delete stuck resources",
        commands: [
            "kubectl delete pod <name> --force --grace-period=0",
            "kubectl patch pvc <name> -p '{\"metadata\":{\"finalizers\":null}}'",
            "kubectl delete ns <name> --force --grace-period=0",
        ],
    },
    {
        title: "Quick deploy and expose",
        commands: [
            "kubectl create deployment nginx --image=nginx",
            "kubectl expose deployment nginx --port=80 --type=NodePort",
            "kubectl port-forward svc/nginx 8080:80",
        ],
    },
    {
        title: "Check resource usage",
        commands: [
            "kubectl top nodes                   # Node CPU/memory",
            "kubectl top pods                    # Pod CPU/memory",
            "kubectl describe node <name> | grep -A5 'Allocated'",
        ],
    },
    {
        title: "Generate YAML (dry-run)",
        commands: [
            "kubectl create deployment nginx --image=nginx --dry-run=client -o yaml > deploy.yaml",
            "kubectl create service clusterip nginx --tcp=80:80 --dry-run=client -o yaml",
            "kubectl run debug --image=busybox --dry-run=client -o yaml -- sleep 3600",
        ],
    },
];

const shortcuts = [
    { short: "po", full: "pods" },
    { short: "svc", full: "services" },
    { short: "deploy", full: "deployments" },
    { short: "rs", full: "replicasets" },
    { short: "ds", full: "daemonsets" },
    { short: "sts", full: "statefulsets" },
    { short: "cm", full: "configmaps" },
    { short: "ns", full: "namespaces" },
    { short: "no", full: "nodes" },
    { short: "pv", full: "persistentvolumes" },
    { short: "pvc", full: "persistentvolumeclaims" },
    { short: "ing", full: "ingresses" },
    { short: "netpol", full: "networkpolicies" },
    { short: "sa", full: "serviceaccounts" },
    { short: "crd", full: "customresourcedefinitions" },
];

function CommandCard({ cmd, desc, onCopy }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard?.writeText(cmd);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div
            onClick={handleCopy}
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: "rgba(0,0,0,0.2)",
                borderRadius: 8,
                cursor: "pointer",
                border: "1px solid transparent",
                transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#8b5cf640"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
        >
            <code style={{ color: "#67e8f9", fontSize: 12, flex: 1 }}>{cmd}</code>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: "#64748b", fontSize: 11, maxWidth: 200, textAlign: "right" }}>{desc}</span>
                <span style={{ fontSize: 12, color: copied ? "#4ade80" : "#64748b", minWidth: 30 }}>
                    {copied ? "✓" : "📋"}
                </span>
            </div>
        </div>
    );
}

function CommandCategory({ title, commands, color }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid #1e293b",
            borderRadius: 12,
            overflow: "hidden"
        }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    background: isOpen ? `${color}10` : "transparent"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color }}>
                        {title}
                    </div>
                    <div style={{
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: `${color}20`,
                        color,
                        fontSize: 11
                    }}>
                        {commands.length}
                    </div>
                </div>
                <div style={{ color, transform: isOpen ? "rotate(180deg)" : "", transition: "0.3s" }}>▼</div>
            </div>

            {isOpen && (
                <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {commands.map((c, i) => (
                        <CommandCard key={i} cmd={c.cmd} desc={c.desc} />
                    ))}
                </div>
            )}
        </div>
    );
}

function SearchableCommands({ commands, color, title }) {
    const [search, setSearch] = useState("");
    const [openCategories, setOpenCategories] = useState({});

    const filteredCommands = {};
    Object.entries(commands).forEach(([category, cmds]) => {
        const filtered = cmds.filter(c =>
            c.cmd.toLowerCase().includes(search.toLowerCase()) ||
            c.desc.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length > 0) {
            filteredCommands[category] = filtered;
        }
    });

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder={`Search ${title} commands...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: `1px solid ${color}40`,
                        background: "rgba(0,0,0,0.3)",
                        color: "#e2e8f0",
                        fontSize: 14,
                        outline: "none"
                    }}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Object.entries(filteredCommands).map(([category, cmds]) => (
                    <CommandCategory key={category} title={category} commands={cmds} color={color} />
                ))}
            </div>

            {Object.keys(filteredCommands).length === 0 && (
                <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>
                    No commands found for "{search}"
                </div>
            )}
        </div>
    );
}

function CommonPatterns() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {commonPatterns.map((pattern, i) => (
                <div key={i} style={{
                    background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.5) 100%)",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    borderRadius: 12,
                    padding: 20
                }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#a78bfa", marginBottom: 12 }}>
                        {pattern.title}
                    </div>
                    <div style={{
                        background: "rgba(0,0,0,0.4)",
                        borderRadius: 8,
                        padding: 12,
                        fontFamily: "monospace"
                    }}>
                        {pattern.commands.map((cmd, j) => (
                            <div key={j} style={{
                                color: cmd.includes("#") ? "#64748b" : "#67e8f9",
                                fontSize: 12,
                                lineHeight: 1.8
                            }}>
                                {cmd}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ResourceShortcuts() {
    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(34, 211, 238, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 20 }}>
                ⚡ Resource Shortcuts
            </div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 8
            }}>
                {shortcuts.map((s, i) => (
                    <div key={i} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: 6,
                        fontSize: 12
                    }}>
                        <code style={{ color: "#22d3ee", fontWeight: 700 }}>{s.short}</code>
                        <span style={{ color: "#64748b" }}>→</span>
                        <span style={{ color: "#94a3b8" }}>{s.full}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function OutputFormats() {
    const formats = [
        { flag: "-o wide", desc: "More columns (node, IP)" },
        { flag: "-o yaml", desc: "Full YAML output" },
        { flag: "-o json", desc: "Full JSON output" },
        { flag: "-o name", desc: "Just resource names" },
        { flag: "-o jsonpath='{.items[*].metadata.name}'", desc: "Extract specific fields" },
        { flag: "-o custom-columns=NAME:.metadata.name,IMAGE:.spec.containers[0].image", desc: "Custom columns" },
    ];

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #422006 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(251, 191, 36, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24", marginBottom: 20 }}>
                📤 Output Formats
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {formats.map((f, i) => (
                    <div key={i} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: 8,
                        gap: 16
                    }}>
                        <code style={{ color: "#fbbf24", fontSize: 12 }}>{f.flag}</code>
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>{f.desc}</span>
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
                background: "linear-gradient(135deg, rgba(103, 232, 249, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(103, 232, 249, 0.3)"
            }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#67e8f9", marginBottom: 16 }}>
                    ⌨️ Your Command Line Toolkit
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8 }}>
                    <strong>This is your quick reference cheat sheet!</strong> You'll use two main command-line
                    tools constantly: <code>kubectl</code> for talking to Kubernetes directly, and <code>helm</code>
                    for managing packaged applications. Bookmark this page — you'll be back here often!
                </div>
            </div>

            {/* The two main tools */}
            <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 16 }}>
                    🔧 Two Essential Tools
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                        {
                            tool: "kubectl",
                            icon: "☸️",
                            color: "#67e8f9",
                            what: "The Swiss Army knife",
                            explain: "Directly talk to your Kubernetes cluster. Create pods, check logs, debug issues, scale deployments. Think of it like SSH but for Kubernetes objects.",
                            example: "kubectl get pods, kubectl logs my-pod, kubectl describe service"
                        },
                        {
                            tool: "helm",
                            icon: "⎈",
                            color: "#a78bfa",
                            what: "The package manager",
                            explain: "Install complete apps with one command. Like apt-get or brew, but for Kubernetes. Perfect for installing databases, monitoring tools, etc.",
                            example: "helm install, helm upgrade, helm rollback"
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
                                    <code style={{ color: item.color, fontWeight: 700, fontSize: 18 }}>{item.tool}</code>
                                    <span style={{ color: "#64748b", fontSize: 13 }}> — {item.what}</span>
                                </div>
                            </div>
                            <div style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, paddingLeft: 40, marginBottom: 8 }}>
                                {item.explain}
                            </div>
                            <div style={{ paddingLeft: 40, fontSize: 12, color: "#4ade80" }}>
                                Common: {item.example}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick win tips */}
            <div style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(34, 197, 94, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e", marginBottom: 16 }}>
                    ⚡ Pro Tips for Beginners
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        { tip: "Tab completion", detail: "Set up kubectl autocomplete — saves tons of typing!" },
                        { tip: "Aliases", detail: "alias k='kubectl' — type less, do more" },
                        { tip: "Use shortcuts", detail: "po=pods, svc=services, deploy=deployments (see Shortcuts tab)" },
                        { tip: "Dry-run mode", detail: "--dry-run=client -o yaml to see what would be created" },
                        { tip: "Click to copy", detail: "In this guide, click any command to copy it!" },
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 12,
                            fontSize: 13,
                            padding: "8px 12px",
                            background: "rgba(34, 197, 94, 0.1)",
                            borderRadius: 8
                        }}>
                            <span style={{ color: "#22c55e", fontWeight: 600, minWidth: 100 }}>{item.tip}</span>
                            <span style={{ color: "#94a3b8" }}>{item.detail}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ready prompt */}
            <div style={{
                textAlign: "center",
                padding: 20,
                background: "rgba(103, 232, 249, 0.1)",
                borderRadius: 12,
                border: "1px solid rgba(103, 232, 249, 0.3)"
            }}>
                <div style={{ fontSize: 16, color: "#67e8f9", fontWeight: 600 }}>
                    👆 Explore the tabs above!
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                    "☸️ kubectl" for cluster commands • "⎈ helm" for package management • "🔧 Patterns" for common workflows
                </div>
            </div>
        </div>
    );
}

export default function KubernetesCommandsApp() {
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
                background: "radial-gradient(ellipse at top, rgba(103,232,249,0.05) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        background: "rgba(103,232,249,0.1)",
                        border: "1px solid rgba(103,232,249,0.3)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#67e8f9",
                        marginBottom: 16
                    }}>
                        <span>⌨️</span>
                        <span>Module 7 • Commands</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #67e8f9 0%, #a78bfa 50%, #fbbf24 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Commands Quick Reference
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Click any command to copy • Essential kubectl & helm cheat sheets
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "start", label: "🚀 Start Here", color: "#22c55e" },
                        { id: "kubectl", label: "☸️ kubectl", color: "#67e8f9" },
                        { id: "helm", label: "⎈ helm", color: "#a78bfa" },
                        { id: "patterns", label: "🔧 Patterns", color: "#22c55e" },
                        { id: "shortcuts", label: "⚡ Shortcuts", color: "#22d3ee" },
                        { id: "output", label: "📤 Output", color: "#fbbf24" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? `1px solid ${tab.color}60` : "1px solid #1e293b",
                                background: activeTab === tab.id ? `${tab.color}15` : "transparent",
                                color: activeTab === tab.id ? tab.color : "#64748b",
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 14
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "start" && <BeginnerIntro />}

                {activeTab === "kubectl" && (
                    <SearchableCommands commands={kubectlCommands} color="#67e8f9" title="kubectl" />
                )}

                {activeTab === "helm" && (
                    <SearchableCommands commands={helmCommands} color="#a78bfa" title="helm" />
                )}

                {activeTab === "patterns" && <CommonPatterns />}
                {activeTab === "shortcuts" && <ResourceShortcuts />}
                {activeTab === "output" && <OutputFormats />}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(103,232,249,0.05)",
                    border: "1px solid rgba(103,232,249,0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#67e8f9", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Module 7 Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now have: kubectl + helm cheat sheets, common patterns, shortcuts
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 8 — kagent Architecture (CRDs, MCP, A2A, ADK, Operators)
                    </div>
                </div>
            </div>
        </div>
    );
}
