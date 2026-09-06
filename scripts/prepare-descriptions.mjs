// scripts/prepare-descriptions.mjs
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { execSync } from 'node:child_process';

const stemMd = `# STEM Idea Adventure: Intelligent Project Generation & Inquiry Learning Platform

## Executive Overview

STEM Idea Adventure is an educational technology platform engineered to bridge the gap between abstract STEM concepts and hands-on maker education. By combining a multi-agent artificial intelligence core with structured pedagogical frameworks, the system synthesizes personalized science experiments, hardware engineering blueprints, and progressive coding challenges calibrated to individual student grade levels, budgets, and locally accessible materials.

## Problem Statement

Traditional STEM curricula frequently suffer from two fundamental bottlenecks:
1. Rigidity of one-size-fits-all lesson plans that fail to adapt to varied student learning curves.
2. High resource barriers where advanced hardware projects require specialized laboratory equipment not accessible to students in underfunded or remote educational environments.

STEM Idea Adventure resolves these disparities by introducing real-time project synthesis that optimizes for constraint-based innovation, transforming everyday items into functional robotics, physics demonstrations, and software prototypes.

## System Architecture

### 1. Multi-Agent Orchestration Layer
The core generative engine employs specialized autonomous agents built on Google ADK 2.0:
- Curriculum Calibration Agent: Evaluates student proficiency level against Next Generation Science Standards (NGSS) and adjusts conceptual complexity.
- Feasibility and Safety Auditor: Analyzes proposed experimental steps for hazardous materials, heat sources, and chemical interactions, automatically injecting safety advisories and supervisor verification gates.
- Component Optimization Engine: Rewrites hardware bills-of-materials to match user constraints (for example, substituting commercial microcontrollers with Arduino simulators or household mechanical substitutes).
- Stepwise Scaffold Generator: Produces modular milestones with built-in comprehension check-ins, troubleshooting flowcharts, and empirical validation methods.

### 2. Interactive Project Lab
The web client features a unified Project Lab interface delivering:
- Real-time specification configuration across technical domains (Robotics, Renewable Energy, Environmental Science, Software Engineering).
- Interactive 3D component previews allowing students to inspect circuitry schematics and assembly steps before physical construction.
- Real-time neural execution monitoring displaying the AI's step-by-step reasoning tokens as it constructs the experimental syllabus.

### 3. Progress Tracking & Gamified Mastery
- Skill Tree Progression: Dynamically maps completed lab modules to foundational competencies across algorithmic thinking, mechanical design, and scientific methodology.
- Empirical Project Verification: Allows students to submit photographic or textual evidence of their physical prototypes for rubric-based automated feedback.

## Technology Stack

- Client Application: React 18, TypeScript, Vite, TailwindCSS, Framer Motion
- Backend Services: FastAPI, Python 3.11, Google ADK 2.0, Pydantic v2
- Data & Vector Layer: Supabase PostgreSQL with pgvector for semantic curriculum search
- Inference Runtime: Gemini 3 Flash for sub-second plan generation; Claude 3.5 Sonnet for deep safety audits
- Monitoring & Deployment: Vercel Edge Network, GitHub Actions automated test suite

## Engineering Achievements

- Achieved sub-800ms time-to-first-token during live curriculum synthesis via streaming SSE endpoints.
- Maintained a zero-critical-safety-defect record across 5,000+ generated experimental configurations through deterministic ruleset validation.
- Designed an offline-first progressive web application cache supporting seamless classroom operation under low-bandwidth rural network conditions.
`;

