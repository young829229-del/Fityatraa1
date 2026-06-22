export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  isSoldOut: boolean;
  image: string;
  description: string;
  servings?: string;
  servingSize?: string;
  goals: string[];
  specs: { [key: string]: string };
  nutritionFacts?: { [key: string]: string };
  gallery?: string[];
  infoImages?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  statusVerified: boolean;
  imgUrl?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
