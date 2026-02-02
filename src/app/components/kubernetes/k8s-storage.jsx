import { MermaidDiagram } from "./MermaidDiagram";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// KUBERNETES: STORAGE - Persistent Data in a World of Ephemeral Containers
// Understanding Volumes, PersistentVolumes, PVCs, StorageClasses, StatefulSets
// ═══════════════════════════════════════════════════════════════════════════

const diagrams = {
    theProblem: `
flowchart TB
    subgraph BEFORE["⚠️ THE PROBLEM"]
        P1["📦 Pod with Container"]
        FS1["💾 Container Filesystem<br/>━━━━━━━━━━━━<br/>• App files<br/>• Database data<br/>• User uploads"]
        P1 --> FS1
        
        CRASH["💀 Pod crashes or restarts"]
        FS2["💾 New Filesystem<br/>━━━━━━━━━━━━<br/>• App files ✓<br/>• Database data ❌<br/>• User uploads ❌"]
        
        CRASH -->|"All data lost!"| FS2
    end
    
    style BEFORE fill:#450a0a,stroke:#f87171
`,

    theSolution: `
flowchart TB
    subgraph AFTER["✅ THE SOLUTION: VOLUMES"]
        P1["📦 Pod with Container"]
        
        subgraph STORAGE["💿 External Storage"]
            VOL["Volume<br/>━━━━━━━━━━━━<br/>• Database data ✓<br/>• User uploads ✓"]
        end
        
        P1 -->|"mount"| VOL
        
        RESTART["🔄 Pod restarts"]
        P2["📦 New Pod"]
        
        RESTART --> P2
        P2 -->|"reconnects"| VOL
    end
    
    style AFTER fill:#052e16,stroke:#22c55e
    style STORAGE fill:#0e7490,stroke:#22d3ee,stroke-width:2px
`,

    pvPvcFlow: `
flowchart LR
    subgraph ADMIN["👤 CLUSTER ADMIN"]
        PV["Create PV<br/>━━━━━━━━<br/>10Gi Storage<br/>on AWS EBS"]
    end
    
    subgraph DEV["👤 DEVELOPER"]
        PVC["Create PVC<br/>━━━━━━━━<br/>'I need 5Gi<br/>for my database'"]
    end
    
    subgraph K8S["☸️ KUBERNETES"]
        BIND["PVC binds to PV<br/>━━━━━━━━━━━━<br/>Finds matching<br/>size/class"]
    end
    
    subgraph POD["📦 POD"]
        MOUNT["Volume mounted<br/>at /data"]
    end
    
    PV --> K8S
    PVC --> K8S
    K8S --> |"PVC claims PV"| BIND
    BIND --> POD
    
    style ADMIN fill:#1e1b4b,stroke:#a78bfa
    style DEV fill:#164e63,stroke:#22d3ee
    style K8S fill:#0f172a,stroke:#8b5cf6
    style POD fill:#064e3b,stroke:#34d399
`,

    storageClassFlow: `
flowchart TB
    subgraph STATIC["❌ WITHOUT StorageClass (Manual)"]
        A1["Admin creates PV manually"]
        A2["Dev creates PVC"]
        A3["Hope they match!"]
        A1 --> A2 --> A3
    end
    
    subgraph DYNAMIC["✅ WITH StorageClass (Automatic)"]
        B1["StorageClass defined<br/>(gp2, ssd, nfs)"]
        B2["Dev creates PVC<br/>storageClassName: gp2"]
        B3["K8s auto-provisions PV!"]
        B1 --> B2 --> B3
    end
    
    style STATIC fill:#450a0a,stroke:#f87171
    style DYNAMIC fill:#052e16,stroke:#22c55e
`,

    statefulSetFlow: `
flowchart TB
    subgraph DEPLOYMENT["Deployment (Stateless)"]
        D["📋 Deployment"]
        DP1["pod-abc123"]
        DP2["pod-xyz789"]
        DP3["pod-qwe456"]
        D --> DP1 & DP2 & DP3
    end
    
    subgraph STATEFULSET["StatefulSet (Stateful)"]
        SS["📋 StatefulSet"]
        SP1["db-0<br/>━━━━<br/>PVC-0"]
        SP2["db-1<br/>━━━━<br/>PVC-1"]
        SP3["db-2<br/>━━━━<br/>PVC-2"]
        SS --> SP1 --> SP2 --> SP3
    end
    
    style DEPLOYMENT fill:#164e63,stroke:#22d3ee
    style STATEFULSET fill:#1e1b4b,stroke:#a78bfa,stroke-width:2px
`
};

