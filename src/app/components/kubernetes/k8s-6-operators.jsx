import { MermaidDiagram } from "./MermaidDiagram";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES CRDs & OPERATORS - Interactive Learning Guide (Task 6 of 8)
// Covers: Custom Resources, CRDs, Operators, Control Loop
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    crdConcept: `
flowchart TB
    subgraph BUILTIN["🏗️ BUILT-IN RESOURCES"]
        POD["Pod"]
        DEPLOY["Deployment"]
        SVC["Service"]
        CM["ConfigMap"]
    end
    
    subgraph CRD["📐 YOUR CUSTOM RESOURCES"]
        DB["Database"]
        CACHE["RedisCluster"]
        CERT["Certificate"]
        BACKUP["Backup"]
    end
    
    API["☸️ Kubernetes API<br/>━━━━━━━━━━━━━━<br/>Treats ALL resources<br/>the same way!"]
    
    BUILTIN --> API
    CRD --> API
    
    KUBECTL["kubectl get databases<br/>kubectl apply -f db.yaml<br/>kubectl describe database my-db"]
    
    API --> KUBECTL
    
    style BUILTIN fill:#0e7490,stroke:#22d3ee
    style CRD fill:#7c2d12,stroke:#fb923c,stroke-width:2px
    style API fill:#1e1b4b,stroke:#a78bfa
`,

    operatorPattern: `
flowchart TB
    subgraph HUMAN["👤 Without Operator"]
        H1["1. Create StatefulSet"]
        H2["2. Create ConfigMap"]
        H3["3. Create Service"]
        H4["4. Monitor health"]
        H5["5. Handle failures"]
        H6["6. Scale manually"]
        H7["7. Backup data"]
        H8["❌ Repeat for every DB!"]
        
        H1 --> H2 --> H3 --> H4 --> H5 --> H6 --> H7 --> H8
    end
    
    subgraph OPERATOR["🤖 WITH OPERATOR"]
        O1["1. Apply Database YAML"]
        O2["✅ Operator does the rest!"]
        
        O1 --> O2
    end
    
    style HUMAN fill:#450a0a,stroke:#f87171
    style OPERATOR fill:#052e16,stroke:#22c55e,stroke-width:2px
`,

    controlLoop: `
flowchart TB
    subgraph LOOP["🔁 RECONCILIATION LOOP (runs forever)"]
        OBSERVE["👀 OBSERVE<br/>━━━━━━━━━━━<br/>Watch for changes<br/>Read current state"]
        
        DIFF["🔍 DIFF<br/>━━━━━━━━━━━<br/>Compare desired vs actual<br/>What's different?"]
        
        ACT["🔧 ACT<br/>━━━━━━━━━━━<br/>Create/Update/Delete<br/>Make actual = desired"]
    end
    
    OBSERVE --> DIFF
    DIFF --> ACT
    ACT -->|"loop back"| OBSERVE
    
    DESIRED["📋 Desired State<br/>━━━━━━━━━━━━<br/>spec:<br/>  replicas: 3<br/>  version: 5.7"]
    
    ACTUAL["📊 Actual State<br/>━━━━━━━━━━━━<br/>Running:<br/>  replicas: 2 ❌<br/>  version: 5.7 ✅"]
    
    DESIRED --> DIFF
    ACTUAL --> DIFF
    
    style LOOP fill:#0f172a,stroke:#8b5cf6,stroke-width:2px
    style OBSERVE fill:#0c4a6e,stroke:#38bdf8
    style DIFF fill:#422006,stroke:#fbbf24
    style ACT fill:#052e16,stroke:#22c55e
`,

    operatorArchitecture: `
flowchart TB
    subgraph CLUSTER["☸️ KUBERNETES CLUSTER"]
        subgraph CTRL["🤖 OPERATOR POD"]
            CTRL_MGR["Controller Manager<br/>━━━━━━━━━━━━<br/>Watches CRs<br/>Runs reconcile loop"]
        end
        
        subgraph CRS["Custom Resources"]
            CR1["Database: prod-db<br/>spec: replicas=3"]
            CR2["Database: staging-db<br/>spec: replicas=1"]
        end
        
        subgraph MANAGED["Managed Resources"]
            STS["StatefulSet"]
            PVC["PersistentVolumeClaim"]
            SVC["Service"]
            CM["ConfigMap"]
        end
    end
    
    CR1 -->|"reconcile"| CTRL_MGR
    CR2 -->|"reconcile"| CTRL_MGR
    CTRL_MGR -->|"creates/updates"| STS
    CTRL_MGR -->|"creates/updates"| PVC
    CTRL_MGR -->|"creates/updates"| SVC
    CTRL_MGR -->|"creates/updates"| CM
    
    style CTRL fill:#312e81,stroke:#818cf8,stroke-width:2px
    style CRS fill:#7c2d12,stroke:#fb923c
    style MANAGED fill:#0e7490,stroke:#22d3ee
`,

    crdStructure: `
flowchart TB
    subgraph CRD["📐 CustomResourceDefinition"]
        META["metadata:<br/>  name: databases.example.com"]
        
        SPEC["spec:<br/>  group: example.com<br/>  names:<br/>    kind: Database<br/>    plural: databases<br/>    singular: database"]
        
        VERSIONS["versions:<br/>  - name: v1<br/>    schema:<br/>      openAPIV3Schema:<br/>        properties:<br/>          replicas: integer<br/>          version: string"]
    end
    
    subgraph CR["📄 Custom Resource (Instance)"]
        CR_META["apiVersion: example.com/v1<br/>kind: Database<br/>metadata:<br/>  name: my-database"]
        
        CR_SPEC["spec:<br/>  replicas: 3<br/>  version: '5.7'"]
        
        CR_STATUS["status:<br/>  ready: true<br/>  pods: 3/3"]
    end
    
    CRD -->|"defines schema for"| CR
    
    style CRD fill:#422006,stroke:#fbbf24,stroke-width:2px
    style CR fill:#052e16,stroke:#22c55e
`,

    realWorldOperators: `
flowchart TB
    subgraph EXAMPLES["🌟 Popular Operators"]
        subgraph DB["Databases"]
            POSTGRES["PostgreSQL Operator<br/>━━━━━━━━━━━━━━<br/>HA clusters<br/>Backups, Failover"]
            MYSQL["MySQL Operator<br/>━━━━━━━━━━━━━━<br/>InnoDB Cluster<br/>Auto-recovery"]
        end
        
        subgraph INFRA["Infrastructure"]
            CERT["cert-manager<br/>━━━━━━━━━━━━━━<br/>TLS certificates<br/>Auto-renewal"]
            ARGO["ArgoCD<br/>━━━━━━━━━━━━━━<br/>GitOps<br/>Deployments"]
        end
        
        subgraph DATA["Data"]
            KAFKA["Strimzi (Kafka)<br/>━━━━━━━━━━━━━━<br/>Kafka clusters<br/>Topics, Users"]
            ELASTIC["ECK (Elastic)<br/>━━━━━━━━━━━━━━<br/>Elasticsearch<br/>Kibana"]
        end
    end
    
    style DB fill:#0e7490,stroke:#22d3ee
    style INFRA fill:#7c2d12,stroke:#fb923c
    style DATA fill:#312e81,stroke:#818cf8
`
};

