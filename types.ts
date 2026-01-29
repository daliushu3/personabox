
export interface CharacterCard {
  id: string;
  name: string;
  photo: string;
  // Expanded basic info
  gender: string;
  birthday: string;
  height: string;
  weight: string;
  eyeColor: string;
  hairStyle: string;
  
  tags: string[]; // Added tags
  personality: string;
  hobbies: string;
  others: string;
  createdAt: number;
}

export type ViewMode = 'name-only' | 'name-photo';
export type SortType = 'newest' | 'oldest' | 'alpha';