const concepts = [
    {
        id: "volume",
        icon: "💾",
        name: "Volume",
        tagline: "USB Drive for Containers",
        color: "#22d3ee",
        diagram: "theSolution",
        tldr: "A directory accessible to containers in a pod, can survive container restarts.",
        what: "A Volume is a directory that containers in a pod can access. Unlike the container's filesystem, volumes can persist data beyond container restarts. There are many volume types: emptyDir, hostPath, configMap, secret, nfs, and cloud provider volumes.",
        why: "Containers are ephemeral — when they restart, their filesystem is wiped clean. Volumes let you store data that survives restarts: databases, logs, uploaded files, shared data between containers.",
        analogy: "A USB drive you plug into your laptop. When your laptop restarts (container restart), the USB drive still has all your files. You can even unplug it and plug it into another laptop.",
        yaml: `apiVersion: v1
kind: Pod
metadata:
  name: app-with-storage
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: data-volume      # Reference the volume
      mountPath: /data        # Where to mount it
  volumes:
  - name: data-volume         # Define the volume
    emptyDir: {}              # Simple temp storage`,
        commands: [
            { cmd: "kubectl describe pod <name>", desc: "See mounted volumes" },
            { cmd: "kubectl exec -it <pod> -- ls /data", desc: "List files in mounted volume" },
        ]
    },
    {
        id: "pv",
        icon: "🗄️",
        name: "PersistentVolume (PV)",
        tagline: "File Server in the Data Center",
        color: "#a78bfa",
        diagram: "pvPvcFlow",
        tldr: "Pre-provisioned storage managed by cluster admins.",
        what: "A PersistentVolume is a piece of storage in the cluster that has been provisioned by an administrator. It's a cluster resource (like nodes) that exists independently of any pod. PVs have a lifecycle independent of pods that use them.",
        why: "Separates WHAT storage exists from WHO uses it. Admins set up storage once, developers request it via PVCs. This separation lets you use different storage backends (AWS EBS, NFS, local) without developers needing to know the details.",
        analogy: "A storage room in an office building. Building management (admins) creates storage rooms of various sizes. Employees (developers) request a room via a form (PVC). They don't need to know if it's in the basement or third floor.",
        yaml: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 10Gi           # Size available
  accessModes:
    - ReadWriteOnce         # One node at a time
  persistentVolumeReclaimPolicy: Retain  # Keep data after PVC deleted
  storageClassName: manual  # Which StorageClass
  hostPath:                 # Simple local storage (for demo)
    path: /mnt/data`,
        commands: [
            { cmd: "kubectl get pv", desc: "List all PersistentVolumes" },
            { cmd: "kubectl describe pv <name>", desc: "See PV details and status" },
        ]
    },
    {
        id: "pvc",
        icon: "📝",
        name: "PersistentVolumeClaim (PVC)",
        tagline: "Storage Request Form",
        color: "#22c55e",
        diagram: "pvPvcFlow",
        tldr: "Developer's request for storage, gets matched to a PV.",
        what: "A PersistentVolumeClaim is a request for storage by a user. It's similar to a pod: pods consume node resources, PVCs consume PV resources. PVCs specify size, access modes, and optionally a storage class.",
        why: "Separates 'I need storage' from 'here's how to create storage'. Developers don't need to know if storage is NFS, AWS EBS, or local disk. They just request 'give me 5Gi that I can write to'.",
        analogy: "A storage request form you submit to building management. 'I need a 10 square meter room that I can access 24/7.' Management finds an available room that meets your needs and assigns it to you.",
        yaml: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce        # Must match PV
  resources:
    requests:
      storage: 5Gi         # Size I need (≤ PV size)
  storageClassName: manual # Must match PV
---
# Use in a Pod:
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: my-pvc    # Reference the PVC`,
        commands: [
            { cmd: "kubectl get pvc", desc: "List all claims" },
            { cmd: "kubectl describe pvc <name>", desc: "See bound PV and status" },
        ]
    },
    {
        id: "storageclass",
        icon: "🏭",
        name: "StorageClass",
        tagline: "Storage Vending Machine",
        color: "#fbbf24",
        diagram: "storageClassFlow",
        tldr: "Defines HOW to dynamically create storage when PVCs need it.",
        what: "A StorageClass provides a way to describe different 'classes' of storage. When a PVC requests a storage class, Kubernetes can dynamically provision a PV. No need for admins to pre-create PVs.",
        why: "Manual PV creation doesn't scale. With 100 developers each needing storage, admins would spend all day creating PVs. StorageClasses automate this: 'when someone asks for gp2 storage, create an AWS EBS volume'.",
        analogy: "A vending machine for storage. Instead of asking building management for a storage room (manual PV), you put coins in the vending machine (PVC), select your size (request), and a room is created on demand.",
        yaml: `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/aws-ebs  # Who creates storage
parameters:
  type: gp3                         # AWS EBS type
  fsType: ext4
reclaimPolicy: Delete               # Delete PV when PVC deleted
volumeBindingMode: WaitForFirstConsumer
---
# PVC that triggers dynamic provisioning:
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: fast-storage
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: fast-ssd  # Use this StorageClass
  resources:
    requests:
      storage: 20Gi           # PV auto-created with 20Gi!`,
        commands: [
            { cmd: "kubectl get storageclass", desc: "List available classes" },
            { cmd: "kubectl describe sc <name>", desc: "See provisioner and params" },
        ]
    },
    {
        id: "statefulset",
        icon: "🗃️",
        name: "StatefulSet",
        tagline: "Database Deployment Manager",
        color: "#fb923c",
        diagram: "statefulSetFlow",
        tldr: "Like Deployment, but pods have stable identities and their own storage.",
        what: "StatefulSet is a Deployment for stateful applications like databases. Unlike Deployments, it provides: (1) stable, unique pod names (db-0, db-1), (2) ordered deployment and scaling, (3) stable network identity, (4) persistent storage per pod.",
        why: "Databases need consistency. If MongoDB pod 'db-0' has data, a new pod 'db-0' should get that same data. With Deployments, pods get random names and share a PVC — chaos for databases. StatefulSets give each pod its own PVC.",
        analogy: "Assigned desks vs hot-desking. Deployments are like hot-desking: any employee can sit anywhere. StatefulSets are like assigned desks: Employee #0 always uses desk #0 with their files. When they're sick, no one else uses it.",
        yaml: `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: mysql          # Headless service required
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:        # Each pod gets its own PVC!
  - metadata:
      name: data
    spec:
      accessModes: [ReadWriteOnce]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 10Gi`,
        commands: [
            { cmd: "kubectl get statefulset", desc: "List StatefulSets" },
            { cmd: "kubectl get pvc -l app=mysql", desc: "See PVCs created for each pod" },
        ]
    }
];

