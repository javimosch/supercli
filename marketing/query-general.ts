#!/usr/bin/env bun
/**
 * General query constants for GitHub search
 */

import { DEVOPS_QUERIES } from "./query-general-devops";
import { APP_QUERIES } from "./query-general-apps";
import { MEDIA_QUERIES } from "./query-general-media";

export const GENERAL_QUERIES = [
  ...DEVOPS_QUERIES,
  ...APP_QUERIES,
  ...MEDIA_QUERIES,
  "email CLI",
  "SMS CLI",
  "push notification CLI",
  "chat CLI",
  "messaging CLI",
  "documentation CLI",
  "API documentation CLI",
  "code documentation CLI",
  "markdown CLI",
  "static site generator CLI",
  "blog CLI",
  "CMS CLI",
  "e-commerce CLI",
  "payment CLI",
  "subscription CLI",
  "billing CLI",
  "invoice CLI",
  "accounting CLI",
  "finance CLI",
  "trading CLI",
  "stock CLI",
  "crypto CLI",
  "blockchain CLI",
  "smart contract CLI",
  "NFT CLI",
  "Web3 CLI",
  "game CLI",
  "game development CLI",
  "game server CLI",
  "game modding CLI",
  "emulator CLI",
  "simulation CLI",
  "VR CLI",
  "AR CLI",
  "3D CLI",
  "rendering CLI",
  "modeling CLI",
  "sculpting CLI",
  "texturing CLI",
  "rigging CLI",
  "physics CLI"
];