const concepts = [
    {
        id: "crd",
        icon: "📐",
        name: "Custom Resource Definition (CRD)",
        tagline: "Blueprint/Schema",
        color: "#fbbf24",
        what: "A CRD is a schema that tells Kubernetes about a new type of resource. It defines the structure: what fields exist, their types, validation rules. Once registered, Kubernetes API accepts these resources like built-in ones.",
        why: "Built-in resources (Pod, Service) are generic. Your domain has specific concepts: Database, Certificate, Backup, RedisCluster. CRDs let you model YOUR domain in Kubernetes.",
        analogy: "A building permit application form. The city (Kubernetes) has standard forms: residential, commercial. You submit a new form TYPE (CRD) for 'data center'. Once approved, anyone can fill out data center applications using your template.",
    },
    {
        id: "cr",
        icon: "📄",
        name: "Custom Resource (CR)",
        tagline: "Instance of CRD",
        color: "#22c55e",
        what: "A CR is an actual instance of a CRD — like an object of a class. If CRD defines 'Database', a CR is 'prod-mysql-db'. CRs live in Kubernetes like any other resource: you can kubectl get, describe, delete them.",
        why: "CRs are how users interact with your system. They create a Database CR and expect a database. The CR is the 'desired state' that your operator will reconcile.",
        analogy: "A filled-out permit application. The form (CRD) defines fields. The application (CR) has actual values: 'Build a 3-story data center on 123 Main St.' Now someone needs to actually BUILD it...",
    },
    {
        id: "operator",
        icon: "🤖",
        name: "Operator",
        tagline: "Automated Admin",
        color: "#a78bfa",
        what: "An Operator is a controller that watches Custom Resources and takes action. It's code running in a pod that implements domain-specific logic: 'When a Database CR is created, spin up a StatefulSet, ConfigMap, Service, and set up replication.'",
        why: "CRs are just data without an operator. Operators encode human operational knowledge in software. A DBA knows how to set up MySQL replication — the operator knows the same, runs 24/7.",
        analogy: "An automated construction crew. The permit (CR) arrives. The crew (Operator) reads the spec and builds exactly what's needed. If something breaks, they fix it automatically. No human needed for routine work.",
    },
    {
        id: "reconcile",
        icon: "🔁",
        name: "Reconciliation Loop",
        tagline: "Make Actual = Desired",
        color: "#22d3ee",
        what: "The core operator pattern: continuously compare desired state (CR spec) with actual state (what's running), and take action to close the gap. If desired is 3 replicas and actual is 2, create 1 more.",
        why: "The world is messy: pods crash, nodes fail, humans delete things. Reconciliation makes the system self-healing. You don't fix problems — you declare what you want and the operator maintains it.",
        analogy: "A thermostat. You set 70°F (desired). It measures 65°F (actual). It turns on heat (action). Checks again. 70°F (actual = desired). Stops. Room cools to 68°F. Heat on again. Forever.",
    },
];

