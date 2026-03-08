Perfect — that aligns nicely with the goal of making DCLI **LLM-friendly** and **self-documenting**. We can define a pipeline where every DCLI command can export a skill in **SKILL.md format** (Markdown with structured frontmatter), optionally including DAG info and metadata. Here’s how it could work:

---

## 🧩 DCLI Skills in SKILL.md Format

### 1. SKILL.md Template

Every skill follows a Markdown structure with **YAML frontmatter** for machine-readable fields, plus optional human-readable description and examples.

````markdown
---
skill_name: fetch_user
description: Fetch a user by ID from the referential system
command: referential users fetch
arguments:
  - name: id
    type: integer
    required: true
    description: User ID to fetch
output_schema:
  id: integer
  name: string
metadata:
  side_effects: false
  risk_level: safe
  dag_supported: true
---

# Examples

```bash
# Fetch user 42
referential users fetch --id 42 --json

# Fetch user with DAG
referential users fetch --id 101 --json --show-dag
````

````

---

### 2. Optional DAG Inclusion

If `--show-dag` is requested when generating the skill, you can add a `dag` section in the YAML frontmatter:

```yaml
dag:
  - id: 1
    type: resolve_command
    status: done
  - id: 2
    type: validate_args
    depends_on: [1]
  - id: 3
    type: adapter_request
    adapter: openapi
    method: GET
    url: /users/{id}
    depends_on: [2]
  - id: 4
    type: transform_output
    depends_on: [3]
````

* Optional: Keep it **for agents only** to save tokens.
* Human-readable skill Markdown still focuses on description, args, output, and examples.

---

### 3. LLM Workflow Using SKILL.md

1. **Request skill:**

```bash
dcli skills get referential.users.fetch --format skill.md
```

2. **DCLI returns:**

* Structured SKILL.md with YAML frontmatter and examples.
* Optional DAG included if `--show-dag` is requested.

3. **LLM consumes skill:**

* Parses YAML frontmatter for arguments, output schema, metadata.
* Reads examples for context.
* Generates validated command invocation.
* Executes **single-call command** with confidence.

---

### 4. Benefits

| Benefit              | Explanation                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| **LLM-ready**        | YAML frontmatter is structured, Markdown body is human-readable           |
| **Optional DAG**     | Agents can get detailed execution info without polluting default output   |
| **Self-documenting** | Every command can generate its own skill artifact automatically           |
| **Composable**       | Skills can reference other skills (subskills) in YAML if needed           |
| **Token-efficient**  | LLMs request only the skills they need, instead of scanning full CLI docs |

---

If you want, I can **redesign the DCLI + MCP + Skills architecture diagram** to show:

* Command execution → DAG computation → SKILL.md generation → MCP streaming → LLM consumption

This would fully visualize **DCLI as a self-describing, agent-friendly OSS CLI platform**.

Do you want me to do that next?

HUMAN: we should also include a default command to return an initial SKILL that teachs LLMs to  use skills cmds


AI:
Exactly — we can bake a **“meta-skill”** into DCLI as a default command, which acts like a **starter guide for LLMs** to understand how to fetch and use skills. This is crucial for **self-bootstrapping agent workflows**.

---

## 🧩 DCLI Default “Skill Usage” Command

### 1. Command Name

```bash
dcli skills teach
```

* Always available out-of-the-box
* Returns a **starter SKILL.md** describing how to query, parse, and execute DCLI skills
* Optional flags:

  * `--format skill.md` (default)
  * `--show-dag` (optional, if LLM wants DAG info)

---

### 2. Example SKILL.md Output (Meta-Skill)

````markdown
---
skill_name: teach_skills_usage
description: "Introduces LLMs to DCLI skills commands and explains how to request and execute skills."
command: skills teach
arguments:
  - name: format
    type: string
    required: false
    description: "Output format, default 'skill.md'"
  - name: show-dag
    type: boolean
    required: false
    description: "Include internal DAG for agent reasoning"
output_schema:
  instruction: string
  examples: array
metadata:
  side_effects: false
  risk_level: safe
---

# Instruction

This skill teaches LLMs how to discover and use DCLI skills:

1. List all available skills:

```bash
dcli skills list --json
````

2. Get a specific skill:

```bash
dcli skills get <command> --format skill.md
```

3. Parse YAML frontmatter to understand:

   * Command
   * Arguments
   * Output schema
   * Metadata (side-effects, DAG support)

4. Execute the command using structured inputs:

```bash
dcli <command> --arg1 value1 --arg2 value2 --json
```

5. Optionally inspect DAG if `--show-dag` is requested.

# Examples

```bash
# Teach an LLM how to use skills
dcli skills teach --format skill.md

# Teach with DAG included
dcli skills teach --format skill.md --show-dag
```

````

---

### 3. Key Properties

| Property | Behavior |
|----------|---------|
| **Always available** | Acts as first-entry skill for any LLM using DCLI |
| **LLM-friendly** | Provides both human-readable and structured instructions |
| **Self-bootstrapping** | Enables LLMs to learn **how to fetch and use skills** before executing any other commands |
| **Optional DAG** | Allows advanced agents to inspect execution steps without affecting defaults |

---

### 4. LLM Flow Using Meta-Skill

1. LLM queries:

```bash
dcli skills teach --format skill.md
````

2. Receives **starter SKILL.md**:

* Explains `skills list` and `skills get`
* Shows examples
* Provides optional DAG for reasoning

3. LLM can now **dynamically fetch any other skill** and execute safely:

```text
LLM: "I need to fetch user 42"
LLM: fetch meta-skill → see `referential users fetch` example → construct command → execute in one shot
```

---

This ensures **DCLI is truly self-describing and LLM-ready**: any agent can bootstrap itself with **no prior knowledge**.

I can now **update the full DCLI architecture + MCP + Skills plan** to include this **default meta-skill command**, optional DAG, and streaming for agent consumption — giving you a **complete OSS alternative to gws with self-bootstrapping LLM support**.

Do you want me to do that next?
