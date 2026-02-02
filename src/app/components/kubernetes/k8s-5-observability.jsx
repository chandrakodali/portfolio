import { MermaidDiagram } from "./MermaidDiagram";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES OBSERVABILITY - Interactive Learning Guide (Task 5 of 8)
// Covers: Prometheus, Grafana, OpenTelemetry, Alerts
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    threePillars: `
flowchart TB
    subgraph OBS["📡 OBSERVABILITY"]
        subgraph METRICS["📊 METRICS"]
            M_DESC["What is happening?<br/>━━━━━━━━━━━━<br/>• CPU: 85%<br/>• Requests: 1.2K/s<br/>• Errors: 0.5%"]
            M_TOOL["Tool: Prometheus"]
        end
        
        subgraph LOGS["📝 LOGS"]
            L_DESC["What exactly happened?<br/>━━━━━━━━━━━━━━━━━<br/>[10:23:15] User login<br/>[10:23:16] DB timeout<br/>[10:23:17] Retry..."]
            L_TOOL["Tool: Loki / ELK"]
        end
        
        subgraph TRACES["🔍 TRACES"]
            T_DESC["Where did it slow down?<br/>━━━━━━━━━━━━━━━━━<br/>api (5ms)<br/>└─ auth (12ms)<br/>└─ db (200ms) ⚠️"]
            T_TOOL["Tool: Jaeger / Tempo"]
        end
    end
    
    GRAFANA["📈 GRAFANA<br/>Visualize all three"]
    METRICS --> GRAFANA
    LOGS --> GRAFANA
    TRACES --> GRAFANA
    
    style METRICS fill:#0e7490,stroke:#22d3ee,stroke-width:2px
    style LOGS fill:#7c2d12,stroke:#fb923c,stroke-width:2px
    style TRACES fill:#4c1d95,stroke:#a78bfa,stroke-width:2px
    style GRAFANA fill:#052e16,stroke:#22c55e,stroke-width:2px
`,

    prometheusArch: `
flowchart TB
    subgraph PROM["📊 PROMETHEUS"]
        SCRAPE["🔄 Scraper<br/>Pulls /metrics"]
        TSDB["💾 Time-Series DB<br/>Stores all data"]
        QUERY["🔍 PromQL Engine<br/>Query language"]
    end
    
    subgraph TARGETS["🎯 SCRAPE TARGETS"]
        APP1["🏠 Pod: my-app<br/>/metrics:9090"]
        APP2["🏠 Pod: api<br/>/metrics:9090"]
        NODE["🏢 Node Exporter<br/>System metrics"]
        KUBE["☸️ kube-state-metrics<br/>K8s objects"]
    end
    
    subgraph ALERT["🚨 ALERTMANAGER"]
        RULES["Alert Rules<br/>CPU > 90% for 5m"]
        NOTIFY["Notifications<br/>Slack, PagerDuty"]
    end
    
    subgraph VISUAL["📈 GRAFANA"]
        DASH["Dashboards"]
    end
    
    SCRAPE -->|"every 15s"| APP1
    SCRAPE -->|"every 15s"| APP2
    SCRAPE -->|"every 15s"| NODE
    SCRAPE -->|"every 15s"| KUBE
    TSDB --> QUERY
    QUERY --> ALERT
    QUERY --> VISUAL
    
    style PROM fill:#0f172a,stroke:#fb923c,stroke-width:2px
    style TARGETS fill:#1e293b,stroke:#64748b
    style ALERT fill:#450a0a,stroke:#f87171
    style VISUAL fill:#052e16,stroke:#22c55e
`,

    otelFlow: `
flowchart LR
    subgraph APP["Your Application"]
        SDK["OpenTelemetry SDK<br/>━━━━━━━━━━━━<br/>Auto-instruments:<br/>• HTTP calls<br/>• DB queries<br/>• gRPC"]
    end
    
    subgraph COLLECTOR["OTel Collector"]
        RECV["Receivers<br/>━━━━━━━<br/>OTLP<br/>Jaeger<br/>Zipkin"]
        PROC["Processors<br/>━━━━━━━<br/>Batch<br/>Filter<br/>Enrich"]
        EXPORT["Exporters<br/>━━━━━━━<br/>Jaeger<br/>Tempo<br/>Datadog"]
    end
    
    subgraph BACKENDS["Backends"]
        JAEGER["🔍 Jaeger<br/>Traces"]
        PROM["📊 Prometheus<br/>Metrics"]
        LOKI["📝 Loki<br/>Logs"]
    end
    
    SDK -->|"spans"| RECV
    RECV --> PROC --> EXPORT
    EXPORT --> JAEGER
    EXPORT --> PROM
    EXPORT --> LOKI
    
    style APP fill:#312e81,stroke:#818cf8
    style COLLECTOR fill:#164e63,stroke:#22d3ee,stroke-width:2px
    style BACKENDS fill:#1e293b,stroke:#64748b
`,

    alertFlow: `
flowchart TB
    subgraph DETECT["1️⃣ Detection"]
        PROM["Prometheus<br/>evaluates rules<br/>every 15s"]
        RULE["Rule: cpu > 90%<br/>for: 5m"]
    end
    
    subgraph FIRE["2️⃣ Firing"]
        ALERT["Alert fires!<br/>severity: critical<br/>instance: pod-xyz"]
    end
    
    subgraph ROUTE["3️⃣ Alertmanager"]
        GROUP["Groups alerts<br/>by labels"]
        SILENCE["Checks silences<br/>& inhibitions"]
        ROUTE_CFG["Routes to<br/>receiver"]
    end
    
    subgraph NOTIFY["4️⃣ Notification"]
        SLACK["💬 Slack"]
        PD["📟 PagerDuty"]
        EMAIL["📧 Email"]
    end
    
    PROM --> RULE
    RULE -->|"condition met"| ALERT
    ALERT --> GROUP --> SILENCE --> ROUTE_CFG
    ROUTE_CFG --> SLACK
    ROUTE_CFG --> PD
    ROUTE_CFG --> EMAIL
    
    style DETECT fill:#1e1b4b,stroke:#a78bfa
    style FIRE fill:#7c2d12,stroke:#fb923c
    style ROUTE fill:#164e63,stroke:#22d3ee
    style NOTIFY fill:#052e16,stroke:#22c55e
`,

    traceExample: `
flowchart TB
    subgraph TRACE["🔍 Single Request Trace"]
        T0["🌐 Request: GET /api/orders<br/>Total: 523ms"]
        
        T1["📦 api-gateway<br/>12ms"]
        T2["📦 auth-service<br/>45ms"]
        T3["📦 order-service<br/>400ms ⚠️"]
        T4["📦 db query<br/>380ms 🔥"]
        T5["📦 response<br/>8ms"]
    end
    
    T0 --> T1
    T1 --> T2
    T2 --> T3
    T3 --> T4
    T4 --> T5
    
    INSIGHT["💡 Insight: DB query<br/>is the bottleneck!"]
    T4 --> INSIGHT
    
    style T0 fill:#0f172a,stroke:#8b5cf6
    style T3 fill:#422006,stroke:#fbbf24
    style T4 fill:#7c2d12,stroke:#f87171,stroke-width:3px
    style INSIGHT fill:#052e16,stroke:#22c55e
`,

    metricsEndpoint: `
flowchart LR
    subgraph APP["Your App"]
        CODE["app.get('/metrics', ...)"]
        METRICS["cpu_usage 0.85<br/>http_requests_total 12345<br/>http_errors_total 42<br/>response_time_p99 0.12"]
    end
    
    subgraph PROM["Prometheus"]
        SCRAPE["Scraper<br/>GET /metrics:9090"]
        STORE["Stores in TSDB"]
    end
    
    CODE --> METRICS
    SCRAPE -->|"every 15s"| METRICS
    METRICS --> STORE
    
    style APP fill:#312e81,stroke:#818cf8
    style PROM fill:#7c2d12,stroke:#fb923c
`
};

