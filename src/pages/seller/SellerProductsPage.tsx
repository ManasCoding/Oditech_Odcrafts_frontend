import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Package, Trash2, Clock, CheckCircle2, XCircle, Info, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/seller/products');
      setProducts(res.data?.data?.products || []);
    } catch (err) {
      console.error('Failed to load artisan products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this creation?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.info('Product removed');
      loadProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <>
      <Helmet>
        <title>My Handcrafted Creations — ODCRAFTS Artisan</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal">My Handcrafted Catalog</h1>
            <p className="text-xs text-warm-gray mt-1">Manage and track your creations listed on ODCRAFTS</p>
          </div>

          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Creation</span>
          </Link>
        </div>

        {/* Curation & Approval Lifecycle Notice */}
        <div className="rounded-xl bg-amber-50/80 border border-amber-200/70 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">ODCRAFTS Curation Process:</span> When you add a new creation, it is submitted for review by the ODCRAFTS curation team to verify authentic Odia craft traditions. Once approved, it immediately appears live in the marketplace for customers!
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white border border-warm-gray/15" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-warm-gray/15">
            <Package className="h-12 w-12 text-warm-gray mx-auto mb-3" />
            <h2 className="font-serif text-lg font-bold text-charcoal">No products listed yet</h2>
            <p className="text-xs text-warm-gray mt-1">
              Start by publishing your first handwoven saree, terracotta item, or painting.
            </p>
            <Link
              to="/seller/products/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Product</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-warm-gray/15 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-warm-gray/15 bg-ivory/50 text-warm-gray uppercase tracking-wider">
                    <th className="py-3 px-4">Creation</th>
                    <th className="py-3 px-4">Selling Price</th>
                    <th className="py-3 px-4">Available Stock</th>
                    <th className="py-3 px-4">Review Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-gray/10 text-charcoal">
                  {products.map((p) => {
                    const img = p.images?.find((i: any) => i.isPrimary)?.url || p.images?.[0]?.url;
                    return (
                      <tr key={p._id} className="hover:bg-ivory/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={img} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                            <div>
                              <p className="font-semibold text-charcoal line-clamp-1 max-w-xs">{p.name}</p>
                              <span className="text-[10px] font-mono text-warm-gray">{p.sku}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold">₹{p.sellingPrice?.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">{p.stockQuantity} units</td>
                        <td className="py-3 px-4">
                          {(p.status === 'SUBMITTED' || p.status === 'DRAFT') && (
                            <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Under Review
                            </span>
                          )}
                          {p.status === 'PUBLISHED' && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Live in Store
                            </span>
                          )}
                          {p.status === 'REJECTED' && (
                            <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Needs Revision
                            </span>
                          )}
                          {p.status !== 'SUBMITTED' && p.status !== 'DRAFT' && p.status !== 'PUBLISHED' && p.status !== 'REJECTED' && (
                            <span className="rounded-full bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                              {p.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {p.status === 'PUBLISHED' && (
                              <Link
                                to={`/product/${p.slug}`}
                                target="_blank"
                                className="p-1.5 text-warm-gray hover:text-primary transition-colors"
                                title="View in Storefront"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            )}
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="p-1.5 text-warm-gray hover:text-error transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