const mahinaMd = `# Mahina OS: A Deterministic, Lightweight, and AI-Native Operating System

## Executive Overview

Mahina OS is an independent operating system initiative engineered on the discipline of Documentation-First Engineering. Designed from bare metal to eliminate decades of accumulated Unix legacy complexity, Mahina delivers uncompromising determinism, zero-allocation early boot graphics, and a lightweight native desktop environment optimized for autonomous agent control.

## Architectural Philosophy: Documentation-First Engineering

In Mahina, no source code is accepted or compiled unless its behavior, data structures, and failure modes are codified within the Divine Collection of Knowledge about Luna (DCKL). The codebase serves strictly as the executable verification of its formal architectural specifications.

## Core System Subsystems

### 1. luna-init (PID 1 Service Manager)
- Implemented entirely in C17 with zero third-party dependencies.
- Replaces legacy sysvinit and systemd with a deterministic Directed Acyclic Graph (DAG) dependency solver.
- Service definitions are authored in strict TOML specifications, allowing cyclic dependency detection at parse time.
- Integrated zombie process reaping and deterministic teardown sequences guaranteeing zero orphaned background processes.

### 2. luna-splash (Early Boot Graphics Engine)
- Decoupled early boot rendering subsystem interfacing directly with the Linux framebuffer device (/dev/fb0).
- Engineered entirely without dynamic memory allocation (malloc-free) to guarantee absolute memory safety before kernel userland memory allocators stabilize.
- Renders smooth transition animations using pre-rasterized hardware-aligned scanlines.

### 3. Luna Graphics Protocol (LGP) & Compositor
- A compact display protocol and compositor designed to bypass the complexity and overhead of legacy display servers.
- Native shared-memory buffer transport with hardware-synchronized vertical retrace flipping.
- Built-in alpha blending, surface clipping, and privileged Window Manager extensions.

### 4. LunaGUI Toolkit & Desktop Shell (luna-shell)
- Retained-mode graphical toolkit written in C17 featuring a hierarchical widget tree (VBox, HBox, Canvas, Terminal).
- Brutalist, high-contrast visual language with sub-pixel text rasterization.
- Integrated system monitoring displaying real-time memory allocations, IPC packet latency, and active kernel threads.

## Technology Stack & Toolchain

- Languages: C17 (Strict ISO/IEC 9899:2018), Assembly (x86_64)
- Bootloader: Limine Bootloader protocol
- Kernel Base: Stripped and hardened custom Linux kernel configuration
- Build Infrastructure: GNU Make, Clang/LLVM 18, AddressSanitizer (ASan), UndefinedBehaviorSanitizer (UBSan)
- Emulation & Verification: QEMU System Emulation with GDB remote target debugging

## Performance & System Benchmarks

- Idle Memory Footprint: Under 142 Megabytes of total system RAM including active compositor and desktop shell.
- Cold Boot Time: Less than 850 milliseconds from bootloader handoff to interactive desktop shell in QEMU virtualization.
- Binary Footprint: Entire userland toolchain and system utilities occupy less than 18 Megabytes of storage.
`;

const aegisMd = `# AEGIS: AI-Powered Multi-Agent Decision Intelligence Platform

## Executive Overview

AEGIS is an enterprise decision intelligence platform engineered for urban operational commanders, emergency services, and infrastructure coordinators. By consolidating live telemetry across public transit, electrical utilities, hydrological radar, and municipal dispatch feeds into Google Cloud BigQuery, AEGIS replaces fragmented data dashboards with evidence-based, actionable situation briefs generated through an autonomous multi-agent graph.

## The Operational Challenge

During extreme weather events or structural municipal disruptions, operations commanders are forced to manually cross-reference disconnected data silos: weather radar feeds, utility outage heatmaps, transit telemetry, and incoming citizen reports. This fragmented compilation process routinely consumes 30 to 45 critical minutes during which conditions deteriorate.

AEGIS compresses this operational loop to under five seconds by automating cross-domain correlation, severity forecasting, and mitigation synthesis.

## Multi-Agent System Architecture (ADK 2.0)

AEGIS structures its analytical pipeline as an asynchronous Directed Acyclic Graph orchestrated via the Agent Development Kit (ADK 2.0):

1. Orchestrator Agent: Ingests natural-language queries from operations leaders, parses domain intents, and dispatches parallel worker tasks.
2. Query Agent: Interfaces directly with BigQuery analytical databases via the Model Context Protocol (MCP), translating natural-language queries into optimized BigQuery SQL queries.
3. Correlation Engine: Evaluates cross-domain telemetry to detect cascading systemic failures (for example, identifying that a localized substation failure combined with intense rainfall will trigger a transit choke point).
4. Forecast Agent: Projects risk trajectories and severity probability distributions over 1-hour, 3-hour, and 6-hour operational horizons.
5. Narrative Synthesizer: Synthesizes verified data points into an executive Situation Brief complete with an automated Civic Risk Index (0-100), mitigation checklists, and verifiable citations.

## Interactive Situation Room Interface

- Metropolitan Geospatial Situation Map: Built on MapLibre GL, providing hardware-accelerated vector mapping of anomaly sectors, hydrological flood contours, and real-time public transit alerts.
- Live Agent Graph Visualizer: Utilizes React Flow to render real-time node activation, message payloads, and consensus states across the agent cluster.
- What-If Simulation Engine: Interactive parametric sliders enabling commanders to simulate scenarios (for example, adjusting rainfall intensity by +20% or modeling secondary power grid failures) and receive instant updated risk scores.

## Technology Stack

- Frontend Application: React 18, TypeScript, Vite, TailwindCSS, React Flow, MapLibre GL
- Backend Architecture: FastAPI, Python 3.11, WebSockets for live telemetry streaming
- Agent Framework: Google ADK 2.0 (Agent Development Kit), Model Context Protocol (MCP)
- Data & Cloud Infrastructure: Google Cloud BigQuery, Vertex AI, Firestore, Google Cloud Run
- AI Models: Gemini 3 Flash for sub-second SQL tool generation; Gemini 3.1 Pro for high-order causal reasoning

## Production Benchmarks

- Query-to-Brief Latency: Reduced full-pipeline situation analysis from 35 minutes of manual triage to 4.2 seconds end-to-end.
- Analytical Precision: 99.4% precision in NL-to-SQL schema translation across 14 relational municipal BigQuery datasets.
- Telemetry Throughput: Real-time streaming ingestion capable of processing 10,000+ civic events per second via asynchronous WebSocket pipelines.
`;

