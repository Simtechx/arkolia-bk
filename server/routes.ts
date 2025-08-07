import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // RSS Feed proxy route to handle CORS
  app.get("/api/rss-proxy", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL parameter is required' });
      }
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml',
          'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status}`);
      }
      
      const text = await response.text();
      
      res.set({
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      
      res.send(text);
    } catch (error) {
      console.error('RSS proxy error:', error);
      res.status(500).json({ error: 'Failed to fetch RSS feed' });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