const concepts = [
    {
        id: "prometheus",
        icon: "📊",
        name: "Prometheus",
        tagline: "City Sensors",
        color: "#fb923c",
        what: "Prometheus is a time-series database that collects metrics from your apps by scraping HTTP endpoints. It stores data with timestamps and lets you query it with PromQL. It also evaluates alert rules.",
        why: "You need to know when things go wrong BEFORE users complain. Prometheus tracks CPU, memory, request rates, error rates — anything your app exposes. It's the foundation for alerting and dashboards.",
        analogy: "Sensors throughout the city measuring traffic flow, air quality, water pressure. They report to a central station (Prometheus) every 15 seconds. The station stores years of readings and can answer: 'What was the traffic like last Tuesday at 5pm?'",
    },
    {
        id: "grafana",
        icon: "📈",
        name: "Grafana",
        tagline: "Control Room Dashboard",
        color: "#22c55e",
        what: "Grafana is a visualization platform. It queries Prometheus (and other sources) to display beautiful dashboards with graphs, gauges, tables, and heatmaps. It's where you see the big picture.",
        why: "Raw metrics are numbers. Dashboards show trends, correlations, and anomalies visually. 'CPU spiked at 3am when batch job ran' is obvious in a graph, invisible in raw data.",
        analogy: "The control room with wall-sized screens showing city status. Traffic cameras, power grid, water system — all visualized in real-time. Operators can spot problems at a glance.",
    },
    {
        id: "otel",
        icon: "🔭",
        name: "OpenTelemetry",
        tagline: "Universal Telemetry Standard",
        color: "#818cf8",
        what: "OpenTelemetry (OTel) is a vendor-neutral standard for collecting metrics, logs, and traces. It provides SDKs for your code and a Collector that routes data to any backend (Jaeger, Prometheus, Datadog, etc.).",
        why: "Without a standard, you're locked into one vendor. OTel instruments once, exports anywhere. Switch from Jaeger to Tempo? Just change the Collector config — no code changes.",
        analogy: "A universal power adapter. Your devices (apps) use different plugs (telemetry formats). OTel is the converter that lets any device work in any country (backend).",
    },
    {
        id: "alerts",
        icon: "🚨",
        name: "Alerting",
        tagline: "Early Warning System",
        color: "#f87171",
        what: "Alertmanager (part of Prometheus) fires notifications when conditions are met. Alert rules define thresholds (CPU > 90% for 5m). Alertmanager routes alerts to Slack, PagerDuty, email based on severity.",
        why: "You can't watch dashboards 24/7. Alerts wake you up when something is wrong. Good alerts: actionable, not noisy. Bad alerts: firing every 5 minutes for nothing = alert fatigue.",
        analogy: "Fire alarms and security systems. Smoke detector (rule) triggers alarm (alert). The alarm company (Alertmanager) calls the fire department (PagerDuty) or texts you (Slack) based on severity.",
    }
];

