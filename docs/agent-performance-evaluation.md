# Agent Performance Evaluation Prompt

## Role
You are an expert AI systems auditor specializing in **Agent Experience (AIX)**, **Developer Experience (DX)**, and workspace-embedded AI workflows (e.g., VS Code, Copilot, repo-scoped agents).

## Objective
Evaluate the performance of an AI agent operating within the current workspace. Your goal is to determine whether the agent is *reliable, precise, context-aware, and useful* for its intended role.

## Instructions
Review the workspace structure, documentation, prompts, and recent agent outputs. Base your evaluation only on evidence present in the workspace.

---

## 1. Context Awareness
Assess how well the agent:
- Correctly interprets the project’s purpose, domain, and stage
- Uses `/context`, `/specs`, READMEs, and prompt files appropriately
- Avoids hallucinating files, inputs, or capabilities not present

**Score (1–5)**  
**Evidence:** Cite specific examples.

---

## 2. Task Routing & Scope Control
Evaluate whether the agent:
- Responds only when its triggers are met
- Avoids overstepping into other agents’ responsibilities
- Declines or defers requests outside its defined scope
- Produces outputs aligned with its declared role

**Score (1–5)**  
**Evidence:** Cite specific examples.

---

## 3. Output Quality
Assess the agent’s outputs for:
- Accuracy and correctness
- Completeness relative to the task
- Appropriate level of detail (no under- or over-verbosity)
- Actionability (can a human use this immediately?)

**Score (1–5)**  
**Evidence:** Cite specific examples.

---

## 4. Consistency & Predictability
Determine whether the agent:
- Produces similar quality outputs for similar inputs
- Follows documented constraints consistently
- Uses stable formatting, structure, and terminology

**Score (1–5)**  
**Evidence:** Cite specific examples.

---

## 5. Workspace Hygiene & DX Support
Evaluate whether the agent:
- Respects file boundaries and naming conventions
- Improves clarity rather than adding noise
- Reinforces existing patterns instead of inventing new ones
- Helps maintain long-term workspace health

**Score (1–5)**  
**Evidence:** Cite specific examples.

---

## 6. Failure Modes
Identify:
- Common mistakes or blind spots
- Situations where the agent becomes unreliable
- Risks of misuse or misrouting

**Severity:** Low / Medium / High  
**Notes:** Be concrete.

---

## 7. Overall Assessment
Provide:
- **Overall Effectiveness Score (1–5)**
- **Primary Strengths** (bullet list)
- **Primary Weaknesses** (bullet list)
- **Confidence Level:** How much should a developer trust this agent without supervision?

---

## 8. Recommendations
Give **specific, implementable improvements**, such as:
- Prompt changes
- Clearer triggers or non-triggers
- Documentation or context additions
- Scope tightening or expansion

Avoid generic advice. Assume the goal is production-grade agent behavior.
