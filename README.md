# Cloover Protocol Subgraphs

The Cloover Protocol subgraphs index data from the protocol smart contracts, and expose a GraphQL endpoint hosted by [The Graph](https://thegraph.com).

- [Active Deployments](#active-deployments)
- [Usage](#usage)
- [Development](#deployment)

---

## Active deployments

### Production networks
- [Polygon](https://thegraph.com/hosted-service/subgraph/cloover-xyz/cloover-v1-polygon)

### Test networks
- [Sepolia](https://thegraph.com/studio/subgraph/cloover-v1-sepolia/)

--- 

## Usage

Subgraphs can be queried directly from the graph explorer, or from [another application](https://thegraph.com/docs/en/developer/querying-from-your-app/). The following section gives common queries for Cloover protocol data.

### Helpful Queries

See [TheGraph API](https://thegraph.com/docs/en/developer/graphql-api/) docs for a complete guide on querying capabilities.

---
## Development

```bash

# copy env and adjust its content with your personal access token and subgraph name

# you can get an access token from https://thegraph.com/explorer/dashboard
cp .env.example .env

# install project dependencies
pnpm i

# to regenrate types if schema.graphql has changed
pnpm run subgraph:codegen

# to run a test build of your subgraph
pnpm run subgraph:build

# now you're able to deploy to thegraph hosted service with one of the deploy commands:
pnpm run deploy:hosted:polygon

```