const promqlExamples = [
    { query: "up", desc: "Is target up? (1=yes, 0=no)", result: "up{job='my-app'} = 1" },
    { query: "rate(http_requests_total[5m])", desc: "Requests per second (avg over 5m)", result: "23.5 req/s" },
    { query: "sum(rate(http_requests_total[5m])) by (status)", desc: "Requests by status code", result: "200: 22.1, 500: 0.3" },
    { query: "histogram_quantile(0.99, rate(http_duration_bucket[5m]))", desc: "99th percentile latency", result: "0.234s (234ms)" },
    { query: "increase(http_errors_total[1h])", desc: "Errors in last hour", result: "42 errors" },
    { query: "avg(container_memory_usage_bytes) by (pod)", desc: "Memory usage per pod", result: "pod-a: 256MB" },
];

const metricTypes = [
    { type: "Counter", desc: "Only goes up (resets on restart)", example: "http_requests_total", use: "Total counts, errors" },
    { type: "Gauge", desc: "Goes up and down", example: "temperature, queue_size", use: "Current values" },
    { type: "Histogram", desc: "Buckets of observations", example: "request_duration_seconds", use: "Latency percentiles" },
    { type: "Summary", desc: "Pre-calculated percentiles", example: "response_size_bytes", use: "Similar to histogram" },
];

// MermaidDiagram is imported from shared component above

