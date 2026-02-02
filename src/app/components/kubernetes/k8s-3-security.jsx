import { MermaidDiagram } from "./MermaidDiagram";
import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES SECURITY & CONFIG - Interactive Learning Guide (Task 3 of 8)
// Covers: Namespace, ConfigMap, Secret, RBAC
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    namespaceIsolation: `
flowchart TB
    subgraph CLUSTER["☸️ KUBERNETES CLUSTER"]
        subgraph NS_PROD["🏘️ NAMESPACE: production"]
            PROD_API["🏠 api-pod"]
            PROD_WEB["🏠 web-pod"]
            PROD_DB["🏠 db-pod"]
            PROD_SVC["📬 api-service"]
            PROD_SECRET["🔐 db-password"]
        end
        
        subgraph NS_STAGING["🏘️ NAMESPACE: staging"]
            STAGE_API["🏠 api-pod"]
            STAGE_WEB["🏠 web-pod"]
            STAGE_SVC["📬 api-service"]
            STAGE_SECRET["🔐 db-password"]
        end
        
        subgraph NS_DEV["🏘️ NAMESPACE: dev"]
            DEV_API["🏠 api-pod"]
            DEV_SVC["📬 api-service"]
        end
    end
    
    PROD_API -.->|"❌ Cannot access"| STAGE_SECRET
    
    style CLUSTER fill:#0f172a,stroke:#8b5cf6,stroke-width:2px
    style NS_PROD fill:#052e16,stroke:#22c55e,stroke-width:2px
    style NS_STAGING fill:#172554,stroke:#3b82f6,stroke-width:2px
    style NS_DEV fill:#422006,stroke:#f59e0b,stroke-width:2px
`,

    configMapFlow: `
flowchart LR
    subgraph CONFIGMAP["⚙️ CONFIGMAP: app-config"]
        DATA["data:<br/>━━━━━━━━━━━━━<br/>DB_HOST: db.prod.svc<br/>LOG_LEVEL: info<br/>CACHE_TTL: 3600<br/>FEATURE_FLAG: true"]
    end
    
    subgraph POD["🏠 POD"]
        subgraph CONTAINER["📦 Container"]
            ENV["Environment Variables:<br/>━━━━━━━━━━━━━━━━━<br/>process.env.DB_HOST<br/>process.env.LOG_LEVEL"]
            FILES["Mounted Files:<br/>━━━━━━━━━━━━━━━━━<br/>/config/app.properties"]
        end
    end
    
    DATA -->|"env vars"| ENV
    DATA -->|"volume mount"| FILES
    
    style CONFIGMAP fill:#0e7490,stroke:#22d3ee,stroke-width:2px
    style POD fill:#064e3b,stroke:#34d399
    style CONTAINER fill:#047857,stroke:#6ee7b7
`,

    secretFlow: `
flowchart TB
    subgraph CREATE["Step 1: Create Secret"]
        PLAIN["Plain text:<br/>password123"]
        BASE64["Base64 encoded:<br/>cGFzc3dvcmQxMjM="]
        PLAIN -->|"encode"| BASE64
    end
    
    subgraph STORE["Step 2: Stored in etcd"]
        ETCD["🔐 Encrypted at rest<br/>(if enabled)"]
    end
    
    subgraph USE["Step 3: Injected into Pod"]
        POD["🏠 Pod gets<br/>decoded value:<br/>password123"]
    end
    
    BASE64 --> ETCD
    ETCD --> POD
    
    style CREATE fill:#7c2d12,stroke:#fb923c
    style STORE fill:#1e1b4b,stroke:#a78bfa
    style USE fill:#064e3b,stroke:#34d399
`,

    rbacFlow: `
flowchart LR
    subgraph WHO["WHO"]
        USER["👤 User:<br/>alice"]
        SA["🤖 ServiceAccount:<br/>my-app"]
    end
    
    subgraph WHAT["WHAT (Role)"]
        ROLE["📋 Role:<br/>pod-reader<br/>━━━━━━━━━<br/>resources: pods<br/>verbs: get, list"]
    end
    
    subgraph WHERE["WHERE"]
        NS["🏘️ Namespace:<br/>production"]
    end
    
    subgraph BINDING["BINDING (Glue)"]
        RB["🔗 RoleBinding:<br/>alice-pod-reader<br/>━━━━━━━━━<br/>subject: alice<br/>roleRef: pod-reader"]
    end
    
    USER --> RB
    RB --> ROLE
    ROLE --> NS
    
    style WHO fill:#7c3aed,stroke:#a78bfa
    style WHAT fill:#0e7490,stroke:#22d3ee
    style WHERE fill:#064e3b,stroke:#34d399
    style BINDING fill:#b45309,stroke:#fbbf24
`,

    rbacHierarchy: `
flowchart TB
    subgraph SCOPE["Scope of Access"]
        subgraph CLUSTER_LEVEL["🌍 Cluster-Wide"]
            CR["ClusterRole<br/>━━━━━━━━━<br/>Access across<br/>ALL namespaces"]
            CRB["ClusterRoleBinding"]
        end
        
        subgraph NS_LEVEL["🏘️ Single Namespace"]
            R["Role<br/>━━━━━━━━━<br/>Access in ONE<br/>namespace only"]
            RB["RoleBinding"]
        end
    end
    
    CR --> CRB
    R --> RB
    
    ADMIN["👤 admin user"] --> CRB
    DEV["👤 developer"] --> RB
    
    style CLUSTER_LEVEL fill:#7c2d12,stroke:#fb923c
    style NS_LEVEL fill:#0e7490,stroke:#22d3ee
`,

    configInjection: `
flowchart TB
    subgraph SOURCES["Config Sources"]
        CM["⚙️ ConfigMap<br/>app-config"]
        SECRET["🔐 Secret<br/>db-credentials"]
    end
    
    subgraph POD["🏠 POD"]
        subgraph INJECT["Injection Methods"]
            ENV["1️⃣ Environment Variables<br/>━━━━━━━━━━━━━━━━━━━<br/>DB_HOST=db.prod.svc<br/>DB_PASSWORD=s3cr3t"]
            VOL["2️⃣ Volume Mounts<br/>━━━━━━━━━━━━━━━━━━━<br/>/config/app.yaml<br/>/secrets/password.txt"]
        end
        
        APP["📦 Your App<br/>reads both"]
    end
    
    CM -->|"envFrom"| ENV
    SECRET -->|"envFrom"| ENV
    CM -->|"volumeMounts"| VOL
    SECRET -->|"volumeMounts"| VOL
    ENV --> APP
    VOL --> APP
    
    style SOURCES fill:#1e1b4b,stroke:#a78bfa
    style POD fill:#064e3b,stroke:#34d399
    style INJECT fill:#047857,stroke:#6ee7b7
`,

    fullSecurityPicture: `
flowchart TB
    USER["👤 User/ServiceAccount"]
    
    subgraph AUTH["🔐 AUTHENTICATION"]
        WHO["Who are you?<br/>━━━━━━━━━━━<br/>Certificates<br/>Tokens<br/>OIDC"]
    end
    
    subgraph AUTHZ["📋 AUTHORIZATION (RBAC)"]
        WHAT["What can you do?<br/>━━━━━━━━━━━<br/>Roles<br/>RoleBindings"]
    end
    
    subgraph ADMISSION["🚦 ADMISSION CONTROL"]
        VALID["Is it valid?<br/>━━━━━━━━━━━<br/>Resource quotas<br/>Pod security"]
    end
    
    subgraph CLUSTER["☸️ CLUSTER"]
        NS["🏘️ Namespace isolation"]
        CONFIG["⚙️ ConfigMaps"]
        SECRETS["🔐 Secrets"]
    end
    
    USER --> AUTH
    AUTH -->|"verified"| AUTHZ
    AUTHZ -->|"allowed"| ADMISSION
    ADMISSION -->|"approved"| CLUSTER
    
    style AUTH fill:#7c2d12,stroke:#fb923c
    style AUTHZ fill:#1e40af,stroke:#60a5fa
    style ADMISSION fill:#065f46,stroke:#34d399
    style CLUSTER fill:#0f172a,stroke:#8b5cf6
`
};

