import { MermaidDiagram } from "./MermaidDiagram";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// HELM DEEP-DIVE - Interactive Learning Guide (Task 4 of 8)
// Covers: Charts, Templates, Values, Install, Upgrade, Rollback
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    helmOverview: `
flowchart TB
    subgraph YOU["👤 YOU"]
        CMD["helm install my-app ./chart"]
    end
    
    subgraph HELM["⎈ HELM"]
        subgraph CHART["📦 CHART"]
            VALUES["🎛️ values.yaml<br/>━━━━━━━━━━<br/>replicas: 3<br/>image: nginx"]
            TEMPLATES["📄 templates/<br/>━━━━━━━━━━<br/>deployment.yaml<br/>service.yaml"]
        end
        
        RENDER["🔧 Template Engine<br/>Fill in {{ values }}"]
    end
    
    subgraph K8S["☸️ KUBERNETES"]
        API["API Server"]
        RESOURCES["Deployment<br/>Service<br/>ConfigMap"]
    end
    
    subgraph STORAGE["💾 RELEASE HISTORY"]
        R1["Revision 1"]
        R2["Revision 2"]
        R3["Revision 3"]
    end
    
    CMD --> HELM
    VALUES --> RENDER
    TEMPLATES --> RENDER
    RENDER -->|"complete YAML"| API
    API --> RESOURCES
    HELM --> STORAGE
    
    style HELM fill:#0f172a,stroke:#8b5cf6,stroke-width:2px
    style CHART fill:#312e81,stroke:#818cf8
    style K8S fill:#064e3b,stroke:#34d399
    style STORAGE fill:#422006,stroke:#fbbf24
`,

    chartStructure: `
flowchart TB
    subgraph CHART["📦 my-app/ (Helm Chart)"]
        CHART_YAML["📄 Chart.yaml<br/>━━━━━━━━━━━━<br/>name: my-app<br/>version: 1.2.0<br/>appVersion: 2.0.0"]
        
        VALUES["🎛️ values.yaml<br/>━━━━━━━━━━━━<br/>replicas: 2<br/>image:<br/>  repository: nginx<br/>  tag: latest"]
        
        subgraph TEMPLATES["📁 templates/"]
            DEPLOY["deployment.yaml"]
            SVC["service.yaml"]
            CM["configmap.yaml"]
            ING["ingress.yaml"]
            HELPERS["_helpers.tpl"]
        end
        
        subgraph OPTIONAL["Optional files"]
            NOTES["NOTES.txt"]
            CRDS["crds/"]
            CHARTS["charts/"]
        end
    end
    
    style CHART fill:#0f172a,stroke:#8b5cf6,stroke-width:3px
    style TEMPLATES fill:#312e81,stroke:#818cf8
    style OPTIONAL fill:#1e293b,stroke:#475569
`,

    templateFlow: `
flowchart LR
    subgraph INPUT["Inputs"]
        VALUES["🎛️ values.yaml<br/>replicas: 3"]
        OVERRIDE["--set replicas=5"]
        FILE["🧾 -f prod.yaml<br/>replicas: 10"]
    end
    
    subgraph MERGE["Merge Priority"]
        FINAL["Final values:<br/>replicas: 10<br/>━━━━━━━━━━<br/>3️⃣ -f file (highest)<br/>2️⃣ --set<br/>1️⃣ values.yaml"]
    end
    
    subgraph TEMPLATE["📄 deployment.yaml"]
        BEFORE["replicas: {{ .Values.replicas }}"]
    end
    
    subgraph OUTPUT["Rendered Output"]
        AFTER["replicas: 10"]
    end
    
    VALUES --> MERGE
    OVERRIDE --> MERGE
    FILE --> MERGE
    MERGE --> TEMPLATE
    TEMPLATE --> OUTPUT
    
    style INPUT fill:#1e1b4b,stroke:#a78bfa
    style MERGE fill:#164e63,stroke:#22d3ee
    style OUTPUT fill:#052e16,stroke:#22c55e
`,

    releaseLifecycle: `
flowchart LR
    subgraph INSTALL["helm install"]
        I_DESC["Creates Release<br/>Revision 1"]
    end
    
    subgraph UPGRADE["helm upgrade"]
        U_DESC["Updates Release<br/>Creates new Revision"]
    end
    
    subgraph ROLLBACK["helm rollback"]
        R_DESC["Reverts to<br/>previous Revision"]
    end
    
    subgraph UNINSTALL["helm uninstall"]
        D_DESC["Deletes Release<br/>& all resources"]
    end
    
    INSTALL -->|"change values"| UPGRADE
    UPGRADE -->|"broken?"| ROLLBACK
    ROLLBACK -->|"fixed"| UPGRADE
    UPGRADE -->|"done"| UNINSTALL
    
    style INSTALL fill:#052e16,stroke:#22c55e
    style UPGRADE fill:#0c4a6e,stroke:#38bdf8
    style ROLLBACK fill:#7c2d12,stroke:#fb923c
    style UNINSTALL fill:#450a0a,stroke:#f87171
`,

    rollbackProcess: `
flowchart TB
    subgraph HISTORY["Release History"]
        R1["📦 Revision 1<br/>image: v1.0<br/>replicas: 2"]
        R2["📦 Revision 2<br/>image: v1.1<br/>replicas: 3"]
        R3["📦 Revision 3<br/>image: v2.0 💀<br/>replicas: 3<br/>(broken!)"]
    end
    
    subgraph CURRENT["Current State"]
        BROKEN["❌ v2.0 is broken!<br/>Errors everywhere"]
    end
    
    subgraph ROLLBACK["helm rollback my-app 2"]
        REVERT["Reverts to Revision 2<br/>━━━━━━━━━━━━━━━<br/>Creates Revision 4<br/>(copy of Rev 2)"]
    end
    
    subgraph FIXED["After Rollback"]
        WORKING["✅ v1.1 is back!<br/>Everything works"]
    end
    
    R1 --> R2 --> R3
    R3 --> CURRENT
    CURRENT --> ROLLBACK
    ROLLBACK --> FIXED
    
    style R3 fill:#450a0a,stroke:#f87171
    style CURRENT fill:#450a0a,stroke:#f87171
    style ROLLBACK fill:#422006,stroke:#fbbf24
    style FIXED fill:#052e16,stroke:#22c55e
`,

    valuesHierarchy: `
flowchart TB
    subgraph PRIORITY["Values Priority (lowest to highest)"]
        P1["1️⃣ Parent chart values.yaml"]
        P2["2️⃣ Subchart values.yaml"]
        P3["3️⃣ Your chart values.yaml"]
        P4["4️⃣ -f / --values file"]
        P5["5️⃣ --set flag"]
        P6["6️⃣ --set-string flag"]
    end
    
    P1 --> P2 --> P3 --> P4 --> P5 --> P6
    
    WINNER["🏆 Highest priority wins!"]
    P6 --> WINNER
    
    style P1 fill:#1e293b,stroke:#475569
    style P2 fill:#1e293b,stroke:#64748b
    style P3 fill:#312e81,stroke:#818cf8
    style P4 fill:#164e63,stroke:#22d3ee
    style P5 fill:#065f46,stroke:#34d399
    style P6 fill:#052e16,stroke:#22c55e
    style WINNER fill:#052e16,stroke:#4ade80,stroke-width:3px
`
};