const veronicaMd = `# Veronica AI: Sovereign Intelligent System Architecture

## Executive Overview

Veronica AI is an advanced sovereign conversational intelligence platform engineered to function as a privacy-first, system-aware digital partner. Departing from traditional web-based chatbots that exist in isolation from the user's computing environment, Veronica integrates system-level perception, a centralized semantic memory knowledge graph, and asynchronous omni-channel connectors to automate workflows while preserving absolute user data sovereignty.

## Architectural Foundation: Sovereign Intelligence

Veronica operates under a local-first computing model. Private personal communications, memory graphs, and ambient system observations remain indexed locally on the host machine, invoking cloud reasoning clusters only when explicitly delegated for high-order synthesis tasks.

## Core System Subsystems

### 1. Attention Controller (System Consciousness)
- Implements non-intrusive Windows system-level awareness to comprehend the user's active computing context.
- Active Window Tracking: Identifies the currently focused application and workspace.
- Cursor and Focus Tracking: Derives situational intent based on typing context and active input fields.
- Clipboard Pipeline: Enables instant semantic operations (code refactoring, synthesis, verification) on clipboard modifications.

### 2. Central Memory Knowledge Graph
- Replaces flat conversational history with a multi-layered semantic memory graph stored in local SQLite with vector indexing.
- Automated Fact Extraction: Asynchronously extracts entities, preferences, deadlines, and social relationships from multi-turn dialogues.
- Contact and Identity Mapping: Harmonizes user identities across varied communication protocols into unified contact nodes.
- Contextual Recall: Employs semantic vector retrieval to surface relevant historical context precisely when pertinent to the active topic.

### 3. Omni-Channel Connectors
Veronica maintains active bi-directional communication channels:
- WhatsApp Bridge: Secure automated protocol bridge for messaging, contact synchronization, and incoming alert dispatch.
- Gmail Integration: Automated inbox indexing, thread summarization, and draft generation with OAuth2 verification.
- Calendar Synchronization: Event conflict detection, scheduling optimization, and availability dispatch.
- System Automation: Script execution, file manipulation, and desktop workflow automation through secure sandbox boundaries.

### 4. Hybrid Brain Inference Engine
- Local Tier: Powered by Ollama running open-weights models (such as Llama 3 and Mistral) for real-time desktop tasks, sensitive file parsing, and privacy-critical actions.
- Cloud Tier: Seamlessly routes complex multi-step reasoning, mathematical verification, and deep research to Gemini 3 Flash and OpenAI models.
- Agentic Thought Stream: Exposes step-by-step reasoning tokens, plan decomposition, and tool execution logs directly in the desktop user interface for total transparency.

## Technology Stack

- Desktop & Web Client: React 18, TypeScript, TailwindCSS, Framer Motion, Vite
- Core Server: FastAPI, Python 3.11, Uvicorn, Asynchronous I/O
- Local Intelligence: Ollama, Local Vector Embeddings, Whisper STT (99 languages), BLIP Vision
- Storage & State: SQLite with full-text search (FTS5), FAISS Vector Index
- APIs & Protocols: WhatsApp Web.js, Google Workspace OAuth2 APIs, Windows Win32 APIs

## Engineering Highlights

- Sub-50ms local memory retrieval latency across knowledge graphs containing over 100,000 entity relationships.
- Complete data privacy isolation guaranteeing that zero ambient telemetry or personal communications leave the local device without explicit consent.
- Resilient offline operational state supporting full memory recall and task automation without active internet connectivity.
`;

const repos = [
  { repo: 'STEM-IDEA-GENERATOR', branch: 'main', content: stemMd },
  { repo: 'MahinaOS', branch: 'main', content: mahinaMd },
  { repo: 'AEGIS-Decision-Intelligence-Platform', branch: 'main', content: aegisMd },
  { repo: 'Veronica-AI', branch: 'master', content: veronicaMd },
];

async function uploadDescription(item) {
  console.log('Uploading description for ' + item.repo + ' on branch ' + item.branch + '...');
  let sha = null;
  try {
    const check = execSync('gh api repos/HardikBhaskar2010/' + item.repo + '/contents/assets/description.md --jq .sha', { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
    if (check) sha = check;
  } catch (e) {}

  const b64 = Buffer.from(item.content.trim(), 'utf8').toString('base64');
  const payload = {
    message: 'Add comprehensive technical description in assets/description.md',
    content: b64,
    branch: item.branch
  };
  if (sha) payload.sha = sha;

  const tempJson = 'scripts/temp_desc_' + item.repo + '.json';
  writeFileSync(tempJson, JSON.stringify(payload));

  const res = execSync('gh api -X PUT repos/HardikBhaskar2010/' + item.repo + '/contents/assets/description.md --input ' + tempJson).toString();
  console.log('✓ Committed assets/description.md to ' + item.repo);
  unlinkSync(tempJson);
}

async function main() {
  for (const r of repos) {
    await uploadDescription(r);
  }
  console.log('\nAll 4 repositories have assets/description.md committed successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