const concepts = [
    {
        id: "namespace",
        icon: "🏘️",
        name: "Namespace",
        tagline: "City Districts",
        color: "#22c55e",
        diagram: "namespaceIsolation",
        what: "A Namespace is a virtual cluster within your cluster — a way to divide resources into isolated groups. Resources in one namespace can't see resources in another (by default). Same-name resources can exist in different namespaces.",
        why: "Without namespaces, everyone shares everything — chaos! Namespaces let you: (1) separate environments (prod/staging/dev), (2) isolate teams, (3) apply different resource quotas, (4) control who can access what.",
        analogy: "City districts. The financial district can't access health department records. Each district has its own budget (resource quota) and security (RBAC). You can have a 'Main Street' in multiple districts without conflict.",
        components: [
            { name: "Resource Quota", desc: "Limit CPU/memory per namespace" },
            { name: "LimitRange", desc: "Default limits for pods in namespace" },
            { name: "NetworkPolicy", desc: "Control traffic between namespaces" },
        ],
        yaml: `apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    env: production
---
# Resource Quota for the namespace
apiVersion: v1
kind: ResourceQuota
metadata:
  name: prod-quota
  namespace: production
spec:
  hard:
    requests.cpu: "10"       # Max 10 CPU total
    requests.memory: 20Gi    # Max 20GB memory
    pods: "50"               # Max 50 pods`,
        commands: [
            { cmd: "kubectl get namespaces", desc: "List all namespaces" },
            { cmd: "kubectl create namespace dev", desc: "Create namespace" },
            { cmd: "kubectl get pods -n production", desc: "List pods in namespace" },
            { cmd: "kubectl config set-context --current --namespace=dev", desc: "Switch default namespace" },
        ]
    },
    {
        id: "configmap",
        icon: "⚙️",
        name: "ConfigMap",
        tagline: "Bulletin Board",
        color: "#22d3ee",
        diagram: "configMapFlow",
        what: "A ConfigMap stores non-sensitive configuration data as key-value pairs. Apps read this data as environment variables or files. When you update the ConfigMap, pods can pick up changes (with volume mounts) without rebuilding the image.",
        why: "You don't want configuration baked into images — that's inflexible. ConfigMaps let you: (1) change settings without rebuilding, (2) use different configs per environment, (3) share config across multiple pods.",
        analogy: "A bulletin board in the office lobby. Everyone can read the posted announcements (DB_HOST, LOG_LEVEL). When you update the bulletin, people see it next time they look. Nothing secret here — just general info.",
        components: [
            { name: "data", desc: "Key-value pairs (strings)" },
            { name: "binaryData", desc: "Binary files (base64 encoded)" },
            { name: "envFrom", desc: "Inject all keys as env vars" },
            { name: "volumeMounts", desc: "Mount as files in container" },
        ],
        yaml: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "db.production.svc"
  LOG_LEVEL: "info"
  CACHE_TTL: "3600"
  
  # Multi-line config file
  app.properties: |
    server.port=8080
    feature.newUI=true
---
# Using in a Pod
spec:
  containers:
  - name: my-app
    envFrom:
    - configMapRef:
        name: app-config     # All keys become env vars
    volumeMounts:
    - name: config-volume
      mountPath: /config     # Mount as files
  volumes:
  - name: config-volume
    configMap:
      name: app-config`,
        commands: [
            { cmd: "kubectl create configmap app-config --from-literal=KEY=value", desc: "Create from literal" },
            { cmd: "kubectl create configmap app-config --from-file=config.properties", desc: "Create from file" },
            { cmd: "kubectl get configmaps", desc: "List ConfigMaps" },
            { cmd: "kubectl describe configmap app-config", desc: "View contents" },
        ]
    },
    {
        id: "secret",
        icon: "🔐",
        name: "Secret",
        tagline: "Safe Deposit Box",
        color: "#f59e0b",
        diagram: "secretFlow",
        what: "A Secret stores sensitive data like passwords, API keys, and certificates. Similar to ConfigMap but: (1) values are base64 encoded, (2) Kubernetes limits exposure, (3) can be encrypted at rest. Pods access Secrets via env vars or files.",
        why: "Passwords shouldn't be in your code or ConfigMaps (which are visible to everyone). Secrets provide a dedicated place for sensitive data with additional protections. They can integrate with external vaults (HashiCorp Vault, AWS Secrets Manager).",
        analogy: "A safe deposit box at the bank. Only authorized people (pods with the right permissions) can open it. The contents are hidden — you don't post your passwords on the bulletin board!",
        components: [
            { name: "Opaque", desc: "Generic secret (default type)" },
            { name: "kubernetes.io/tls", desc: "TLS certificates" },
            { name: "kubernetes.io/dockerconfigjson", desc: "Docker registry credentials" },
            { name: "stringData", desc: "Plain text input (auto-encoded)" },
        ],
        yaml: `apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:              # Plain text (easier to write)
  username: admin
  password: supersecret123
---
# OR with base64 (what's actually stored)
data:
  username: YWRtaW4=              # base64 of "admin"
  password: c3VwZXJzZWNyZXQxMjM=  # base64 of "supersecret123"
---
# Using in a Pod
spec:
  containers:
  - name: my-app
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-credentials
          key: password`,
        commands: [
            { cmd: "kubectl create secret generic db-creds --from-literal=password=secret", desc: "Create secret" },
            { cmd: "kubectl get secrets", desc: "List secrets" },
            { cmd: "kubectl describe secret db-creds", desc: "See metadata (not values!)" },
            { cmd: "kubectl get secret db-creds -o jsonpath='{.data.password}' | base64 -d", desc: "Decode value" },
        ]
    },
    {
        id: "rbac",
        icon: "🎫",
        name: "RBAC",
        tagline: "Security Badges & Permits",
        color: "#a78bfa",
        diagram: "rbacFlow",
        what: "Role-Based Access Control defines WHO can do WHAT on WHICH resources. It uses Roles (permissions) and RoleBindings (assignments). Cluster-wide permissions use ClusterRole and ClusterRoleBinding.",
        why: "Not everyone should delete production pods! RBAC lets you: (1) give developers read-only prod access, (2) let apps only access their own secrets, (3) prevent accidents by limiting permissions, (4) meet compliance requirements.",
        analogy: "Building security badges. A 'maintenance' badge (Role) allows access to utility rooms. When you hire a janitor (User), you give them the maintenance badge (RoleBinding). They can't enter the executive suite (different Role needed).",
        components: [
            { name: "Role", desc: "Set of permissions in ONE namespace" },
            { name: "ClusterRole", desc: "Cluster-wide permissions" },
            { name: "RoleBinding", desc: "Assigns Role to user/group in namespace" },
            { name: "ClusterRoleBinding", desc: "Assigns ClusterRole cluster-wide" },
            { name: "ServiceAccount", desc: "Identity for pods (not humans)" },
        ],
        yaml: `# Step 1: Define what actions are allowed
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]    # Read-only
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get"]                      # Can view logs
---
# Step 2: Assign the role to a user
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: alice-pod-reader
  namespace: production
subjects:
- kind: User
  name: alice
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io`,
        commands: [
            { cmd: "kubectl auth can-i get pods --as alice", desc: "Check if user can do action" },
            { cmd: "kubectl get roles -n production", desc: "List roles in namespace" },
            { cmd: "kubectl describe rolebinding alice-pod-reader -n production", desc: "See binding details" },
            { cmd: "kubectl create rolebinding name --role=role --user=user -n ns", desc: "Create binding" },
        ]
    }
];

const rbacVerbs = [
    { verb: "get", desc: "Read a single resource", example: "kubectl get pod my-pod" },
    { verb: "list", desc: "List multiple resources", example: "kubectl get pods" },
    { verb: "watch", desc: "Stream changes", example: "kubectl get pods -w" },
    { verb: "create", desc: "Create new resources", example: "kubectl apply -f pod.yaml" },
    { verb: "update", desc: "Modify existing resources", example: "kubectl apply -f pod.yaml" },
    { verb: "patch", desc: "Partially modify", example: "kubectl patch pod my-pod -p '...'" },
    { verb: "delete", desc: "Remove resources", example: "kubectl delete pod my-pod" },
];

// MermaidDiagram is now imported from shared component

function CodeBlock({ code }) {
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
                yaml
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
                                    gap: 16,
                                    flexWrap: "wrap"
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

function RBACVerbsTable() {
    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(167, 139, 250, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#a78bfa", marginBottom: 20 }}>
                🎫 RBAC Verbs Explained
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 12
            }}>
                {rbacVerbs.map((item, i) => (
                    <div key={i} style={{
                        background: "rgba(0,0,0,0.3)",
                        borderRadius: 12,
                        padding: 16,
                        border: "1px solid rgba(167, 139, 250, 0.2)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <code style={{
                                color: "#a78bfa",
                                fontSize: 14,
                                fontWeight: 700,
                                background: "rgba(167, 139, 250, 0.2)",
                                padding: "4px 10px",
                                borderRadius: 6
                            }}>
                                {item.verb}
                            </code>
                            <span style={{ color: "#94a3b8", fontSize: 12 }}>{item.desc}</span>
                        </div>
                        <code style={{ color: "#64748b", fontSize: 11 }}>{item.example}</code>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SecretEncodingDemo() {
    const [plainText, setPlainText] = useState("mypassword123");
    const encoded = typeof btoa !== 'undefined' ? btoa(plainText) : Buffer.from(plainText).toString('base64');

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #422006 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(245, 158, 11, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b", marginBottom: 20 }}>
                🔐 Base64 Encoding Demo
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
                <div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Plain Text</div>
                    <input
                        type="text"
                        value={plainText}
                        onChange={(e) => setPlainText(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 16px",
                            borderRadius: 8,
                            border: "1px solid #f59e0b50",
                            background: "rgba(0,0,0,0.4)",
                            color: "#e2e8f0",
                            fontSize: 14,
                            fontFamily: "monospace"
                        }}
                    />
                </div>

                <div style={{ fontSize: 24, color: "#f59e0b" }}>→</div>

                <div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>Base64 Encoded</div>
                    <div style={{
                        padding: "12px 16px",
                        borderRadius: 8,
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid #f59e0b50",
                        fontFamily: "monospace",
                        fontSize: 14,
                        color: "#fbbf24",
                        wordBreak: "break-all"
                    }}>
                        {encoded}
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: 16,
                padding: 12,
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: 8,
                fontSize: 12,
                color: "#fcd34d"
            }}>
                ⚠️ <strong>Important:</strong> Base64 is NOT encryption — it's just encoding. Anyone can decode it!
                Enable encryption at rest in your cluster for real security.
            </div>
        </div>
    );
}

function SecurityFlowAnimation() {
    const [step, setStep] = useState(0);
    const steps = [
        { icon: "👤", label: "User sends request", desc: "kubectl get pods -n prod", color: "#a78bfa" },
        { icon: "🔐", label: "Authentication", desc: "Who are you? (cert/token check)", color: "#f59e0b" },
        { icon: "📋", label: "Authorization (RBAC)", desc: "Can alice GET pods in prod? ✓", color: "#22d3ee" },
        { icon: "🚦", label: "Admission Control", desc: "Any policies violated? No ✓", color: "#22c55e" },
        { icon: "✅", label: "Request allowed", desc: "Returns list of pods", color: "#4ade80" },
    ];

    useEffect(() => {
        const timer = setInterval(() => setStep(s => (s + 1) % steps.length), 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid rgba(139, 92, 246, 0.3)"
        }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 24 }}>
                🔒 Security Flow: Request to Response
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background: step >= i ? s.color + "30" : "#1e293b",
                            border: `2px solid ${step >= i ? s.color : "#334155"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            transition: "all 0.3s",
                            boxShadow: step === i ? `0 0 20px ${s.color}50` : "none"
                        }}>
                            {s.icon}
                        </div>
                        {i < steps.length - 1 && (
                            <div style={{
                                width: 30,
                                height: 2,
                                background: step > i ? s.color : "#334155",
                                transition: "all 0.3s"
                            }} />
                        )}
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: 24,
                padding: 16,
                background: "rgba(0,0,0,0.3)",
                borderRadius: 12,
                borderLeft: `3px solid ${steps[step].color}`,
                transition: "all 0.3s"
            }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: steps[step].color }}>
                    {steps[step].label}
                </div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                    {steps[step].desc}
                </div>
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
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(34, 197, 94, 0.3)"
            }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#22c55e", marginBottom: 16 }}>
                    🔐 Welcome to Security & Configuration!
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.8 }}>
                    <strong>Your apps are running, traffic is flowing.</strong> But how do you keep things secure?
                    How do you store passwords safely? How do you give developers access without letting them
                    delete production? This module teaches you Kubernetes security and config management.
                </div>
            </div>

            {/* Why this matters */}
            <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #334155"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f87171", marginBottom: 16 }}>
                    ⚠️ Without Security, Bad Things Happen
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        { problem: "Passwords in code", pain: "Anyone who sees your code sees your DB password!" },
                        { problem: "Everyone is admin", pain: "A junior dev accidentally deletes the production database" },
                        { problem: "Mixed environments", pain: "Dev and prod apps talk to each other, causing chaos" },
                        { problem: "Hard-coded config", pain: "You have to rebuild images just to change a log level" },
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
                        ✅ Kubernetes has built-in solutions for ALL of these!
                    </div>
                    <div style={{ color: "#86efac", fontSize: 13, lineHeight: 1.6 }}>
                        Secrets store passwords safely. RBAC controls who can do what. Namespaces isolate
                        environments. ConfigMaps externalize configuration.
                    </div>
                </div>
            </div>

            {/* Analogies */}
            <div style={{
                background: "linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(34, 211, 238, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#22d3ee", marginBottom: 16 }}>
                    🏢 Think of It Like an Office Building
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                        {
                            k8s: "Namespace",
                            analogy: "Different floors for different teams",
                            icon: "🏘️",
                            color: "#22c55e",
                            explain: "Engineering on floor 3, HR on floor 5. Each floor has its own resources, budgets, and access rules. You can have a 'database' on each floor without conflict."
                        },
                        {
                            k8s: "ConfigMap",
                            analogy: "Company bulletin board",
                            icon: "⚙️",
                            color: "#22d3ee",
                            explain: "Posted for everyone to see: office hours, meeting room schedules, WiFi name. Not secret, just useful information that everyone needs."
                        },
                        {
                            k8s: "Secret",
                            analogy: "A locked safe",
                            icon: "🔐",
                            color: "#f59e0b",
                            explain: "The combination to the building vault, the CEO's phone number, payroll passwords. Only authorized people can access this, and it's stored securely."
                        },
                        {
                            k8s: "RBAC",
                            analogy: "Security badges",
                            icon: "🎫",
                            color: "#a78bfa",
                            explain: "Your badge (RoleBinding) determines what doors (resources) you can open and what you can do inside (verbs: read, write, delete). Engineering badge opens labs, HR badge opens personnel files."
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
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: 16,
                padding: 24,
                border: "1px solid rgba(245, 158, 11, 0.3)"
            }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b", marginBottom: 16 }}>
                    🎯 Key Takeaways
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        "Namespace = Isolate environments (prod/staging/dev) and teams",
                        "ConfigMap = Store non-secret config (URLs, feature flags) externally",
                        "Secret = Store sensitive data (passwords, API keys) securely",
                        "RBAC = Control WHO can do WHAT on WHICH resources",
                        "Never put secrets in your code or ConfigMaps!",
                        "Use namespaces to prevent dev changes from affecting prod",
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
                background: "rgba(34, 197, 94, 0.1)",
                borderRadius: 12,
                border: "1px solid rgba(34, 197, 94, 0.3)"
            }}>
                <div style={{ fontSize: 16, color: "#22c55e", fontWeight: 600 }}>
                    👆 Explore the tabs to dive deeper!
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                    "📖 Concepts" for details • "🔒 Security Flow" shows auth process • "🎫 RBAC Verbs" explains permissions • "🔐 Secret Demo" shows encoding
                </div>
            </div>
        </div>
    );
}