const accessModes = [
    {
        mode: "ReadWriteOnce (RWO)",
        desc: "Can be mounted read/write by ONE node",
        use: "Single-pod databases, single-user apps",
        icon: "👤"
    },
    {
        mode: "ReadOnlyMany (ROX)",
        desc: "Can be mounted read-only by MANY nodes",
        use: "Static content, shared configs",
        icon: "👁️"
    },
    {
        mode: "ReadWriteMany (RWX)",
        desc: "Can be mounted read/write by MANY nodes",
        use: "Shared uploads, CMS media",
        icon: "👥"
    }
];

const reclaimPolicies = [
    {
        policy: "Retain",
        desc: "Keep the PV and its data after PVC is deleted",
        use: "Important data you might need later",
        icon: "💾"
    },
    {
        policy: "Delete",
        desc: "Delete the PV when PVC is deleted",
        use: "Temporary data, test environments",
        icon: "🗑️"
    },
    {
        policy: "Recycle (deprecated)",
        desc: "Wipe data and make PV available again",
        use: "Legacy, don't use",
        icon: "♻️"
    }
];

function ConceptCard({ concept, isActive, onClick }) {
    const [showYaml, setShowYaml] = useState(false);

    return (
        <div
            style={{
                background: isActive
                    ? `linear-gradient(135deg, ${concept.color}15 0%, transparent 100%)`
                    : "rgba(15, 23, 42, 0.6)",
                border: `1px solid ${isActive ? concept.color : "#334155"}`,
                borderRadius: 16,
                padding: 24,
                cursor: "pointer",
                transition: "all 0.3s"
            }}
        >
            <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 32 }}>{concept.icon}</span>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: concept.color }}>
                        {concept.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{concept.tagline}</div>
                </div>
            </div>

            {isActive && (
                <div style={{ marginTop: 20 }}>
                    <div style={{
                        padding: 12,
                        background: `${concept.color}20`,
                        borderRadius: 8,
                        marginBottom: 16
                    }}>
                        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>TL;DR</div>
                        <div style={{ fontSize: 13, color: "#e2e8f0" }}>{concept.tldr}</div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>What is it?</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{concept.what}</div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>Why use it?</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{concept.why}</div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24", marginBottom: 4 }}>🎭 Analogy</div>
                        <div style={{ fontSize: 12, color: "#fcd34d", lineHeight: 1.6, fontStyle: "italic" }}>{concept.analogy}</div>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); setShowYaml(!showYaml); }}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: `1px solid ${concept.color}60`,
                            background: showYaml ? `${concept.color}20` : "transparent",
                            color: concept.color,
                            cursor: "pointer",
                            fontSize: 12,
                            width: "100%"
                        }}
                    >
                        {showYaml ? "▼ Hide YAML Example" : "▶ Show YAML Example"}
                    </button>

                    {showYaml && (
                        <pre style={{
                            background: "rgba(0,0,0,0.4)",
                            padding: 16,
                            borderRadius: 8,
                            fontSize: 11,
                            color: "#67e8f9",
                            fontFamily: "monospace",
                            overflow: "auto",
                            marginTop: 12
                        }}>
                            {concept.yaml}
                        </pre>
                    )}

                    <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>Useful commands:</div>
                        {concept.commands.map((c, i) => (
                            <div key={i} style={{
                                display: "flex",
                                gap: 8,
                                padding: "6px 10px",
                                background: "rgba(0,0,0,0.2)",
                                borderRadius: 6,
                                marginBottom: 4
                            }}>
                                <code style={{ color: "#67e8f9", fontSize: 10 }}>{c.cmd}</code>
                                <span style={{ color: "#64748b", fontSize: 10 }}>— {c.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function KubernetesStorageApp() {
    const [activeConcept, setActiveConcept] = useState("volume");
    const [activeTab, setActiveTab] = useState("concepts");

    const currentConcept = concepts.find(c => c.id === activeConcept);

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
                background: "radial-gradient(ellipse at top, rgba(34,211,238,0.08) 0%, transparent 50%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        background: "rgba(34,211,238,0.1)",
                        border: "1px solid rgba(34,211,238,0.3)",
                        borderRadius: 20,
                        fontSize: 12,
                        color: "#22d3ee",
                        marginBottom: 16
                    }}>
                        <span>💾</span>
                        <span>ESSENTIAL FOR DATABASES</span>
                    </div>
                    <h1 style={{
                        fontSize: 36,
                        fontWeight: 800,
                        margin: 0,
                        background: "linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #fbbf24 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Kubernetes Storage
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 16, marginTop: 8 }}>
                        Persistent data in a world of ephemeral containers
                    </p>
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 32, justifyContent: "center", flexWrap: "wrap" }}>
                    {[
                        { id: "problem", label: "🤔 The Problem" },
                        { id: "concepts", label: "📚 Concepts" },
                        { id: "diagrams", label: "📊 Diagrams" },
                        { id: "reference", label: "📋 Reference" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "10px 16px",
                                borderRadius: 12,
                                border: activeTab === tab.id ? "1px solid #22d3ee60" : "1px solid #1e293b",
                                background: activeTab === tab.id ? "rgba(34,211,238,0.1)" : "transparent",
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

                {activeTab === "problem" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* The Problem Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.theProblem} title="The Problem: Containers Lose Data" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(248, 113, 113, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(248, 113, 113, 0.3)",
                                borderLeft: "4px solid #f87171"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#f87171", marginBottom: 8 }}>
                                    📖 Why This Is a Problem
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#fca5a5", lineHeight: 1.7 }}>
                                    <li><strong>Container filesystem is ephemeral:</strong> Everything inside the container is temporary</li>
                                    <li><strong>Crash = data loss:</strong> When a pod restarts, the container's filesystem is wiped clean</li>
                                    <li><strong>Database disaster:</strong> Imagine MySQL losing all data on every restart!</li>
                                    <li><strong>User uploads gone:</strong> Any files uploaded by users would disappear</li>
                                </ul>
                            </div>
                        </div>

                        {/* The Solution Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.theSolution} title="The Solution: Volumes" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(34, 197, 94, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(34, 197, 94, 0.3)",
                                borderLeft: "4px solid #22c55e"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#22c55e", marginBottom: 8 }}>
                                    📖 How Volumes Solve This
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#86efac", lineHeight: 1.7 }}>
                                    <li><strong>External storage:</strong> Data lives OUTSIDE the container</li>
                                    <li><strong>Mount point:</strong> Volume is attached to the container at a specific path (e.g., /data)</li>
                                    <li><strong>Survives restarts:</strong> When pod restarts, it reconnects to the same storage</li>
                                    <li><strong>Portable:</strong> Volume can even move to a different node with the pod</li>
                                </ul>
                            </div>
                        </div>

                        <div style={{
                            padding: 20,
                            background: "rgba(34, 211, 238, 0.1)",
                            borderRadius: 12,
                            border: "1px solid rgba(34, 211, 238, 0.3)"
                        }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#22d3ee", marginBottom: 12 }}>
                                🎯 Key Insight
                            </div>
                            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                                Containers are designed to be <strong style={{ color: "#e2e8f0" }}>disposable</strong>. When they crash, restart, or get rescheduled to another node, everything inside them is gone.
                                <br /><br />
                                <strong style={{ color: "#22d3ee" }}>Volumes</strong> solve this by storing data <em>outside</em> the container. The storage persists even when the container doesn't.
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "concepts" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {concepts.map((concept) => (
                            <ConceptCard
                                key={concept.id}
                                concept={concept}
                                isActive={activeConcept === concept.id}
                                onClick={() => setActiveConcept(concept.id === activeConcept ? "" : concept.id)}
                            />
                        ))}
                    </div>
                )}

                {activeTab === "diagrams" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* PV/PVC Flow Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.pvPvcFlow} title="How PV and PVC Work Together" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(139, 92, 246, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(139, 92, 246, 0.3)",
                                borderLeft: "4px solid #a78bfa"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>
                                    📖 Understanding PV ↔ PVC Relationship
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#c4b5fd", lineHeight: 1.7 }}>
                                    <li><strong>Cluster Admin:</strong> Creates PVs (the actual storage) — knows about infrastructure</li>
                                    <li><strong>Developer:</strong> Creates PVCs (storage requests) — doesn't need to know infrastructure</li>
                                    <li><strong>Binding:</strong> K8s matches PVC to a compatible PV based on size and access mode</li>
                                    <li><strong>Pod usage:</strong> Pod references the PVC, K8s mounts the bound PV automatically</li>
                                    <li><strong>Key benefit:</strong> Developers don't care if it's AWS EBS, NFS, or local disk!</li>
                                </ul>
                            </div>
                        </div>

                        {/* StorageClass Flow Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.storageClassFlow} title="Static vs Dynamic Provisioning" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(251, 191, 36, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(251, 191, 36, 0.3)",
                                borderLeft: "4px solid #fbbf24"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#fbbf24", marginBottom: 8 }}>
                                    📖 Why StorageClass Is a Game-Changer
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#fcd34d", lineHeight: 1.7 }}>
                                    <li><strong>Static (Without SC):</strong> Admin manually creates PVs, dev hopes one matches</li>
                                    <li><strong>Dynamic (With SC):</strong> Dev creates PVC, PV is auto-created on demand!</li>
                                    <li><strong>Less admin work:</strong> No need to pre-provision storage</li>
                                    <li><strong>Multiple classes:</strong> "fast-ssd" for databases, "standard" for logs</li>
                                    <li><strong>Cloud-native:</strong> Integrates with AWS EBS, GCP PD, Azure Disk automatically</li>
                                </ul>
                            </div>
                        </div>

                        {/* StatefulSet Flow Diagram */}
                        <div>
                            <MermaidDiagram chart={diagrams.statefulSetFlow} title="Deployment vs StatefulSet" />
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: "rgba(251, 146, 60, 0.1)",
                                borderRadius: 12,
                                border: "1px solid rgba(251, 146, 60, 0.3)",
                                borderLeft: "4px solid #fb923c"
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#fb923c", marginBottom: 8 }}>
                                    📖 When to Use StatefulSet
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: "#fed7aa", lineHeight: 1.7 }}>
                                    <li><strong>Deployment:</strong> Random pod names, shared storage (or none), any order</li>
                                    <li><strong>StatefulSet:</strong> Ordered names (db-0, db-1), each pod gets its OWN PVC</li>
                                    <li><strong>Stable identity:</strong> If db-0 dies, the new db-0 gets the SAME storage</li>
                                    <li><strong>Use case:</strong> Databases (MySQL, MongoDB), message queues (Kafka, RabbitMQ)</li>
                                    <li><strong>Ordered startup:</strong> db-0 must be ready before db-1 starts</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "reference" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={{
                            background: "linear-gradient(135deg, #0f172a 0%, #164e63 100%)",
                            borderRadius: 16,
                            padding: 24,
                            border: "1px solid rgba(34, 211, 238, 0.3)"
                        }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#22d3ee", marginBottom: 16 }}>
                                📋 Access Modes
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {accessModes.map((m, i) => (
                                    <div key={i} style={{
                                        padding: 12,
                                        background: "rgba(0,0,0,0.2)",
                                        borderRadius: 8,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12
                                    }}>
                                        <span style={{ fontSize: 24 }}>{m.icon}</span>
                                        <div>
                                            <code style={{ color: "#67e8f9", fontSize: 12 }}>{m.mode}</code>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{m.desc}</div>
                                            <div style={{ fontSize: 10, color: "#22c55e" }}>Use for: {m.use}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                            borderRadius: 16,
                            padding: 24,
                            border: "1px solid rgba(139, 92, 246, 0.3)"
                        }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#a78bfa", marginBottom: 16 }}>
                                📋 Reclaim Policies
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {reclaimPolicies.map((p, i) => (
                                    <div key={i} style={{
                                        padding: 12,
                                        background: "rgba(0,0,0,0.2)",
                                        borderRadius: 8,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12
                                    }}>
                                        <span style={{ fontSize: 24 }}>{p.icon}</span>
                                        <div>
                                            <code style={{ color: "#c4b5fd", fontSize: 12 }}>{p.policy}</code>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.desc}</div>
                                            <div style={{ fontSize: 10, color: "#fbbf24" }}>Use for: {p.use}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div style={{
                    marginTop: 48,
                    padding: 24,
                    background: "rgba(34, 211, 238, 0.05)",
                    border: "1px solid rgba(34, 211, 238, 0.2)",
                    borderRadius: 16,
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: 14, color: "#22d3ee", fontWeight: 600, marginBottom: 8 }}>
                        ✅ Storage Module Complete!
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>
                        You now understand: Volumes, PV, PVC, StorageClass, StatefulSet
                    </div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                        Next: Module 3 — Security & Config (protect your data with RBAC)
                    </div>
                </div>
            </div>
        </div>
    );
}