const concepts = [
    {
        id: "chart",
        icon: "📦",
        name: "Helm Chart",
        tagline: "IKEA Flat-Pack",
        color: "#a78bfa",
        what: "A Chart is a package containing all resource definitions needed to run an application. It's a folder with templates (YAML with placeholders), default values, and metadata. Charts can be shared via repositories like Docker images.",
        why: "You could write 10 separate YAML files for each app. Or you could create ONE chart that works everywhere with different values. Charts are reusable, shareable, and version-controlled.",
        analogy: "IKEA furniture box. Inside: assembly instructions (templates), default screws/parts (values.yaml), and a product label (Chart.yaml). You can customize: 'Use black paint instead of white' (override values).",
    },
    {
        id: "template",
        icon: "📄",
        name: "Templates",
        tagline: "Fill-in-the-Blanks",
        color: "#22d3ee",
        what: "Templates are Kubernetes YAML files with Go template placeholders like {{ .Values.replicas }}. Helm fills in these blanks using values from values.yaml and command-line overrides.",
        why: "Hardcoding values means creating separate files for dev/staging/prod. Templates let you write ONCE and customize with different values files. One deployment.yaml works for all environments.",
        analogy: "A form letter: 'Dear {{ .Name }}, Your order {{ .OrderID }} ships on {{ .Date }}.' Same template, different values = different letters. No need to write each letter from scratch.",
    },
    {
        id: "values",
        icon: "🎛️",
        name: "Values",
        tagline: "Control Panel",
        color: "#f59e0b",
        what: "values.yaml is the default configuration shipped with a chart. You can override any value using -f (another file) or --set (command line). Higher priority sources win when values conflict.",
        why: "Separation of config from code. Chart authors set sensible defaults, you override what's different. 'Default: 2 replicas, but production uses 10.' No chart modification needed.",
        analogy: "Default thermostat settings in your new apartment. The building sets it to 70°F (defaults). You can adjust it to 65°F (override). The override wins — you're in control.",
    },
    {
        id: "release",
        icon: "🚀",
        name: "Release",
        tagline: "Installed Instance",
        color: "#22c55e",
        what: "A Release is an installed instance of a chart. When you run 'helm install my-app ./chart', you create a release named 'my-app'. You can have multiple releases of the same chart (different names).",
        why: "Track what's deployed and when. Releases have revision history — every upgrade creates a new revision. If v3 breaks, rollback to v2 instantly. Full deployment history.",
        analogy: "A photo album of your room renovations. Revision 1: original layout. Revision 2: new couch. Revision 3: painted walls (ugly). Rollback to Revision 2: couch stays, wall paint gone.",
    }
];