function ThreePillarsComparison() {
    const pillars = [
        {
            name: "Metrics",
            icon: "📊",
            color: "#22d3ee",
            question: "What is happening?",
            data: "Numbers over time",
            example: "CPU: 85%, Errors: 0.5%",
            tool: "Prometheus",
            storage: "Low (aggregated)"
        },
        {
            name: "Logs",
            icon: "📝",
            color: "#fb923c",
            question: "What exactly happened?",
            data: "Text events",
            example: "[ERROR] Connection timeout",
            tool: "Loki / ELK",
            storage: "High (full text)"
        },
        {
            name: "Traces",
            icon: "🔍",
            color: "#a78bfa",
            question: "Where did it slow down?",
            data: "Request paths",
            example: "api→auth→db (db: 200ms)",
            tool: "Jaeger / Tempo",
            storage: "Medium (sampled)"
        },
    ];

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 20 }}>
                📡 Three Pillars of Observability
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {pillars.map(p => (
                    <div key={p.name} style={{
                        background: `${p.color}10`,
                        border: `1px solid ${p.color}40`,
                        borderRadius: 12,
                        padding: 16
                    }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: p.color }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, marginBottom: 4 }}>Question:</div>
                        <div style={{ fontSize: 12, color: "#e2e8f0" }}>{p.question}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, marginBottom: 4 }}>Example:</div>
                        <code style={{ fontSize: 11, color: p.color }}>{p.example}</code>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8, marginBottom: 4 }}>Tool:</div>
                        <div style={{ fontSize: 12, color: "#e2e8f0" }}>{p.tool}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PromQLExplorer() {
    const [selected, setSelected] = useState(0);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #422006 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(251, 146, 60, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fb923c", marginBottom: 20 }}>
                🔍 PromQL Query Examples
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {promqlExamples.map((ex, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: selected === i ? "1px solid #fb923c" : "1px solid #334155",
                            background: selected === i ? "rgba(251,146,60,0.2)" : "transparent",
                            color: selected === i ? "#fb923c" : "#64748b",
                            cursor: "pointer",
                            fontSize: 11
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <div style={{
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                padding: 16
            }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Query:</div>
                <code style={{
                    display: "block",
                    padding: 12,
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: 8,
                    color: "#fbbf24",
                    fontSize: 13,
                    fontFamily: "monospace"
                }}>
                    {promqlExamples[selected].query}
                </code>

                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 16, marginBottom: 8 }}>Meaning:</div>
                <div style={{ fontSize: 13, color: "#e2e8f0" }}>{promqlExamples[selected].desc}</div>

                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 16, marginBottom: 8 }}>Result:</div>
                <div style={{ fontSize: 13, color: "#4ade80", fontFamily: "monospace" }}>{promqlExamples[selected].result}</div>
            </div>
        </div>
    );
}

