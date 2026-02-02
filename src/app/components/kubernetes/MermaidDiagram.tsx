import { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';

// Track if mermaid has been initialized
let mermaidInitialized = false;

function initMermaid() {
    if (mermaidInitialized) return;

    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
            primaryColor: '#818cf8',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#6366f1',
            lineColor: '#64748b',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            background: '#030712',
            mainBkg: '#1e1b4b',
            secondBkg: '#0f172a',
            border1: '#334155',
            border2: '#475569',
            arrowheadColor: '#94a3b8',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            nodeBorder: '#6366f1',
            clusterBkg: 'rgba(30, 41, 59, 0.8)',
            clusterBorder: '#475569',
            edgeLabelBackground: '#1e293b',
            noteTextColor: '#e2e8f0',
            noteBkgColor: '#1e293b',
            noteBorderColor: '#475569',
        },
        flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 20,
            nodeSpacing: 50,
            rankSpacing: 50,
        },
        securityLevel: 'loose',
    });

    mermaidInitialized = true;
}

interface MermaidDiagramProps {
    chart: string;
    title?: string;
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
    const [svgContent, setSvgContent] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const reactId = useId();
    const renderCountRef = useRef(0);

    useEffect(() => {
        // Initialize mermaid on first use
        initMermaid();

        const renderDiagram = async () => {
            try {
                setError(null);
                setIsLoading(true);

                // Clean up the chart string
                const cleanChart = chart.trim();

                // Generate a unique ID for this render
                renderCountRef.current += 1;
                const uniqueId = `mermaid-${reactId.replace(/:/g, '')}-${renderCountRef.current}`;

                // Validate the syntax first
                const isValid = await mermaid.parse(cleanChart);

                if (isValid) {
                    // Render the diagram to get SVG string
                    const { svg } = await mermaid.render(uniqueId, cleanChart);
                    setSvgContent(svg);
                    setIsLoading(false);
                }
            } catch (err: any) {
                console.error('Mermaid render error:', err);
                setError(err.message || 'Failed to render diagram');
                setIsLoading(false);
                // Show the code as fallback
                setSvgContent('');
            }
        };

        renderDiagram();
    }, [chart, reactId]);

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                borderRadius: 16,
                padding: 24,
                border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
        >
            {title && (
                <div
                    style={{
                        fontSize: 14,
                        color: '#a78bfa',
                        marginBottom: 16,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <span>🗺️</span> {title}
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: 12,
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 8,
                        marginBottom: 12,
                        fontSize: 12,
                        color: '#fca5a5',
                    }}
                >
                    ⚠️ Diagram rendering issue - showing code instead
                </div>
            )}

            <div
                style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: 12,
                    padding: 20,
                    overflow: 'auto',
                    minHeight: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {isLoading && !error && (
                    <div style={{ color: '#64748b', fontSize: 14 }}>Loading diagram...</div>
                )}

                {svgContent && !error && (
                    <div
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                        style={{ width: '100%' }}
                    />
                )}

                {error && (
                    <pre
                        style={{
                            color: '#94a3b8',
                            fontSize: 11,
                            whiteSpace: 'pre-wrap',
                            margin: 0,
                            width: '100%',
                        }}
                    >
                        {chart.trim()}
                    </pre>
                )}
            </div>
        </div>
    );
}

export default MermaidDiagram;