const templateSyntax = [
    { syntax: "{{ .Values.key }}", desc: "Access value from values.yaml", example: "{{ .Values.replicas }} → 3" },
    { syntax: "{{ .Release.Name }}", desc: "Name of the release", example: "my-app" },
    { syntax: "{{ .Chart.Name }}", desc: "Chart name from Chart.yaml", example: "nginx" },
    { syntax: "{{ .Release.Namespace }}", desc: "Namespace being deployed to", example: "production" },
    { syntax: "{{ include \"helper\" . }}", desc: "Include a named template", example: "{{ include \"app.fullname\" . }}" },
    { syntax: "{{- if .Values.enabled }}", desc: "Conditional block", example: "Only render if enabled: true" },
    { syntax: "{{- range .Values.list }}", desc: "Loop over a list", example: "Create resource for each item" },
    { syntax: "{{ .Values.x | default \"val\" }}", desc: "Default value if not set", example: "Fallback to \"val\"" },
    { syntax: "{{ .Values.x | quote }}", desc: "Wrap in quotes", example: "\"my-value\"" },
    { syntax: "{{ toYaml .Values.x | indent 2 }}", desc: "Convert & indent YAML", example: "Nested structures" },
];

const helmCommands = [
    {
        category: "Install & Upgrade", commands: [
            { cmd: "helm install my-release ./my-chart", desc: "Install chart from local folder" },
            { cmd: "helm install my-release repo/chart", desc: "Install from repository" },
            { cmd: "helm install my-release ./chart -f values-prod.yaml", desc: "With custom values file" },
            { cmd: "helm install my-release ./chart --set replicas=5", desc: "Override single value" },
            { cmd: "helm upgrade my-release ./chart", desc: "Upgrade existing release" },
            { cmd: "helm upgrade --install my-release ./chart", desc: "Install or upgrade" },
        ]
    },
    {
        category: "Inspect & Debug", commands: [
            { cmd: "helm list", desc: "List all releases" },
            { cmd: "helm status my-release", desc: "Show release status" },
            { cmd: "helm history my-release", desc: "Show revision history" },
            { cmd: "helm get values my-release", desc: "Show current values" },
            { cmd: "helm template ./chart", desc: "Render templates locally (no install)" },
            { cmd: "helm template ./chart --debug", desc: "Render with debug info" },
        ]
    },
    {
        category: "Rollback & Cleanup", commands: [
            { cmd: "helm rollback my-release 2", desc: "Rollback to revision 2" },
            { cmd: "helm uninstall my-release", desc: "Delete release and resources" },
            { cmd: "helm uninstall my-release --keep-history", desc: "Delete but keep history" },
        ]
    },
    {
        category: "Repository", commands: [
            { cmd: "helm repo add bitnami https://charts.bitnami.com/bitnami", desc: "Add chart repo" },
            { cmd: "helm repo update", desc: "Update repo index" },
            { cmd: "helm search repo nginx", desc: "Search for charts" },
            { cmd: "helm pull bitnami/nginx --untar", desc: "Download chart locally" },
        ]
    },
];

