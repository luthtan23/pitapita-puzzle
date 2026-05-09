import { api } from './api';
import { authService } from './auth';

export const scoreService = {
  async getLeaderboard(difficulty?: string) {
    const query = difficulty ? `?difficulty=${difficulty}` : '';
    return api.get(`/scores/leaderboard${query}`);
  },

  async submitScore(difficulty: string, moves: number, timeSecs: number) {
    const token = authService.getToken();
    if (!token) return { error: 'Not authenticated' };
    
    return api.post('/scores/', { difficulty, moves, timeSecs }, token);
  },
};
