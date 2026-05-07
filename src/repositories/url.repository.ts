import type {
  ShortUrl,
  CreateUrlRequest,
  UpdateUrlRequest,
} from "../types/url.types.js";
import { pool } from "../config/database.js";

export class URLRepository {
  private mapRow(row: any): ShortUrl {
    return {
      id: row.id,
      shortCode: row.shortcode,
      originalUrl: row.original_url,
      accessCount: row.access_count,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findByShortcode(shortcode: string): Promise<ShortUrl | null> {
    const result = await pool.query(
      `SELECT id, shortcode, original_url, access_count, created_at, updated_at FROM urls WHERE shortcode = $1`,
      [shortcode],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRow(result.rows[0]);
  }

  async create(data: CreateUrlRequest): Promise<ShortUrl> {
    const result = await pool.query(
      `INSERT INTO urls (shortcode, original_url) VALUES ($1, $2) RETURNING id, shortcode, original_url, access_count, created_at, updated_at`,
      [data.shortCode, data.originalUrl],
    );

    return this.mapRow(result.rows[0]);
  }

  async update(
    shortcode: string,
    data: UpdateUrlRequest,
  ): Promise<ShortUrl | null> {
    const result = await pool.query(
      `UPDATE urls SET original_url = $1 WHERE shortcode = $2 RETURNING id, shortcode, original_url, access_count, created_at, updated_at`,
      [data.originalUrl, shortcode],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRow(result.rows[0]);
  }

  async remove(shortcode: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM urls WHERE shortcode = $1`, [
      shortcode,
    ]);

    return (result.rowCount ?? 0) > 0;
  }

  async incrementAccessCount(shortcode: string): Promise<void> {
    await pool.query(
      `UPDATE urls SET access_count = access_count + 1 WHERE shortcode = $1`,
      [shortcode],
    );
  }
}