// MermaidDiagram is imported from shared component above

function TemplateDemo() {
    const [values, setValues] = useState({ replicas: 3, image: "nginx", tag: "1.21" });

    const template = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
spec:
  replicas: {{ .Values.replicas }}
  template:
    spec:
      containers:
      - name: app
        image: {{ .Values.image }}:{{ .Values.tag }}`;

    const rendered = template
        .replace("{{ .Release.Name }}", "my-release")
        .replace("{{ .Values.replicas }}", values.replicas)
        .replace("{{ .Values.image }}", values.image)
        .replace("{{ .Values.tag }}", values.tag);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(34, 211, 238, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 20 }}>
                🔧 Live Template Rendering
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Values Input */}
                <div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
                        🎛️ values.yaml (edit these!)
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {Object.entries(values).map(([key, value]) => (
                            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <label style={{ color: "#67e8f9", fontSize: 13, width: 80, fontFamily: "monospace" }}>
                                    {key}:
                                </label>
                                <input
                                    type={typeof value === "number" ? "number" : "text"}
                                    value={value}
                                    onChange={(e) => setValues({
                                        ...values,
                                        [key]: typeof value === "number" ? parseInt(e.target.value) || 0 : e.target.value
                                    })}
                                    style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        borderRadius: 6,
                                        border: "1px solid #22d3ee40",
                                        background: "rgba(0,0,0,0.3)",
                                        color: "#e2e8f0",
                                        fontSize: 13,
                                        fontFamily: "monospace"
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rendered Output */}
                <div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>
                        ✅ Rendered YAML (output)
                    </div>
                    <pre style={{
                        background: "rgba(0,0,0,0.4)",
                        padding: 16,
                        borderRadius: 12,
                        fontSize: 12,
                        lineHeight: 1.6,
                        color: "#4ade80",
                        fontFamily: "monospace",
                        margin: 0,
                        overflow: "auto"
                    }}>
                        {rendered}
                    </pre>
                </div>
            </div>
        </div>
    );
}

function ReleaseLifecycleDemo() {
    const [step, setStep] = useState(0);
    const steps = [
        { action: "helm install", icon: "📦", revision: 1, status: "deployed", values: "replicas: 2, image: v1.0", color: "#22c55e" },
        { action: "helm upgrade", icon: "⬆️", revision: 2, status: "deployed", values: "replicas: 3, image: v1.1", color: "#38bdf8" },
        { action: "helm upgrade", icon: "⬆️", revision: 3, status: "deployed", values: "replicas: 3, image: v2.0", color: "#38bdf8" },
        { action: "💥 Bug found!", icon: "🐛", revision: 3, status: "broken", values: "v2.0 is crashing!", color: "#f87171" },
        { action: "helm rollback 2", icon: "⏪", revision: 4, status: "deployed", values: "replicas: 3, image: v1.1 (restored)", color: "#fbbf24" },
    ];

    useEffect(() => {
        const timer = setInterval(() => setStep(s => (s + 1) % steps.length), 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #052e16 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(34, 197, 94, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e", marginBottom: 20 }}>
                🚀 Release Lifecycle Animation
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                {steps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setStep(i)}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            border: step === i ? `2px solid ${s.color}` : "1px solid #334155",
                            background: step === i ? `${s.color}30` : "transparent",
                            color: step === i ? s.color : "#64748b",
                            fontSize: 14,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
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
                borderLeft: `4px solid ${steps[step].color}`,
                transition: "all 0.3s"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: steps[step].color }}>
                        {steps[step].action}
                    </div>
                    <div style={{
                        padding: "4px 12px",
                        borderRadius: 12,
                        background: steps[step].status === "broken" ? "#450a0a" : "#052e16",
                        color: steps[step].status === "broken" ? "#f87171" : "#4ade80",
                        fontSize: 12,
                        fontWeight: 600
                    }}>
                        {steps[step].status === "broken" ? "❌ BROKEN" : `✅ Revision ${steps[step].revision}`}
                    </div>
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8", fontFamily: "monospace" }}>
                    {steps[step].values}
                </div>
            </div>

            {/* History Bar */}
            <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
                {[1, 2, 3, 4].filter(r => r <= steps[step].revision || (step === 4 && r === 4)).map(rev => (
                    <div key={rev} style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 8,
                        background: rev === steps[step].revision ? `${steps[step].color}20` : "rgba(0,0,0,0.2)",
                        border: `1px solid ${rev === steps[step].revision ? steps[step].color : "#334155"}`,
                        textAlign: "center",
                        fontSize: 11,
                        color: rev === steps[step].revision ? steps[step].color : "#64748b"
                    }}>
                        Rev {rev}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChartStructureExplorer() {
    const [selected, setSelected] = useState("Chart.yaml");

    const files = {
        "Chart.yaml": {
            desc: "Chart metadata — name, version, description",
            content: `apiVersion: v2
name: my-app
version: 1.2.0
appVersion: "2.0.0"
description: My awesome application
type: application
dependencies:
  - name: postgresql
    version: 12.x.x
    repository: https://charts.bitnami.com/bitnami`
        },
        "values.yaml": {
            desc: "Default configuration values",
            content: `replicas: 2

image:
  repository: my-app
  tag: latest
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

resources:
  limits:
    cpu: 100m
    memory: 128Mi`
        },
        "deployment.yaml": {
            desc: "Template with placeholders",
            content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "my-app.fullname" . }}
