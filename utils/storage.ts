
import { CharacterCard } from '../types';
import { STORAGE_KEY } from '../constants';

export const getCards = (): CharacterCard[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCard = (card: CharacterCard) => {
  const cards = getCards();
  const index = cards.findIndex((c) => c.id === card.id);
  if (index >= 0) {
    cards[index] = card;
  } else {
    cards.push(card);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const deleteCard = (id: string) => {
  const cards = getCards().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const importCards = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    if (Array.isArray(data)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    }
  } catch (e) {
    console.error("Failed to import cards", e);
  }
  return false;
};

export const exportCards = (): string => {
  return JSON.stringify(getCards(), null, 2);
};
