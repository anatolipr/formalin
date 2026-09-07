// NOT auto-called anywhere in this repo (deliberately) - formalin connects
// to js-bridge-mcp only via the manual get_embed_snippet DevTools-paste
// path, unlike htmlpaint.com/mindfoo/bulletino-1's auto-connect-on-load
// setup. This module exists so a future connect-button UI (or a deliberate
// later decision to auto-connect) has a ready-made wrapper to call, but
// nothing in main1.ts/main2.ts/mainEdit.ts currently imports or calls
// initMcpConnect() - importing this file alone does not open a connection.
//
// Thin per-app wrapper around js-bridge-mcp's own published SDK
// (js-bridge-mcp/client, resolved from node_modules like any other
// dependency) - the actual probe/connect/rename/leave-old-channel
// lifecycle, plus automatic tool-bus loading, lives there so this project
// doesn't hand-roll it. Modeled on mindfoo's src/mcp-connect.ts (same
// contract, same SDK) - see that file for the fuller design rationale,
// though mindfoo (unlike this file) DOES call initMcpConnect() at boot.
//
// formalin has no existing connect-button UI (confirmed: no .svelte file
// references "connect" anywhere in this repo), so unlike mindfoo's
// equivalent file this doesn't wrap connection state in a reactive store -
// there's no UI to read one yet, and formalin's own reactive primitive is
// avos's Foo (src/data/stores.ts), not avosignals, so introducing
// avosignals here for a currently-unused Signal would be an unjustified
// new dependency. onConnectionStateChange is exported plain (a subscribe
// function) for a future UI to wrap in whatever store it needs then.
//
// js-bridge-mcp/client is a normal bundled npm import - it resolves at
// build time regardless of whether the js-bridge-mcp *server* happens to
// be running, so no top-level-await/stub-swap dance is needed:
// connectMcpBridge() returns its API object synchronously. Its internal
// tool-bus load and this module's own init()/handleConnectClick() calls
// still probe reachability and no-op gracefully if js-bridge-mcp isn't
// running.
//
// Connection identity is a named CHANNEL, not a session-minted tenant UUID:
// js-bridge-mcp's channel support (mcp-tenant-lib 0.3.3+) makes a channel
// name the same string-keyed tenant id its main.js accepts via the `tenant`
// query param - so formalin can connect with a fixed, human-readable name
// (default "formalin") with zero interaction, and any MCP client can attach
// to the exact same live connection via join_channel("formalin") - but only
// once something actually calls initMcpConnect()/handleConnectClick().

import { connectMcpBridge } from 'js-bridge-mcp/client';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

const connect = connectMcpBridge({ appName: 'formalin' });

// Subscribe for connection-state changes (state, channel, appLabel) - a
// future connect-button UI would wrap this in whatever reactive primitive
// it needs (a Foo store, to match formalin's own convention) rather than
// this module imposing one nothing currently reads.
export const onConnectionStateChange = connect.onConnectionStateChange;
export const getConnectionState = connect.getConnectionState;

// Click behavior: connect (or reconnect) if not connected; if already
// connected, prompt to rename (accepts "channel" or "channel:app-name").
// Exported for a future connect-button UI to wire up - not called
// anywhere in this repo yet since none exists.
export async function handleConnectClick(): Promise<void> {
	await connect.handleConnectClick();
}

// Connects automatically on page load - no button click required.
export async function initMcpConnect(): Promise<void> {
	await connect.init();
}