spec:
  replicas: {{ .Values.replicas }}
  selector:
    matchLabels:
      app: {{ include "my-app.name" . }}
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        ports:
        - containerPort: 80`
        },
        "_helpers.tpl": {
            desc: "Reusable template snippets",
            content: `{{/*
Expand the name of the chart.
*/}}
{{- define "my-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a fully qualified app name.
*/}}
{{- define "my-app.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}`
        }
    };

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 20 }}>
                📁 Chart Structure Explorer
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
                {/* File Tree */}
                <div style={{
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: 12,
                    padding: 12,
                    fontFamily: "monospace",
                    fontSize: 13
                }}>
                    <div style={{ color: "#a78bfa", marginBottom: 8 }}>📦 my-app/</div>
                    {Object.keys(files).map(file => (
                        <div
                            key={file}
                            onClick={() => setSelected(file)}
                            style={{
                                padding: "6px 12px",
                                marginLeft: 12,
                                borderRadius: 6,
                                cursor: "pointer",
                                background: selected === file ? "rgba(139,92,246,0.2)" : "transparent",
                                color: selected === file ? "#a78bfa" : "#94a3b8",
                                transition: "all 0.2s"
                            }}
                        >
                            {file.endsWith(".tpl") ? "📝" : "📄"} {file}
                        </div>
                    ))}
                </div>

                {/* File Content */}
                <div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
                        {files[selected].desc}
                    </div>
                    <pre style={{
                        background: "rgba(0,0,0,0.4)",
                        padding: 16,
                        borderRadius: 12,
                        fontSize: 12,
                        lineHeight: 1.5,
                        color: "#e2e8f0",
                        fontFamily: "monospace",
                        margin: 0,
                        overflow: "auto",
                        maxHeight: 300
                    }}>
                        {files[selected].content}
                    </pre>
                </div>
            </div>
        </div>
    );
}

