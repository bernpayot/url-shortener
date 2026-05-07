import type {
  ShortUrl,
  CreateUrlRequest,
  UpdateUrlRequest,
} from "../types/url.types.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";
import { URLRepository } from "../repositories/url.repository.js";
import { client } from "../config/redis.js";
import { nanoid } from "nanoid";
import { validateUrl } from "../utils/validateUrl.js";

export class URLService {
  constructor(private repository: URLRepository) {}
  async redirect(shortcode: string): Promise<string> {
    const key = `url:${shortcode}`;

    const cached = await client.get(key);

    if (cached) {
      await this.repository.incrementAccessCount(shortcode);
      return cached;
    }

    const shorturl = await this.repository.findByShortcode(shortcode);

    if (!shorturl) {
      throw new NotFoundError(
        `Short Url with short code: ${shortcode} was not found.`,
      );
    }

    const url = shorturl.originalUrl;
    await client.set(key, url, { EX: 86400 });
    await this.repository.incrementAccessCount(shortcode);
    return url;
  }
  async createShortUrl(data: CreateUrlRequest): Promise<ShortUrl> {
    const shortcode = nanoid(6);

    data.shortCode = shortcode;

    validateUrl(data.originalUrl);

    return await this.repository.create(data);
  }
  async getByShortcode(shortcode: string): Promise<ShortUrl> {
    const shorturl = await this.repository.findByShortcode(shortcode);
    if (shorturl === null) {
      throw new NotFoundError(
        `Short Url with short code: ${shortcode} was not found.`,
      );
    }

    return shorturl;
  }
  async updateShortUrl(
    shortcode: string,
    data: UpdateUrlRequest,
  ): Promise<ShortUrl> {
    validateUrl(data.originalUrl);

    const updatedUrl = await this.repository.update(shortcode, data);
    if (updatedUrl === null) {
      throw new NotFoundError(
        `Short Url with short code: ${shortcode} was not found.`,
      );
    }
    await client.del(`url:${shortcode}`);
    return updatedUrl;
  }
  async deleteShortUrl(shortcode: string): Promise<boolean> {
    const url = await this.repository.remove(shortcode);
    if (!url) {
      throw new NotFoundError(
        `Short Url with short code: ${shortcode} was not found.`,
      );
    }
    await client.del(`url:${shortcode}`);
    return true;
  }
}
