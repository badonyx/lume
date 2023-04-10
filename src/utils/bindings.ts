// This file was generated by [tauri-specta](https://github.com/oscartbeaumont/tauri-specta). Do not edit this file manually.

declare global {
  interface Window {
    __TAURI_INVOKE__<T>(cmd: string, args?: Record<string, unknown>): Promise<T>;
  }
}

const invoke = window.__TAURI_INVOKE__;

export function getAccounts() {
  return invoke<Account[]>('get_accounts');
}

export function createAccount(data: CreateAccountData) {
  return invoke<Account>('create_account', { data });
}

export function getPlebs(data: GetPlebData) {
  return invoke<Pleb[]>('get_plebs', { data });
}

export function getPlebByPubkey(data: GetPlebPubkeyData) {
  return invoke<Pleb | null>('get_pleb_by_pubkey', { data });
}

export function createPleb(data: CreatePlebData) {
  return invoke<Pleb>('create_pleb', { data });
}

export function createNote(data: CreateNoteData) {
  return invoke<Note>('create_note', { data });
}

export function getNotes(data: GetNoteData) {
  return invoke<Note[]>('get_notes', { data });
}

export function getLatestNotes(data: GetLatestNoteData) {
  return invoke<Note[]>('get_latest_notes', { data });
}

export function getNoteById(data: GetNoteByIdData) {
  return invoke<Note | null>('get_note_by_id', { data });
}

export function createChannel(data: CreateChannelData) {
  return invoke<Channel>('create_channel', { data });
}

export type CreateNoteData = {
  event_id: string;
  pubkey: string;
  kind: number;
  tags: string;
  content: string;
  parent_id: string;
  parent_comment_id: string;
  created_at: number;
  account_id: number;
};
export type CreateChannelData = { event_id: string; content: string };
export type CreatePlebData = { pleb_id: string; pubkey: string; kind: number; metadata: string; account_id: number };
export type GetNoteByIdData = { event_id: string };
export type Pleb = { id: number; plebId: string; pubkey: string; kind: number; metadata: string; accountId: number };
export type Note = {
  id: number;
  eventId: string;
  pubkey: string;
  kind: number;
  tags: string;
  content: string;
  parent_id: string;
  parent_comment_id: string;
  createdAt: number;
  accountId: number;
};
export type Account = { id: number; pubkey: string; privkey: string; active: boolean; metadata: string };
export type Channel = { id: number; eventId: string; content: string };
export type GetPlebPubkeyData = { pubkey: string };
export type GetPlebData = { account_id: number };
export type CreateAccountData = { pubkey: string; privkey: string; metadata: string };
export type GetLatestNoteData = { date: number };
export type GetNoteData = { date: number; limit: number; offset: number };
