# Architecture

```text
Authenticated user
       |
       v
Node.js HTTP API ─────────────── Static dashboard (HTML/CSS/JS)
       |
       +--> Authentication / session store (PostgreSQL)
       |
       +--> Request planner (allowlisted lead-workflow operations)
       |
       +--> Workflow orchestrator
                |
                +--> Lead discovery agent ─────── PostgreSQL leads
                +--> Lead qualification agent ─── Gemini Interactions API or rule fallback
                +--> CRM update agent ─────────── PostgreSQL leads + audit events
                +--> Follow-up agent ──────────── PostgreSQL draft outbox
                +--> Insights agent ───────────── workflow and lead metrics
                |
                v
        Action authorization gateway
                |
                +--> Routine allowed updates execute
                +--> Restricted external action -> approval queue
                +--> Denied action -> audit record
```

## Data ownership and tenant scope

Each user belongs to a tenant. All business-data reads/writes use the tenant id read from the authenticated server-side session; callers cannot select an arbitrary tenant. The seed script creates a new tenant and sample leads in `ai_workforce_db`. It does not connect to or migrate Chintu's database.

## Agent contract

Agents cannot run arbitrary SQL and do not hold database credentials. The orchestration layer calls fixed server-side functions with validated inputs. Database writes go through parameterized SQL and permission checks. The planner only chooses from the supported lead workflow; it does not invent new backend tools from model output.

## Execution model

Workflow runs and task state are persisted in PostgreSQL. The MVP worker runs in the Node process and updates task state as it progresses. Failed runs report partial updates; they are not falsely described as fully rolled back. For production, move execution into a durable queue/worker with leases, idempotency keys, retry policies, dead-letter handling, and recovery after process restarts.

## AI data handling

Gemini is called only for lead qualification/draft content when an API key is configured. The adapter sends only lead reference labels and business metadata (company, role/title, industry, source, current status/score, and a value band); contact names, addresses, phone numbers, free-text notes, and true database IDs are omitted. Requests set `store:false`. The app can use a rules-based fallback when the model is not configured or returns an unusable response.

## Integration boundary

PostgreSQL CRUD is real. The email provider is deliberately simulated. Approval marks an exact set of draft records `simulated_sent` and records the human decision; it never invokes SMTP or a live messaging API.
