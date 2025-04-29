
import gplay from 'google-play-scraper';

export interface AppReview {
  id: string;
  userName: string;
  userImage: string;
  content: string;
  score: number;
  scoreText: string;
  thumbsUpCount: number;
  reviewCreatedVersion: string;
  at: Date;
  replyContent?: string;
  replyAt?: Date;
  appVersion?: string;
  title?: string;
}

export interface AppInfo {
  appId: string;
  title: string;
  summary: string;
  developer: string;
  developerId: string;
  icon: string;
  score: number;
  scoreText: string;
  priceText: string;
  free: boolean;
}

export async function fetchAppInfo(appId: string): Promise<AppInfo> {
  try {
    const result = await gplay.app({ appId });
    return {
      appId: result.appId,
      title: result.title,
      summary: result.summary,
      developer: result.developer,
      developerId: result.developerId,
      icon: result.icon,
      score: result.score,
      scoreText: result.scoreText,
      priceText: result.priceText,
      free: result.free
    };
  } catch (error) {
    console.error('Error fetching app info:', error);
    throw new Error(`Failed to fetch app info for ${appId}: ${error}`);
  }
}

export async function fetchAppReviews(appId: string, count: number = 100): Promise<AppReview[]> {
  try {
    const result = await gplay.reviews({
      appId,
      sort: gplay.sort.NEWEST,
      num: count
    });
    
    return result.data.map(review => ({
      id: review.id,
      userName: review.userName,
      userImage: review.userImage,
      content: review.text,
      score: review.score,
      scoreText: review.scoreText,
      thumbsUpCount: review.thumbsUp,
      reviewCreatedVersion: review.version,
      at: new Date(review.date),
      replyContent: review.replyText,
      replyAt: review.replyDate ? new Date(review.replyDate) : undefined,
      appVersion: review.version,
      title: ''
    }));
  } catch (error) {
    console.error('Error fetching app reviews:', error);
    throw new Error(`Failed to fetch reviews for ${appId}: ${error}`);
  }
}
