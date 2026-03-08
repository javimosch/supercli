Below is a **minimal architecture that fits ~1500 LOC total** while keeping **every file <500 LOC**, modular, and aligned with:

* NodeJS
* MongoDB (native driver)
* EJS
* Vue3 CDN
* Tailwind CDN
* DaisyUI CDN
* zero build tools

The system has **two binaries**:

```
/server   -> config control plane
/cli      -> runtime CLI
```

---

# 1. Project Structure

```
dcli/

server/
  app.js
  db.js

  routes/
    commands.js
    config.js
    specs.js
    mcp.js

  services/
    configService.js

  views/
    layout.ejs
    commands.ejs
    command-edit.ejs
    specs.ejs
    mcp.ejs

  public/
    app.js

cli/
  dcli.js
  config.js
  executor.js

  adapters/
    openapi.js
    mcp.js
    http.js
```

Approx LOC:

```
server
app.js                150
db.js                 30
routes/*              350
services/*            200
views                 200
public/app.js         150

cli
dcli.js               150
config.js             120
executor.js           120
adapters/*            200
```

Total ≈ **1500 LOC**

---

# 2. MongoDB Schema

No ODM.

Collections:

```
commands
specs
mcp
settings
```

---

## commands

```
{
  _id: ObjectId,

  namespace: "referential",
  resource: "users",
  action: "fetch",

  description: "Fetch user",

  adapter: "openapi",

  adapterConfig: {
    spec: "referential-api",
    operationId: "getUser"
  },

  args: [
    {
      name: "id",
      type: "string",
      required: true
    }
  ],

  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

---

## specs

```
{
  _id: ObjectId,
  name: "referential-api",
  url: "https://api.company.com/openapi.json",
  auth: "none"
}
```

---

## mcp

```
{
  _id: ObjectId,
  name: "ai-tools",
  url: "https://mcp.company.com"
}
```

---

## settings

```
{
  key: "config_version",
  value: "1"
}
```

---

# 3. Server Runtime

## server/app.js

Responsibilities:

```
express server
view engine
static assets
mount routes
```

Example skeleton:

```javascript
const express = require("express")
const path = require("path")

const commands = require("./routes/commands")
const config = require("./routes/config")
const specs = require("./routes/specs")
const mcp = require("./routes/mcp")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use("/static",express.static("public"))

app.use("/api/config",config)
app.use("/api/commands",commands)
app.use("/api/specs",specs)
app.use("/api/mcp",mcp)

app.get("/",(req,res)=>res.redirect("/commands"))

app.listen(3000)
```

---

# 4. Config Service

Central piece.

## services/configService.js

Responsibilities:

```
aggregate commands
attach specs
return CLI config
```

Example response:

```
{
  version: "12",
  ttl: 3600,
  commands: [...]
}
```

Pseudo:

```javascript
async function getCLIConfig(db){

  const commands = await db.collection("commands").find().toArray()

  const version = await db.collection("settings")
    .findOne({key:"config_version"})

  return {
    version: version.value,
    ttl: 3600,
    commands
  }

}
```

---

# 5. CLI Config Endpoint

## GET

```
/api/config
```

Response:

```
{
  version: "12",
  ttl: 3600,
  commands: [...]
}
```

---

# 6. CLI Runtime

Binary:

```
cli/dcli.js
```

Usage:

```
dcli <namespace> <resource> <action> [args]
```

Example:

```
dcli referential users fetch --id 42
```

---

# 7. CLI Cache

Location:

```
~/.dcli/config.json
```

Structure:

```
{
  version: "12",
  fetchedAt: 1700000,
  ttl: 3600,
  commands: [...]
}
```

---

## cli/config.js

Responsibilities:

```
load cache
check ttl
fetch remote config
```

Pseudo:

```javascript
async function loadConfig(){

  if(cacheExists()){
    if(ttlValid()){
      return readCache()
    }
  }

  const res = await fetch(SERVER+"/api/config")
  const cfg = await res.json()

  writeCache(cfg)

  return cfg
}
```

---

# 8. CLI Command Parsing

Example input:

```
dcli referential users fetch --id 42
```

Parse:

```
namespace = referential
resource = users
action = fetch
args = { id:42 }
```

Minimal parser:

```
process.argv
```

---

# 9. Command Resolution

Inside CLI:

```
cmd = config.commands.find(
 c.namespace==ns &&
 c.resource==res &&
 c.action==act
)
```

---

# 10. Executor

## cli/executor.js

Responsibilities:

```
select adapter
execute command
```

Example:

```
switch(adapter)
```

```
openapi
mcp
http
```

---

Example:

```javascript
async function execute(cmd,args){

 if(cmd.adapter==="openapi"){
   return openapi.execute(cmd,args)
 }

 if(cmd.adapter==="mcp"){
   return mcp.execute(cmd,args)
 }

}
```

---

# 11. OpenAPI Adapter

## adapters/openapi.js

Responsibilities:

```
fetch spec
resolve operation
build request
execute
```

Pseudo:

```
load spec
find operationId
resolve path
replace params
call API
```

Example:

```javascript
async function execute(cmd,args){

 const spec = await fetchSpec(cmd.adapterConfig.spec)

 const op = findOperation(spec,cmd.adapterConfig.operationId)

 const url = buildUrl(op,args)

 const res = await fetch(url)

 return res.json()

}
```

---

# 12. MCP Adapter

## adapters/mcp.js

Example request:

```
POST /tool
```

Body:

```
{
  tool:"summarize",
  input:{...}
}
```

---

# 13. Web UI

Server-rendered using **EJS + Vue CDN**.

Pages:

```
/commands
/commands/new
/specs
/mcp
```

---

# 14. layout.ejs

Includes:

```
tailwind CDN
daisyUI CDN
vue CDN
```

Example:

```
https://cdn.tailwindcss.com
https://cdn.jsdelivr.net/npm/daisyui
https://unpkg.com/vue@3
```

---

# 15. Commands Page

Table view:

```
namespace
resource
action
adapter
```

Example row:

```
referential users fetch openapi
```

Buttons:

```
edit
delete
```

---

# 16. Command Editor

Fields:

```
namespace
resource
action
adapter
description
adapterConfig
args
```

Args UI:

```
+ add arg
name
type
required
```

Handled by Vue.

---

# 17. Vue App

Single file:

```
public/app.js
```

Example:

```javascript
const app = Vue.createApp({

  data(){
    return {
      commands:[],
      loading:true
    }
  },

  async mounted(){
    const r = await fetch("/api/commands")
    this.commands = await r.json()
    this.loading=false
  }

})

app.mount("#app")
```

---

# 18. Config Version Bump

Whenever command/spec/mcp changes:

```
db.settings.updateOne(
 {key:"config_version"},
 {$inc:{value:1}}
)
```

This forces CLI refresh.

---

# 19. Example CLI Session

```
dcli help
```

Output:

```
namespaces:
referential
ai
infra
```

---

```
dcli referential
```

```
resources:
users
groups
```

---

```
dcli referential users
```

```
actions:
fetch
list
create
```

---

```
dcli referential users fetch --id 42
```

Result:

```
{
 id:42,
 name:"Alice"
}
```

---

# 20. Key Design Principle

The CLI **knows nothing about commands**.

It only understands:

```
namespace resource action
```

Everything else is **data-driven**.

---

# 21. Why This Architecture Works

It creates a **platform primitive**:

```
cloud defined CLI
```

Which can orchestrate:

```
APIs
AI tools
infra
automation
```

Through a single runtime.

---

If you'd like, I can also show you the **3 killer features that would make this project explode on GitHub (and differentiate it from existing CLIs)**.
