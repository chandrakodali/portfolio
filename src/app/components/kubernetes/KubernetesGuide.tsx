import { useState, lazy, Suspense } from "react";

// Lazy load all K8s components for better performance
const K8sOverview = lazy(() => import("./k8s-0-overview"));
const K8sQuickStart = lazy(() => import("./k8s-quickstart"));
const K8sCore = lazy(() => import("./k8s-1-core"));
const K8sTraffic = lazy(() => import("./k8s-2-traffic"));
const K8sSecurity = lazy(() => import("./k8s-3-security"));
const K8sStorage = lazy(() => import("./k8s-storage"));
const K8sHelm = lazy(() => import("./k8s-4-helm"));
const K8sObservability = lazy(() => import("./k8s-5-observability"));
const K8sOperators = lazy(() => import("./k8s-6-operators"));
const K8sCommands = lazy(() => import("./k8s-7-commands"));
const K8sKagent = lazy(() => import("./k8s-8-kagent"));
const K8sTroubleshooting = lazy(() => import("./k8s-troubleshooting"));


const modules = [
    { id: 0, name: "The Big Picture", icon: "🎯", desc: "Why K8s, Prerequisites, Architecture", isNew: true },
    { id: "qs", name: "Quick Start", icon: "⚡", desc: "Hands-on in 10 minutes", isNew: true },
    { id: 1, name: "Core Concepts", icon: "🏗️", desc: "Cluster, Node, Pod, Container" },
    { id: 2, name: "Traffic & Scaling", icon: "🌐", desc: "Deployment, Service, Ingress" },
    { id: 3, name: "Security & Config", icon: "🔒", desc: "Namespace, ConfigMap, Secret, RBAC" },
    { id: "storage", name: "Storage", icon: "💾", desc: "Volumes, PV, PVC, StatefulSet", isNew: true },
    { id: 4, name: "Helm Deep-Dive", icon: "⎈", desc: "Charts, Templates, Values" },
    { id: 5, name: "Observability", icon: "📡", desc: "Prometheus, Grafana, OTel" },
    { id: 6, name: "CRDs & Operators", icon: "🤖", desc: "Custom Resources, Reconciliation" },
    { id: 7, name: "Commands", icon: "⌨️", desc: "kubectl & helm cheat sheets" },
    { id: 8, name: "kagent Architecture", icon: "🤖", desc: "MCP, A2A, ADK" },
    { id: "debug", name: "Troubleshooting", icon: "🔧", desc: "Debug common issues", isNew: true },
];

function LoadingSpinner() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
            color: "#818cf8"
        }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                <div>Loading module...</div>
            </div>
        </div>
    );
}

export function KubernetesGuide() {
    const [activeModule, setActiveModule] = useState<string | number | null>(null);

    // If viewing a module, render it full screen
    if (activeModule !== null) {
        const ModuleComponent = {
            0: K8sOverview,
            "qs": K8sQuickStart,
            1: K8sCore,
            2: K8sTraffic,
            3: K8sSecurity,
            "storage": K8sStorage,
            4: K8sHelm,
            5: K8sObservability,
            6: K8sOperators,
            7: K8sCommands,
            8: K8sKagent,
            "debug": K8sTroubleshooting,
        }[activeModule];

        return (
            <div style={{ minHeight: "100vh", background: "#030712" }}>
                {/* Back button */}
                <button
                    onClick={() => setActiveModule(null)}
                    style={{
                        position: "fixed",
                        top: 20,
                        left: 20,
                        zIndex: 1000,
                        padding: "10px 20px",
                        background: "rgba(15, 23, 42, 0.9)",
                        border: "1px solid #334155",
                        borderRadius: 12,
                        color: "#e2e8f0",
                        cursor: "pointer",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 600
                    }}
                >
                    ← Back to Menu
                </button>

                {/* Module navigation */}
                <div style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    zIndex: 1000,
                    display: "flex",
                    gap: 4
                }}>
                    {modules.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setActiveModule(m.id)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                background: activeModule === m.id ? "rgba(139,92,246,0.3)" : "rgba(15, 23, 42, 0.9)",
                                border: activeModule === m.id ? "1px solid #818cf8" : "1px solid #334155",
                                cursor: "pointer",
                                fontSize: 16,
                                backdropFilter: "blur(8px)"
                            }}
                            title={m.name}
                        >
                            {m.icon}
                        </button>
                    ))}
                </div>

                <Suspense fallback={<LoadingSpinner />}>
                    {ModuleComponent && <ModuleComponent />}
                </Suspense>
            </div>
        );
    }

    // Module selection menu
    return (
        <div style={{
            minHeight: "100vh",
            background: "#030712",
            color: "#e2e8f0",
            fontFamily: "'Inter', -apple-system, sans-serif",
            padding: "40px 20px"
        }}>
            <div style={{
                position: "fixed",
                inset: 0,
                background: "radial-gradient(ellipse at top, rgba(139,92,246,0.1) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 20px",
                        background: "rgba(139,92,246,0.1)",
                        border: "1px solid rgba(139,92,246,0.3)",
                        borderRadius: 24,
                        fontSize: 14,
                        color: "#a78bfa",
                        marginBottom: 20
                    }}>
                        <span>☸️</span>
                        <span>Interactive Learning Guide</span>
                    </div>

                    <h1 style={{
                        fontSize: 48,
                        fontWeight: 800,
                        margin: "0 0 16px 0",
                        background: "linear-gradient(135deg, #818cf8 0%, #22d3ee 50%, #fb923c 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Kubernetes + kagent
                    </h1>

                    <p style={{ color: "#64748b", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
                        From core concepts to AI agents — 8 interactive modules with diagrams, animations, and hands-on examples
                    </p>
                </div>

                {/* Module Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 20
                }}>
                    {modules.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setActiveModule(m.id)}
                            style={{
                                padding: 24,
                                background: "linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.5) 100%)",
                                border: "1px solid #1e293b",
                                borderRadius: 16,
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "all 0.3s",
                                position: "relative",
                                overflow: "hidden"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "#818cf860";
                                e.currentTarget.style.transform = "translateY(-4px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "#1e293b";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            {/* Module number badge */}
                            <div style={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                display: "flex",
                                gap: 6,
                                alignItems: "center"
                            }}>
                                {(m as any).isNew && (
                                    <div style={{
                                        padding: "3px 8px",
                                        borderRadius: 10,
                                        background: "rgba(34, 197, 94, 0.2)",
                                        fontSize: 10,
                                        color: "#22c55e",
                                        fontWeight: 700
                                    }}>
                                        NEW
                                    </div>
                                )}
                                <div style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: "50%",
                                    background: "rgba(139,92,246,0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 12,
                                    color: "#a78bfa",
                                    fontWeight: 700
                                }}>
                                    {typeof m.id === 'number' ? m.id : m.id === 'qs' ? 'QS' : m.id === 'storage' ? 'S' : '🔧'}
                                </div>
                            </div>

                            <div style={{ fontSize: 40, marginBottom: 12 }}>{m.icon}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>
                                {m.name}
                            </div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>
                                {m.desc}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: 48,
                    textAlign: "center",
                    padding: 24,
                    background: "rgba(139,92,246,0.05)",
                    borderRadius: 16,
                    border: "1px solid rgba(139,92,246,0.1)"
                }}>
                    <div style={{ fontSize: 14, color: "#64748b" }}>
                        Click any module to start learning • Navigate between modules using the top bar
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KubernetesGuide;
