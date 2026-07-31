export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  action_item: string;
}
