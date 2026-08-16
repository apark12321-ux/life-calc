import { PostItem, PostCategory, DailyScheduleSlot, DailyScheduleReport } from '../types';
import { POSTS_ARCHIVE, CATEGORY_META } from '../data/postsData';

const ALL_CATEGORIES: PostCategory[] = ['insurance', 'wage', 'finance', 'property', 'life'];

// Simple deterministic pseudo-random number generator based on string seed (date string like "2026-08-16")
function createSeededRandom(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return function () {
    // Xorshift PRNG
    hash ^= hash << 13;
    hash ^= hash >> 17;
    hash ^= hash << 5;
    return (Math.abs(hash) % 10000) / 10000;
  };
}

/**
 * Generates 5 scheduled posting timestamps for a specific date such that:
 * 1. Exactly 1 post per category.
 * 2. Every consecutive upload time has >= 4 hours (240 minutes) interval.
 * 3. Daily random time variations within deterministic bounds.
 */
export function generateDailySchedule(dateStr: string, referenceTime: Date = new Date()): DailyScheduleReport {
  const rng = createSeededRandom(`life-calc-schedule-${dateStr}`);

  // Base slot offsets in minutes from midnight (00:00)
  // Total day has 1440 minutes. 5 posts with >= 240 mins (4h) spacing:
  // Base intervals: 250 mins (~4h 10m) between posts:
  // Slot 0: 60m  (01:00) + random(0..30m) -> 01:00 ~ 01:30
  // Slot 1: Slot 0 + 245m + random(0..15m) -> 05:05 ~ 05:45 (Interval >= 245m >= 4.08h)
  // Slot 2: Slot 1 + 245m + random(0..15m) -> 09:10 ~ 10:00 (Interval >= 245m >= 4.08h)
  // Slot 3: Slot 2 + 245m + random(0..15m) -> 13:15 ~ 14:15 (Interval >= 245m >= 4.08h)
  // Slot 4: Slot 3 + 245m + random(0..15m) -> 17:20 ~ 18:30 (Interval >= 245m >= 4.08h)
  
  // Shuffle categories deterministically for daily variety
  const categories = [...ALL_CATEGORIES];
  for (let i = categories.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [categories[i], categories[j]] = [categories[j], categories[i]];
  }

  const slotMinutes: number[] = [];
  let currentMinute = 45 + Math.floor(rng() * 45); // 00:45 ~ 01:30
  slotMinutes.push(currentMinute);

  for (let i = 1; i < 5; i++) {
    // Minimum 245 minutes spacing (guarantees > 4 hours = 240 minutes)
    const interval = 245 + Math.floor(rng() * 20); // 245m ~ 265m (4h 5m ~ 4h 25m)
    currentMinute += interval;
    slotMinutes.push(currentMinute);
  }

  // Parse target date and reference time
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetMidnight = new Date(year, month - 1, day, 0, 0, 0);

  const slots: DailyScheduleSlot[] = [];
  let minIntervalHours = 24;

  for (let i = 0; i < 5; i++) {
    const cat = categories[i];
    const mins = slotMinutes[i];
    const hours = Math.floor(mins / 60);
    const remainderMins = mins % 60;

    const scheduledDate = new Date(year, month - 1, day, hours, remainderMins, 0);
    const scheduledTimeStr = `${String(hours).padStart(2, '0')}:${String(remainderMins).padStart(2, '0')}`;

    let intervalHoursFromPrev: number | undefined = undefined;
    if (i > 0) {
      const prevMins = slotMinutes[i - 1];
      const diffHours = (mins - prevMins) / 60;
      intervalHoursFromPrev = Number(diffHours.toFixed(2));
      if (diffHours < minIntervalHours) {
        minIntervalHours = diffHours;
      }
    }

    // Determine if post is published
    // Check manual override in localStorage if available
    let isPublished = scheduledDate.getTime() <= referenceTime.getTime();
    try {
      const forcedKey = `life_calc_forced_${dateStr}_${cat}`;
      if (typeof window !== 'undefined' && localStorage.getItem(forcedKey) === 'true') {
        isPublished = true;
      }
    } catch {
      // ignore in server environment
    }

    const diffMillis = scheduledDate.getTime() - referenceTime.getTime();
    const minutesRemaining = isPublished ? 0 : Math.max(0, Math.ceil(diffMillis / (1000 * 60)));

    // Pick corresponding post from archive for this category
    const catPosts = POSTS_ARCHIVE.filter(p => p.category === cat);
    const daySeed = Math.abs(year * 10000 + month * 100 + day);
    const postIndex = daySeed % catPosts.length;
    const post = catPosts[postIndex] || catPosts[0];

    slots.push({
      slotIndex: i + 1,
      category: cat,
      categoryName: CATEGORY_META[cat].name,
      categoryIcon: CATEGORY_META[cat].icon,
      scheduledTimeStr,
      scheduledDateTime: scheduledDate.toISOString(),
      intervalHoursFromPrev,
      postId: `${post.id}-${dateStr}`,
      postTitle: post.title,
      isPublished,
      minutesRemaining
    });
  }

  const publishedCount = slots.filter(s => s.isPublished).length;
  const scheduledCount = slots.length - publishedCount;
  const nextScheduledSlot = slots.find(s => !s.isPublished) || null;

  return {
    date: dateStr,
    isIntervalCompliant: minIntervalHours >= 4.0,
    minIntervalHours: Number(minIntervalHours.toFixed(2)),
    totalCategories: 5,
    publishedCount,
    scheduledCount,
    nextScheduledSlot,
    slots
  };
}