function TemplateSyntaxReference() {
    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(34, 211, 238, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 20 }}>
                📝 Template Syntax Quick Reference
            </div>

            <div style={{ display: "grid", gap: 8 }}>
                {templateSyntax.map((item, i) => (
                    <div key={i} style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 16,
                        padding: 12,
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: 8
                    }}>
                        <code style={{ color: "#67e8f9", fontSize: 12 }}>{item.syntax}</code>
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>{item.desc}</span>
                        <span style={{ color: "#4ade80", fontSize: 11, fontFamily: "monospace" }}>{item.example}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CommandsReference() {
    const [category, setCategory] = useState(helmCommands[0].category);
    const current = helmCommands.find(c => c.category === category);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 20 }}>
                ⌨️ Helm Commands Reference
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {helmCommands.map(c => (
                    <button
                        key={c.category}
                        onClick={() => setCategory(c.category)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: category === c.category ? "1px solid #a78bfa" : "1px solid #334155",
                            background: category === c.category ? "rgba(139,92,246,0.2)" : "transparent",
                            color: category === c.category ? "#a78bfa" : "#64748b",
                            cursor: "pointer",
                            fontSize: 13
                        }}
                    >
                        {c.category}
                    </button>
                ))}
            </div>

            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12, overflow: "hidden" }}>
                {current.commands.map((cmd, i) => (
                    <div key={i} style={{
                        padding: "12px 16px",
                        borderBottom: i < current.commands.length - 1 ? "1px solid #1e293b" : "none",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 16
                    }}>
                        <code style={{ color: "#67e8f9", fontSize: 12 }}>{cmd.cmd}</code>
                        <span style={{ color: "#64748b", fontSize: 11 }}>{cmd.desc}</span>
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
                background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(139, 92, 246, 0.3)"
            }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#a78bfa", marginBottom: 16 }}>
                    ⎈ Welcome to Helm!
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8 }}>
                    <strong>Helm is the package manager for Kubernetes.</strong> Just like you use <code>apt</code> or
                    <code>brew</code> to install software, Helm lets you install, upgrade, and manage Kubernetes
                    applications with a single command. No more writing 500 lines of YAML manually!
                </div>
            </div>

            {/* The problem Helm solves */}
            <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f87171", marginBottom: 16 }}>
                    😫 Without Helm
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                    {[
                        "Write 10+ YAML files for one app (Deployment, Service, ConfigMap, Secret, etc.)",
                        "Manually edit YAML every time you need different settings for dev/staging/prod",
                        "No easy way to upgrade or rollback your app",
                        "Repeat this for every single application!",
                    ].map((item, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 12,
                            fontSize: 13,
                            color: "#fca5a5"
                        }}>
                            <span style={{ fontSize: 16 }}>❌</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
                <div style={{
                    padding: 16,
                    background: "rgba(34, 197, 94, 0.1)",
                    borderRadius: 12,
                    borderLeft: "4px solid #22c55e"
                }}>
                    <div style={{ color: "#22c55e", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                        ✅ With Helm
                    </div>
                    <div style={{ color: "#86efac", fontSize: 13, lineHeight: 1.6 }}>
                        <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>helm install my-app ./chart</code>
                        — One command to deploy your entire application. Change values for different environments.
                        Upgrade with <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>helm upgrade</code>,
                        rollback with <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>helm rollback</code>.
                    </div>
                </div>
            </div>

            {/* Key concepts with IKEA analogy */}
            <div style={{
                background: "linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(34, 211, 238, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 16 }}>
                    📦 Think of It Like IKEA Furniture
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                        {
                            k8s: "Helm Chart",
                            analogy: "IKEA flat-pack box",
                            icon: "📦",
                            color: "#a78bfa",
                            explain: "Contains everything you need: instructions (templates), default parts (values.yaml), and a label (Chart.yaml). Just add your preferences!"
                        },
                        {
                            k8s: "Templates",
                            analogy: "The assembly instructions",
                            icon: "📄",
                            color: "#22d3ee",
                            explain: "Step-by-step guide with blanks: 'Use {{ .Values.color }} paint.' Same instructions, different choices = different results."
                        },
                        {
                            k8s: "Values",
                            analogy: "Your personal choices",
                            icon: "🎛️",
                            color: "#f59e0b",
                            explain: "Default: oak color. You say: 'I want walnut.' Your choice overrides the default. Different values = different final product."
                        },
                        {
                            k8s: "Release",
                            analogy: "Your assembled furniture",
                            icon: "🚀",
                            color: "#22c55e",
                            explain: "The actual furniture in your room. Each build is tracked as a 'revision.' Don't like the new cushions? Rollback to the old ones!"
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
                background: "rgba(139, 92, 246, 0.1)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(139, 92, 246, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 16 }}>
                    🎯 Key Takeaways
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        "Chart = A package containing templates + default values",
                        "Templates = Kubernetes YAML with {{ placeholders }}",
                        "Values = Override defaults for different environments",
                        "Release = An installed instance of a chart (with revision history)",
                        "helm install → deploy, helm upgrade → update, helm rollback → undo",
                    ].map((point, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 10,
                            fontSize: 13,
                            color: "#c4b5fd"
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
                    👆 Explore the tabs to learn more!
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                    "📁 Structure" to see chart anatomy • "🔧 Template Demo" for live templating • "🚀 Lifecycle" for install/upgrade/rollback
                </div>
            </div>
        </div>
    );
}

export default function HelmDeepDiveApp() {
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
                background: "radial-gradient(ellipse at top, rgba(139,92,246,0.08) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
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
                        <span>⎈</span>
                        <span>Module 4 • Helm</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #a78bfa 0%, #22d3ee 50%, #22c55e 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Helm Deep-Dive
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Charts → Templates → Values → Install → Upgrade → Rollback
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "start", label: "🚀 Start Here" },
                        { id: "overview", label: "🗺️ Overview" },
                        { id: "structure", label: "📁 Structure" },
                        { id: "template", label: "🔧 Template Demo" },
                        { id: "syntax", label: "📝 Syntax" },
                        { id: "lifecycle", label: "🚀 Lifecycle" },
                        { id: "commands", label: "⌨️ Commands" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 16px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? "1px solid #a78bfa60" : "1px solid #1e293b",
                                background: activeTab === tab.id ? "rgba(139,92,246,0.1)" : "transparent",
                                color: activeTab === tab.id ? "#a78bfa" : "#64748b",
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

                {activeTab === "overview" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <MermaidDiagram chart={diagrams.helmOverview} title="Helm Architecture" />

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                            {concepts.map(c => (
                                <div key={c.id} style={{
                                    background: `linear-gradient(135deg, ${c.color}10 0%, transparent 100%)`,
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
                    </div>
                )}

                {activeTab === "structure" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <ChartStructureExplorer />
                        <MermaidDiagram chart={diagrams.chartStructure} title="Chart File Structure" />
                    </div>
                )}

                {activeTab === "template" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <TemplateDemo />
                        <MermaidDiagram chart={diagrams.templateFlow} title="Values Override Priority" />
                    </div>
                )}

                {activeTab === "syntax" && <TemplateSyntaxReference />}

                {activeTab === "lifecycle" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <ReleaseLifecycleDemo />
                        <MermaidDiagram chart={diagrams.releaseLifecycle} title="Release Lifecycle" />
                        <MermaidDiagram chart={diagrams.rollbackProcess} title="Rollback Process" />
                    </div>
                )}

                {activeTab === "commands" && <CommandsReference />}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(139,92,246,0.05)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#a78bfa", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Module 4 Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now understand: Charts, Templates, Values, Install, Upgrade, Rollback
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 5 — Observability (Prometheus, Grafana, OpenTelemetry, Alerts)
                    </div>
                </div>
            </div>
        </div>
    );
}
