import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Maps URL slugs to craft query param values
const CRAFT_MAP: Record<string, string> = {
  pattachitra: 'pattachitra',
  applique: 'applique',
  terracotta: 'terracotta',
  dhokra: 'dhokra',
  'dhokra-brass': 'dhokra',
  handloom: 'handloom',
  ikat: 'ikat',
  filigree: 'filigree',
  'silver-filigree': 'filigree',
};

/**
 * ShopCategoryPage — a thin redirect layer.
 * Converts /shop/:category  →  /shop?craft=<value>
 * This allows footer links like /shop/pattachitra to work correctly
 * by routing into the main ShopPage with the right craft filter applied.
 */
export default function ShopCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const craftSlug = category ? (CRAFT_MAP[category.toLowerCase()] || category.toLowerCase()) : '';
    navigate(`/shop?craft=${craftSlug}`, { replace: true });
  }, [category, navigate]);

  return (
    <div className="flex h-screen items-center justify-center bg-ivory font-serif text-primary text-xl animate-pulse">
      Loading collection...
    </div>
  );
}