export default function KubernetesSecurityApp() {
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
                        <span>🔐</span>
                        <span>Module 3 • Security & Config</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #22c55e 0%, #22d3ee 50%, #f59e0b 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Security & Configuration
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Namespace → ConfigMap → Secret → RBAC — Organize, configure, and secure
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "start", label: "🚀 Start Here" },
                        { id: "concepts", label: "📖 Concepts" },
                        { id: "flow", label: "🔒 Security Flow" },
                        { id: "verbs", label: "🎫 RBAC Verbs" },
                        { id: "encoding", label: "🔐 Secret Demo" },
                        { id: "bigpicture", label: "🗺️ Full Picture" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 20px",
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

                {activeTab === "flow" && <SecurityFlowAnimation />}
                {activeTab === "verbs" && <RBACVerbsTable />}
                {activeTab === "encoding" && <SecretEncodingDemo />}

                {activeTab === "bigpicture" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div>
                            <MermaidDiagram chart={diagrams.fullSecurityPicture} title="Complete Security Architecture" />
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
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#86efac", lineHeight: 1.7 }}>
                                    <li><strong>Authentication:</strong> First check — who are you? (certificates, tokens)</li>
                                    <li><strong>Authorization (RBAC):</strong> What are you allowed to do?</li>
                                    <li><strong>Admission Control:</strong> Is this action valid? (quotas, policies)</li>
                                    <li><strong>Finally:</strong> Request reaches the namespace with ConfigMaps and Secrets</li>
                                </ul>
                            </div>
                        </div>
                        <MermaidDiagram chart={diagrams.configInjection} title="Config Injection Flow" />
                        <MermaidDiagram chart={diagrams.rbacHierarchy} title="RBAC: Role vs ClusterRole" />
                    </div>
                )}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(34,197,94,0.05)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Module 3 Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now understand: Namespace, ConfigMap, Secret, RBAC
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 4 — Helm Deep-Dive (Charts, templates, install/upgrade/rollback)
                    </div>
                </div>
            </div>
        </div>
    );
}
