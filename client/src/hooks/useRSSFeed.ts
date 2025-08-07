import { useQuery } from '@tanstack/react-query';

interface RSSItem {
  title: string;
  pubDate: string;
  enclosure?: {
    url: string;
    type: string;
  };
  description?: string;
  guid?: string;
  link?: string;
}

interface RSSFeed {
  items: RSSItem[];
}

interface Track {
  id: string;
  title: string;
  surahName: string;
  duration: string;
  date: string;
  verseRange: string;
  audioUrl?: string;
}

const parseRSSFeed = async (url: string): Promise<RSSFeed> => {
  try {
    // Use our server's RSS proxy to bypass CORS restrictions
    const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Empty RSS feed response');
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    
    // Check for XML parsing errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`XML parsing error: ${parseError.textContent}`);
    }
    
    const items = Array.from(doc.querySelectorAll('item')).map(item => {
      const enclosureEl = item.querySelector('enclosure');
      return {
        title: item.querySelector('title')?.textContent || '',
        pubDate: item.querySelector('pubDate')?.textContent || '',
        description: item.querySelector('description')?.textContent || '',
        guid: item.querySelector('guid')?.textContent || '',
        link: item.querySelector('link')?.textContent || '',
        enclosure: enclosureEl ? {
          url: enclosureEl.getAttribute('url') || '',
          type: enclosureEl.getAttribute('type') || ''
        } : undefined
      };
    });
    
    return { items };
  } catch (error) {
    console.error('RSS parsing error:', error);
    throw error;
  }
};

const transformRSSToTracks = (rssItems: RSSItem[]): Track[] => {
  return rssItems.map((item, index) => {
    // Extract Surah name and verse range from title
    const title = item.title;
    let surahName = 'Unknown Surah';
    let verseRange = '';
    
    // Try to extract Surah name from title (assuming format like "Surah Al-Fatiha - Verses 1-7")
    const surahMatch = title.match(/Surah\s+([^-]+)/i);
    if (surahMatch) {
      surahName = surahMatch[1].trim();
    }
    
    // Try to extract verse range
    const verseMatch = title.match(/verses?\s+(\d+[-\d]*)/i);
    if (verseMatch) {
      verseRange = verseMatch[1];
    }
    
    // Format date
    const date = item.pubDate ? new Date(item.pubDate).toLocaleDateString() : '';
    
    return {
      id: item.guid || item.link || `rss-${index}`,
      title: title,
      surahName: surahName,
      duration: '00:00', // Duration not available in RSS, could be extracted from audio metadata
      date: date,
      verseRange: verseRange,
      audioUrl: item.enclosure?.url
    };
  });
};

export const useRSSFeed = (feedUrl: string) => {
  return useQuery({
    queryKey: ['rssFeed', feedUrl],
    queryFn: async () => {
      try {
        const rssData = await parseRSSFeed(feedUrl);
        return transformRSSToTracks(rssData.items);
      } catch (error) {
        console.warn('RSS feed parsing failed, using fallback data:', error);
        // Return empty array as fallback instead of throwing
        return [];
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    retry: 2,

  });
};