/**
 * Returns list of all posts (including today's published & scheduled posts + past archive)
 */
export function getAllPostsWithSchedule(referenceDate: Date = new Date(), options?: { includeScheduled?: boolean }): PostItem[] {
  const result: PostItem[] = [];
  const includeScheduled = options?.includeScheduled ?? true;

  // 1. Generate for Today
  const todayStr = referenceDate.toISOString().split('T')[0];
  const todaySchedule = generateDailySchedule(todayStr, referenceDate);

  for (const slot of todaySchedule.slots) {
    if (!includeScheduled && !slot.isPublished) continue;

    const basePost = POSTS_ARCHIVE.find(p => p.category === slot.category) || POSTS_ARCHIVE[0];
    result.push({
      ...basePost,
      id: slot.postId,
      date: todayStr,
      scheduledTime: slot.scheduledTimeStr,
      publishedAt: slot.isPublished ? slot.scheduledDateTime : undefined,
      status: slot.isPublished ? 'published' : 'scheduled',
      viewCount: slot.isPublished ? basePost.viewCount + Math.floor(Math.random() * 50) : 0
    });
  }

  // 2. Generate for past 3 days to provide rich reading history
  for (let daysAgo = 1; daysAgo <= 3; daysAgo++) {
    const pastDate = new Date(referenceDate);
    pastDate.setDate(pastDate.getDate() - daysAgo);
    const pastDateStr = pastDate.toISOString().split('T')[0];
    const pastSchedule = generateDailySchedule(pastDateStr, new Date(referenceDate.getTime() + 86400000 * 5)); // all published

    for (const slot of pastSchedule.slots) {
      const catPosts = POSTS_ARCHIVE.filter(p => p.category === slot.category);
      const postIdx = (daysAgo) % catPosts.length;
      const basePost = catPosts[postIdx] || catPosts[0];

      result.push({
        ...basePost,
        id: `${basePost.id}-${pastDateStr}`,
        date: pastDateStr,
        scheduledTime: slot.scheduledTimeStr,
        publishedAt: slot.scheduledDateTime,
        status: 'published',
        viewCount: basePost.viewCount + daysAgo * 220
      });
    }
  }

  return result;
}

/**
 * Force manual publish for testing / instant admin trigger
 */
export function forcePublishSlot(dateStr: string, category: PostCategory): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`life_calc_forced_${dateStr}_${category}`, 'true');
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {
    console.error('Failed to force publish slot:', e);
  }
}

/**
 * Reset manual overrides for testing
 */
export function resetDailyOverrides(dateStr: string): void {
  try {
    if (typeof window !== 'undefined') {
      for (const cat of ALL_CATEGORIES) {
        localStorage.removeItem(`life_calc_forced_${dateStr}_${cat}`);
      }
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {
    console.error('Failed to reset overrides:', e);
  }
}
