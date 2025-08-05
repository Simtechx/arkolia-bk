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
  // Use CORS proxy to bypass CORS restrictions
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch RSS feed');
  }
  
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  
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
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(2);
  return `${day} ${month} ${year}`;
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
    
    // Format date to DD MMM YY
    const date = item.pubDate ? formatDate(item.pubDate) : '';
    
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
      const rssData = await parseRSSFeed(feedUrl);
      return transformRSSToTracks(rssData.items);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    retry: 2,
  });
};