function AlertFlowAnimation() {
    const [step, setStep] = useState(0);
    const steps = [
        { phase: "Monitoring", icon: "👀", desc: "Prometheus evaluates rules every 15s", color: "#818cf8" },
        { phase: "Threshold Breach", icon: "⚠️", desc: "CPU > 90% detected", color: "#fbbf24" },
        { phase: "Pending", icon: "⏳", desc: "Waiting 5m (for: 5m) to confirm", color: "#fbbf24" },
        { phase: "Firing!", icon: "🔥", desc: "Alert sent to Alertmanager", color: "#f87171" },
        { phase: "Routing", icon: "🔀", desc: "Alertmanager routes by severity=critical", color: "#22d3ee" },
        { phase: "Notification", icon: "📟", desc: "PagerDuty page + Slack message sent", color: "#22c55e" },
    ];

    useEffect(() => {
        const timer = setInterval(() => setStep(s => (s + 1) % steps.length), 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #450a0a 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(248, 113, 113, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f87171", marginBottom: 20 }}>
                🚨 Alert Flow Animation
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                {steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: step >= i ? `${s.color}30` : "#1e293b",
                            border: `2px solid ${step >= i ? s.color : "#334155"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            boxShadow: step === i ? `0 0 20px ${s.color}50` : "none",
                            transition: "all 0.3s"
                        }}>
                            {s.icon}
                        </div>
                        <div style={{ fontSize: 10, color: step === i ? s.color : "#64748b", textAlign: "center" }}>
                            {s.phase}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                padding: 16,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                borderLeft: `4px solid ${steps[step].color}`,
                transition: "all 0.3s"
            }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: steps[step].color }}>
                    Step {step + 1}: {steps[step].phase}
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                    {steps[step].desc}
                </div>
            </div>
        </div>
    );
}

function MetricTypesReference() {
    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(34, 211, 238, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 20 }}>
                📊 Prometheus Metric Types
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {metricTypes.map((m, i) => (
                    <div key={i} style={{
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: 12,
                        padding: 16,
                        border: "1px solid rgba(34, 211, 238, 0.2)"
                    }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#22d3ee" }}>{m.type}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{m.desc}</div>
                        <div style={{ fontSize: 11, marginTop: 8 }}>
                            <span style={{ color: "#64748b" }}>Example: </span>
                            <code style={{ color: "#fbbf24" }}>{m.example}</code>
                        </div>
                        <div style={{ fontSize: 11, marginTop: 4 }}>
                            <span style={{ color: "#64748b" }}>Use for: </span>
                            <span style={{ color: "#4ade80" }}>{m.use}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TraceVisualization() {
    const spans = [
        { name: "GET /api/orders", duration: 523, depth: 0, color: "#8b5cf6", warning: false },
        { name: "api-gateway", duration: 12, depth: 1, color: "#22d3ee", warning: false },
        { name: "auth-service", duration: 45, depth: 2, color: "#22d3ee", warning: false },
        { name: "order-service", duration: 400, depth: 2, color: "#fbbf24", warning: true },
        { name: "database query", duration: 380, depth: 3, color: "#f87171", warning: true },
        { name: "serialize response", duration: 8, depth: 2, color: "#22d3ee", warning: false },
    ];

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 20 }}>
                🔍 Distributed Trace Visualization
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {spans.map((span, i) => (
                    <div key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        paddingLeft: span.depth * 24
                    }}>
                        <div style={{
                            width: `${(span.duration / 523) * 100}%`,
                            minWidth: 80,
                            maxWidth: 400,
                            height: 28,
                            background: `${span.color}30`,
                            border: `1px solid ${span.color}`,
                            borderRadius: 4,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 8px",
                            fontSize: 11
                        }}>
                            <span style={{ color: "#e2e8f0" }}>{span.name}</span>
                            <span style={{ color: span.warning ? "#f87171" : "#94a3b8" }}>
                                {span.duration}ms {span.warning && "⚠️"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: 20,
                padding: 12,
                background: "rgba(248, 113, 113, 0.1)",
                border: "1px solid rgba(248, 113, 113, 0.3)",
                borderRadius: 8,
                fontSize: 12,
                color: "#fca5a5"
            }}>
                💡 <strong>Insight:</strong> 73% of latency (380ms of 523ms) is in the database query.
                Optimize the query or add caching!
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
                background: "linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(251, 146, 60, 0.3)"
            }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fb923c", marginBottom: 16 }}>
                    📡 Welcome to Observability!
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8 }}>
                    <strong>Your apps are deployed. But can you see what's happening inside?</strong> Observability
                    lets you monitor health, detect problems, and debug issues. It's like having X-ray vision
                    into your running applications.
                </div>
            </div>

            {/* The 3 pillars */}
            <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 16 }}>
                    🏛️ The Three Pillars of Observability
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        {
                            pillar: "Metrics",
                            icon: "📊",
                            color: "#fb923c",
                            question: "What is happening?",
                            example: "CPU usage: 85%, Request rate: 1.2K/s, Error rate: 0.5%",
                            tool: "Prometheus + Grafana"
                        },
                        {
                            pillar: "Logs",
                            icon: "📜",
                            color: "#22c55e",
                            question: "Why did it happen?",
                            example: "2024-01-20 10:30:45 ERROR: Connection refused to database",
                            tool: "Loki + Grafana"
                        },
                        {
                            pillar: "Traces",
                            icon: "🔍",
                            color: "#a78bfa",
                            question: "Where is the problem?",
                            example: "Request took 2.3s: 50ms API → 2.2s database → 30ms response",
                            tool: "Jaeger + OpenTelemetry"
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
                                    <span style={{ color: item.color, fontWeight: 700, fontSize: 16 }}>{item.pillar}</span>
                                    <span style={{ color: "#64748b", fontSize: 13 }}> — {item.question}</span>
                                </div>
                            </div>
                            <div style={{ paddingLeft: 40, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                                <div style={{ marginBottom: 4 }}><strong>Example:</strong> {item.example}</div>
                                <div><strong>Tools:</strong> {item.tool}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hospital analogy */}
            <div style={{
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(251, 146, 60, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(34, 197, 94, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e", marginBottom: 16 }}>
                    🏥 Think of It Like a Hospital
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        {
                            k8s: "Prometheus",
                            analogy: "Patient monitoring equipment",
                            icon: "📊",
                            color: "#fb923c",
                            explain: "Constantly measures vital signs (metrics): heart rate, blood pressure, oxygen. Stores the history to spot trends."
                        },
                        {
                            k8s: "Grafana",
                            analogy: "The control room dashboard",
                            icon: "📈",
                            color: "#22c55e",
                            explain: "Big screens showing all patients' vitals at a glance. Doctors can instantly see who needs attention. Beautiful charts and graphs."
                        },
                        {
                            k8s: "Alertmanager",
                            analogy: "Nurse's pager system",
                            icon: "🚨",
                            color: "#f87171",
                            explain: "When vitals go critical, it pages the right doctor. Heart issue? Cardiologist. Network problem? On-call engineer on Slack/PagerDuty."
                        },
                        {
                            k8s: "OpenTelemetry",
                            analogy: "Universal medical adapter",
                            icon: "🔭",
                            color: "#818cf8",
                            explain: "Different hospitals use different equipment. OTel translates them all to a common format — any tool can read any data."
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
                background: "rgba(251, 146, 60, 0.1)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(251, 146, 60, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fb923c", marginBottom: 16 }}>
                    🎯 Key Takeaways
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        "Metrics = numbers over time (CPU, memory, request count)",
                        "Logs = text records of events (errors, warnings, info)",
                        "Traces = journey of a request across services",
                        "Prometheus collects metrics, Grafana visualizes them",
                        "Alertmanager sends notifications when things go wrong",
                        "OpenTelemetry standardizes all observability data",
                    ].map((point, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 10,
                            fontSize: 13,
                            color: "#fed7aa"
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
                background: "rgba(251, 146, 60, 0.1)",
                borderRadius: 12,
                border: "1px solid rgba(251, 146, 60, 0.3)"
            }}>
                <div style={{ fontSize: 16, color: "#fb923c", fontWeight: 600 }}>
                    👆 Explore the tabs to dive deeper!
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                    "📊 Prometheus" for metric collection • "🔍 PromQL" for queries • "🚨 Alerts" for notifications
                </div>
            </div>
        </div>
    );
}

export default function KubernetesObservabilityApp() {
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
                        <span>📡</span>
                        <span>Module 5 • Observability</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #fb923c 0%, #22d3ee 50%, #a78bfa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Observability Stack
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Metrics + Logs + Traces = Complete Visibility
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "start", label: "🚀 Start Here" },
                        { id: "pillars", label: "📡 3 Pillars" },
                        { id: "prometheus", label: "📊 Prometheus" },
                        { id: "promql", label: "🔍 PromQL" },
                        { id: "alerts", label: "🚨 Alerts" },
                        { id: "traces", label: "🔭 Traces" },
                        { id: "diagrams", label: "🗺️ Architecture" },
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

                {activeTab === "start" && <BeginnerIntro />}

                {activeTab === "pillars" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <ThreePillarsComparison />
                        <MermaidDiagram chart={diagrams.threePillars} title="Three Pillars Architecture" />
                    </div>
                )}

                {activeTab === "prometheus" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                            {concepts.slice(0, 2).map(c => (
                                <div key={c.id} style={{
                                    background: `${c.color}10`,
                                    border: `1px solid ${c.color}30`,
                                    borderRadius: 12,
                                    padding: 20
                                }}>
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.name}</div>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>{c.tagline}</div>
                                    <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5 }}>{c.what}</div>
                                </div>
                            ))}
                        </div>
                        <MetricTypesReference />
                        <MermaidDiagram chart={diagrams.prometheusArch} title="Prometheus Architecture" />
                    </div>
                )}

                {activeTab === "promql" && <PromQLExplorer />}

                {activeTab === "alerts" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <AlertFlowAnimation />
                        <MermaidDiagram chart={diagrams.alertFlow} title="Alert Flow" />
                    </div>
                )}

                {activeTab === "traces" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <TraceVisualization />
                        <MermaidDiagram chart={diagrams.traceExample} title="Trace Example" />
                        <MermaidDiagram chart={diagrams.otelFlow} title="OpenTelemetry Flow" />
                    </div>
                )}

                {activeTab === "diagrams" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <MermaidDiagram chart={diagrams.prometheusArch} title="Prometheus Architecture" />
                        <MermaidDiagram chart={diagrams.otelFlow} title="OpenTelemetry Flow" />
                        <MermaidDiagram chart={diagrams.metricsEndpoint} title="Metrics Endpoint" />
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
                        ✅ Module 5 Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now understand: Prometheus, Grafana, OpenTelemetry, Alerting
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 6 — CRDs & Operators (custom resources, operator pattern, control loop)
                    </div>
                </div>
            </div>
        </div>
    );
}