const operatorExamples = [
    {
        name: "PostgreSQL Operator",
        cr: "PostgresCluster",
        creates: ["StatefulSet", "Services", "ConfigMaps", "Secrets", "PVCs"],
        features: ["High availability", "Automatic failover", "Backups", "Connection pooling"],
    },
    {
        name: "cert-manager",
        cr: "Certificate",
        creates: ["Secrets (TLS certs)", "CertificateRequests", "Orders", "Challenges"],
        features: ["Auto-renewal", "ACME/Let's Encrypt", "Venafi, HashiCorp Vault"],
    },
    {
        name: "Strimzi (Kafka)",
        cr: "Kafka",
        creates: ["StatefulSets", "Services", "ConfigMaps", "NetworkPolicies"],
        features: ["Kafka clusters", "Topic management", "User auth", "Cruise Control"],
    },
];

// MermaidDiagram is imported from shared component above

function ReconcileAnimation() {
    const [step, setStep] = useState(0);
    const steps = [
        { phase: "Observe", icon: "👀", desc: "Operator watches for Database CRs", color: "#38bdf8", desired: 3, actual: 0 },
        { phase: "New CR!", icon: "📄", desc: "User creates Database with replicas: 3", color: "#fbbf24", desired: 3, actual: 0 },
        { phase: "Diff", icon: "🔍", desc: "Desired: 3, Actual: 0 — need 3 pods!", color: "#fbbf24", desired: 3, actual: 0 },
        { phase: "Act", icon: "🔧", desc: "Creating StatefulSet with 3 replicas...", color: "#22c55e", desired: 3, actual: 1 },
        { phase: "Progress", icon: "⏳", desc: "Pods starting: 2/3 ready", color: "#22c55e", desired: 3, actual: 2 },
        { phase: "✅ Synced", icon: "✅", desc: "All 3 pods running. Status updated.", color: "#4ade80", desired: 3, actual: 3 },
        { phase: "💥 Crash!", icon: "💥", desc: "Pod 2 crashed! Actual: 2", color: "#f87171", desired: 3, actual: 2 },
        { phase: "Self-Heal", icon: "🔧", desc: "Operator detects, creates replacement", color: "#22c55e", desired: 3, actual: 3 },
    ];

    useEffect(() => {
        const timer = setInterval(() => setStep(s => (s + 1) % steps.length), 2500);
        return () => clearInterval(timer);
    }, []);

    const current = steps[step];

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #0c4a6e 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(56, 189, 248, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#38bdf8", marginBottom: 20 }}>
                🔁 Reconciliation Loop in Action
            </div>

            {/* Step indicators */}
            <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
                {steps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setStep(i)}
                        style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            border: step === i ? `2px solid ${s.color}` : "1px solid #334155",
                            background: step === i ? `${s.color}20` : "transparent",
                            fontSize: 12,
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

            {/* Current step */}
            <div style={{
                padding: 20,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                borderLeft: `4px solid ${current.color}`
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: current.color }}>
                        {current.icon} {current.phase}
                    </div>
                    <div style={{
                        padding: "4px 12px",
                        borderRadius: 12,
                        background: current.actual === current.desired ? "#052e16" : "#450a0a",
                        color: current.actual === current.desired ? "#4ade80" : "#f87171",
                        fontSize: 12,
                        fontWeight: 600
                    }}>
                        {current.actual}/{current.desired} pods
                    </div>
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>
                    {current.desc}
                </div>
            </div>

            {/* Pod visualization */}
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16 }}>
                {[1, 2, 3].map(i => (
                    <div key={i} style={{
                        width: 60,
                        height: 60,
                        borderRadius: 12,
                        background: i <= current.actual ? "rgba(34,197,94,0.2)" : "rgba(30,41,59,0.5)",
                        border: `2px solid ${i <= current.actual ? "#22c55e" : "#334155"}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s"
                    }}>
                        <div style={{ fontSize: 20 }}>{i <= current.actual ? "🏠" : "⬜"}</div>
                        <div style={{ fontSize: 10, color: i <= current.actual ? "#4ade80" : "#64748b" }}>
                            Pod {i}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CRDvsBuiltIn() {
    const comparison = [
        { aspect: "Examples", builtIn: "Pod, Deployment, Service", custom: "Database, Certificate, Backup" },
        { aspect: "Defined by", builtIn: "Kubernetes core", custom: "You (via CRD)" },
        { aspect: "Controller", builtIn: "Built-in controllers", custom: "Your Operator" },
        { aspect: "API access", builtIn: "kubectl get pods", custom: "kubectl get databases" },
        { aspect: "Validation", builtIn: "Core schema", custom: "Your OpenAPI schema" },
        { aspect: "Behavior", builtIn: "Generic orchestration", custom: "Domain-specific logic" },
    ];

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #422006 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(251, 191, 36, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24", marginBottom: 20 }}>
                🆚 Built-in vs Custom Resources
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 1,
                background: "#1e293b",
                borderRadius: 12,
                overflow: "hidden"
            }}>
                <div style={{ padding: 12, background: "#0f172a", fontWeight: 700, color: "#64748b", fontSize: 12 }}>
                    Aspect
                </div>
                <div style={{ padding: 12, background: "#0c4a6e", fontWeight: 700, color: "#38bdf8", fontSize: 12 }}>
                    🏗️ Built-in
                </div>
                <div style={{ padding: 12, background: "#7c2d12", fontWeight: 700, color: "#fbbf24", fontSize: 12 }}>
                    📐 Custom (CRD)
                </div>

                {comparison.map((row, i) => (
                    <>
                        <div key={`a-${i}`} style={{ padding: 12, background: "#0f172a", color: "#94a3b8", fontSize: 12 }}>
                            {row.aspect}
                        </div>
                        <div key={`b-${i}`} style={{ padding: 12, background: "#0f172a", color: "#67e8f9", fontSize: 12 }}>
                            {row.builtIn}
                        </div>
                        <div key={`c-${i}`} style={{ padding: 12, background: "#0f172a", color: "#fcd34d", fontSize: 12 }}>
                            {row.custom}
                        </div>
                    </>
                ))}
            </div>
        </div>
    );
}

function OperatorExamplesCards() {
    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #312e81 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 20 }}>
                🌟 Real-World Operator Examples
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {operatorExamples.map((op, i) => (
                    <div key={i} style={{
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: 12,
                        padding: 16,
                        border: "1px solid rgba(139,92,246,0.2)"
                    }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#a78bfa", marginBottom: 8 }}>
                            {op.name}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>
                            CR: <code style={{ color: "#fbbf24" }}>{op.cr}</code>
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Creates:</div>
                        <div style={{ fontSize: 11, color: "#67e8f9", marginBottom: 8 }}>
                            {op.creates.join(", ")}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Features:</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {op.features.map((f, j) => (
                                <span key={j} style={{
                                    padding: "2px 8px",
                                    borderRadius: 4,
                                    background: "rgba(139,92,246,0.2)",
                                    fontSize: 10,
                                    color: "#c4b5fd"
                                }}>
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CRDYamlExample() {
    const crdYaml = `# Step 1: Define the CRD (schema)
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.example.com
spec:
  group: example.com
  names:
    kind: Database
    plural: databases
    singular: database
    shortNames: [db]
  scope: Namespaced
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            required: [replicas, version]
            properties:
              replicas:
                type: integer
                minimum: 1
                maximum: 10
              version:
                type: string
          status:
            type: object
            properties:
              ready:
                type: boolean
              pods:
                type: string`;

    const crYaml = `# Step 2: Create a Custom Resource (instance)
apiVersion: example.com/v1
kind: Database
metadata:
  name: prod-mysql
  namespace: production
spec:
  replicas: 3
  version: "8.0"`;

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #422006 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(251, 191, 36, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24", marginBottom: 20 }}>
                📝 CRD + CR YAML Examples
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    <div style={{ fontSize: 12, color: "#fbbf24", marginBottom: 8, fontWeight: 600 }}>
                        📐 CustomResourceDefinition
                    </div>
                    <pre style={{
                        background: "rgba(0,0,0,0.4)",
                        padding: 12,
                        borderRadius: 8,
                        fontSize: 10,
                        lineHeight: 1.4,
                        color: "#e2e8f0",
                        fontFamily: "monospace",
                        overflow: "auto",
                        maxHeight: 300
                    }}>
                        {crdYaml}
                    </pre>
                </div>
                <div>
                    <div style={{ fontSize: 12, color: "#22c55e", marginBottom: 8, fontWeight: 600 }}>
                        📄 Custom Resource (Instance)
                    </div>
                    <pre style={{
                        background: "rgba(0,0,0,0.4)",
                        padding: 12,
                        borderRadius: 8,
                        fontSize: 10,
                        lineHeight: 1.4,
                        color: "#e2e8f0",
                        fontFamily: "monospace",
                        overflow: "auto",
                        maxHeight: 300
                    }}>
                        {crYaml}
                    </pre>
                    <div style={{
                        marginTop: 12,
                        padding: 12,
                        background: "rgba(34,197,94,0.1)",
                        borderRadius: 8,
                        fontSize: 11,
                        color: "#4ade80"
                    }}>
                        <strong>Now you can:</strong><br />
                        kubectl get databases<br />
                        kubectl describe db prod-mysql
                    </div>
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

// ═══════════════════════════════════════════════════════════════════════════
// BEGINNER INTRODUCTION - Plain English explanations for complete beginners
// ═══════════════════════════════════════════════════════════════════════════

function BeginnerIntro() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Welcome */}
            <div style={{
                background: "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(251, 191, 36, 0.3)"
            }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fbbf24", marginBottom: 16 }}>
                    🤖 Welcome to CRDs & Operators!
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8 }}>
                    <strong>This is where Kubernetes becomes truly powerful.</strong> CRDs let you teach Kubernetes
                    about new things (like "Database" or "Certificate"), and Operators are the robots that
                    manage those things automatically. This is how you can say "give me a PostgreSQL cluster" —
                    and Kubernetes just... does it.
                </div>
            </div>

            {/* The problem */}
            <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f87171", marginBottom: 16 }}>
                    😫 The Manual Way (Before Operators)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                    {[
                        "Create StatefulSet for database pods",
                        "Create ConfigMaps for database config",
                        "Create Services for networking",
                        "Set up persistent volumes for data",
                        "Monitor for failures, manually fix them",
                        "Handle backups, upgrades, scaling manually",
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
                        ✅ With an Operator
                    </div>
                    <div style={{ color: "#86efac", fontSize: 13, lineHeight: 1.6 }}>
                        <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>kubectl apply -f database.yaml</code>
                        — Just tell Kubernetes what you want ("3-node PostgreSQL cluster").
                        The Operator handles <em>everything else</em>: creation, monitoring, backups, healing, and more!
                    </div>
                </div>
            </div>

            {/* City Permits analogy */}
            <div style={{
                background: "linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(34, 211, 238, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 16 }}>
                    🏗️ Think of It Like City Permits & Construction
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        {
                            k8s: "CRD (Custom Resource Definition)",
                            analogy: "New type of permit form",
                            icon: "📐",
                            color: "#fbbf24",
                            explain: "You teach the city 'We now have a permit for Data Centers.' The form defines what fields are required: size, capacity, backup policy, etc."
                        },
                        {
                            k8s: "CR (Custom Resource)",
                            analogy: "Filled-out permit application",
                            icon: "📄",
                            color: "#22c55e",
                            explain: "Someone fills out the form: 'I want a 3-machine data center on 123 Main St with daily backups.' This is the request."
                        },
                        {
                            k8s: "Operator",
                            analogy: "Automated construction company",
                            icon: "🤖",
                            color: "#a78bfa",
                            explain: "A robot construction crew that watches for permits. When one arrives, they BUILD it. If something breaks, they FIX it. No humans needed for routine work!"
                        },
                        {
                            k8s: "Reconciliation Loop",
                            analogy: "24/7 building inspector",
                            icon: "🔁",
                            color: "#22d3ee",
                            explain: "Constantly checks: 'Is the building still matching the permit?' If roof is damaged, schedules repair. If extra room is needed, adds it. Never stops checking!"
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
                        "CRD = Teach Kubernetes a new resource type (like 'Database')",
                        "CR = An actual instance of that type (like 'my-postgres')",
                        "Operator = Controller code that manages your custom resources",
                        "Reconciliation = Continuously making 'actual state' equal 'desired state'",
                        "Popular operators: PostgreSQL, MongoDB, Kafka, cert-manager",
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
                    👆 Explore the tabs to dive deeper!
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                    "🔁 Control Loop" for reconciliation • "📝 YAML Examples" for real configs • "🌟 Real Operators" for production examples
                </div>
            </div>
        </div>
    );
}

export default function KubernetesCRDsOperatorsApp() {
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
                        <span>🤖</span>
                        <span>Module 6 • CRDs & Operators</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #fbbf24 0%, #a78bfa 50%, #22c55e 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        CRDs & Operators
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Extend Kubernetes with Your Own Resources
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "start", label: "🚀 Start Here" },
                        { id: "concepts", label: "📖 Concepts" },
                        { id: "reconcile", label: "🔁 Control Loop" },
                        { id: "compare", label: "🆚 Comparison" },
                        { id: "yaml", label: "📝 YAML Examples" },
                        { id: "examples", label: "🌟 Real Operators" },
                        { id: "diagrams", label: "🗺️ Architecture" },
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
                {activeTab === "concepts" && <ConceptCards />}
                {activeTab === "reconcile" && <ReconcileAnimation />}
                {activeTab === "compare" && <CRDvsBuiltIn />}
                {activeTab === "yaml" && <CRDYamlExample />}
                {activeTab === "examples" && <OperatorExamplesCards />}

                {activeTab === "diagrams" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <MermaidDiagram chart={diagrams.crdConcept} title="CRD Concept" />
                        <MermaidDiagram chart={diagrams.operatorArchitecture} title="Operator Architecture" />
                        <MermaidDiagram chart={diagrams.controlLoop} title="Reconciliation Loop" />
                        <MermaidDiagram chart={diagrams.operatorPattern} title="With vs Without Operator" />
                    </div>
                )}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(139,92,246,0.05)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#a78bfa", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Module 6 Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now understand: CRDs, Custom Resources, Operators, Reconciliation Loop
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 7 — Commands & Quick Reference (kubectl, helm cheat sheets)
                    </div>
                </div>
            </div>
        </div>
    );
}
