# Veronica AI: Sovereign Intelligent System Architecture

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
