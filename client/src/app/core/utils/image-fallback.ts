export class ImageFallback {
  static handleImageError(event: any, category: string) {
    event.target.onerror = null;
    
    event.target.classList.add('is-default');

    const defaultImages: { [key: string]: string } = {
      'Salads': '/assets/images/category-salads.jpg',
      'Main Dishes': '/assets/images/category-main.jpg',
      'Desserts': '/assets/images/category-desserts.jpg',
    };

    const fallback = defaultImages[category] || '/assets/images/category-main.jpg';
    event.target.src = fallback;
  }
}