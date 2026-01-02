<!-- @format -->

# Package Audits

This directory indexes AIX (AI Experience) and DX (Developer Experience) audits for major packages in the codebase.

## Purpose

Package audits systematically review code for:

- **AIX (AI Experience)** - How well AI assistants (GitHub Copilot, etc.) can understand, predict, and suggest code
- **DX (Developer Experience)** - How easily human developers can discover, debug, and maintain the code
- **Browser-First Correctness** - Idempotency, DOM safety, event cleanup, accessibility
- **Pattern Consistency** - Identifying and standardizing canonical patterns

## Available Audits

### JavaScript Choreography System

**Location:** [../../js/choreography/audit.md](../../../js/choreography/audit.md)  
**Date:** January 2, 2026  
**Status:** Complete

Comprehensive review of the animation choreography system covering:

- Event-driven architecture (AnimationBus, Director, StageManager)
- Section lifecycle patterns (Hero, Bio, BackgroundVideo)
- Manager modules (ReducedMotion, ScrollSmoother, GelAnimation)
- GSAP integration patterns

**Key Findings:**

- P0 issues: Generic naming, inconsistent patterns, hardcoded event strings
- P1 improvements: Constructor complexity, GSAP import centralization
- Recommended: Section registry pattern, Getting Started guide

---

## Creating New Audits

Use the structured review process defined in [.copilot/review-js-choreography.prompt.md](../../../.copilot/review-js-choreography.prompt.md):

1. **Inventory & Map** - Document structure, responsibilities, data flow
2. **AIX Audit** - Identify AI-confusers and ambiguity (P0/P1/P2 priority)
3. **DX Audit** - Evaluate discoverability, debuggability, maintainability
4. **Browser-First Correctness** - Check idempotency, DOM guards, cleanup
5. **Actionable Recommendations** - Prioritized table with validation steps
6. **Canonical Pattern Proposal** - Define 1-3 patterns to standardize

Save audits in the package directory (e.g., `js/choreography/audit.md`) and link from this index.

---

## Audit Maintenance

- Run audits before major refactors
- Update audits when introducing new patterns
- Archive completed recommendations in audit file
- Use [AIX_Maintenance_Checklist.md](../AIX_Maintenance_Checklist.md) for periodic reviews

---

## Related Documentation

- [AIX Maintenance Checklist](../AIX_Maintenance_Checklist.md) - Monthly hygiene tasks
- [AI Prompts](../README.md) - General AI prompt guidelines
- [Copilot Instructions](../../../.copilot/README.md) - Repository-wide AI context
