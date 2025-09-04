// app/components/types.ts

/**
 * 予約システム 共通型
 * - DB では追加カラムが nullable。FE 側は「空＝null/空文字」を許容。
 * - has_certificate は FE では boolean で扱い、API 送受信時に変換する。
 */

/** 体験/見学などの区分 */
export type Program = "tour" | "experience" | (string & {}); // 将来拡張を許容

/** 時間帯スロット */
export type Slot = "am" | "pm" | "full" | (string & {});

/** 予約ステータス（推定。APIが別値を返しても壊れないよう拡張を許容） */
export type Status = "booked" | "canceled" | "pending" | (string & {});

/** 日付を YYYY-MM-DD で持つことを明示 */
export type DateISO = string;

/** API の予約レコード（サーバー直送の “生” 形） */
export interface ReservationDTO {
  id: number;
  date: string; // ISO8601（Z付き）や YYYY-MM-DD のどちらも来る可能性に備え string
  program: Program;
  slot: Slot;

  // 既存の name（従来互換）
  name?: string | null;

  // 追加フィールド
  last_name?: string | null;
  first_name?: string | null;
  email?: string | null;
  phone?: string | null;
  notebook_type?: string | null;

  // マイグレーションは string だが、API実装により "0"/"1" / "true"/"false" / boolean が混在し得る
  has_certificate?: boolean | "0" | "1" | "true" | "false" | null;

  status?: Status;
  start_at?: string | null;
  end_at?: string | null;
  contact?: string | null;
  note?: string | null;
  room?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/** FE 内部で扱う正規化済みの予約型 */
export interface Reservation {
  id?: number;
  date: DateISO;              // YYYY-MM-DD を基本とする
  program: Program;
  slot: Slot;

  // 従来互換
  name: string;

  // 追加フィールド（空は "" か null どちらでもOKにしておく）
  last_name?: string | null;
  first_name?: string | null;
  email?: string | null;
  phone?: string | null;
  notebook_type?: string | null;
  has_certificate?: boolean;  // FE は boolean 一択

  status?: Status;
  start_at?: string | null;
  end_at?: string | null;
  contact?: string | null;
  note?: string | null;
  room?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/** 予約作成の入力（POST /api/reservations） */
export interface CreateReservationInput {
  date: DateISO;
  program: Program;
  slot: Slot;
  name: string;

  last_name?: string | null;
  first_name?: string | null;
  email?: string | null;
  phone?: string | null;
  notebook_type?: string | null;
  has_certificate?: boolean; // 送信時にサーバー仕様へ変換
}

/** 予約更新の入力（PATCH /api/reservations/:id） */
export interface UpdateReservationInput {
  name?: string | null;
  program?: Program;
  slot?: Slot;
  date?: DateISO;

  last_name?: string | null;
  first_name?: string | null;
  email?: string | null;
  phone?: string | null;
  notebook_type?: string | null;
  has_certificate?: boolean;

  status?: Status;
  contact?: string | null;
  note?: string | null;
  room?: string | null;
}

/** API ページングの一般形（必要に応じて使う） */
export interface Paginated<T> {
  data: T[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

/** type guard：truthy 文字列を boolean に寄せる */
export function strToBool(v: unknown): boolean | undefined {
  if (v === true) return true;
  if (v === false) return false;
  if (v == null) return undefined;
  const s = String(v).trim().toLowerCase();
  if (s === "1" || s === "true" || s === "yes" || s === "y") return true;
  if (s === "0" || s === "false" || s === "no" || s === "n") return false;
  return undefined; // 不明値は undefined に
}

/** DTO → FE Reservation へ正規化（has_certificate を boolean に揃える） */
export function normalizeReservation(dto: ReservationDTO): Reservation {
  const hasCert =
    typeof dto.has_certificate === "boolean"
      ? dto.has_certificate
      : strToBool(dto.has_certificate) ?? false;

  // date は “YYYY-MM-DD” に寄せたいが、まずは生かしで保持
  return {
    id: dto.id,
    date: dto.date.slice(0, 10), // "YYYY-MM-DD"
    program: dto.program,
    slot: dto.slot,
    name: dto.name ?? "",

    last_name: dto.last_name ?? null,
    first_name: dto.first_name ?? null,
    email: dto.email ?? null,
    phone: dto.phone ?? null,
    notebook_type: dto.notebook_type ?? null,
    has_certificate: hasCert,

    status: dto.status,
    start_at: dto.start_at ?? null,
    end_at: dto.end_at ?? null,
    contact: dto.contact ?? null,
    note: dto.note ?? null,
    room: dto.room ?? null,
    created_at: dto.created_at ?? null,
    updated_at: dto.updated_at ?? null,
  };
}

/** FE → サーバー送信用（Create/Update）に変換 */
export function toServerPayload(
  input: CreateReservationInput | UpdateReservationInput
): Record<string, unknown> {
  // boolean → サーバーが string("0"/"1") を期待する場合にも対応
  const toWire = (b: boolean | undefined) =>
    b === undefined ? undefined : b ? "1" : "0";

  return {
    ...input,
    has_certificate:
      input.has_certificate === undefined ? undefined : toWire(input.has_certificate),
  };
}
