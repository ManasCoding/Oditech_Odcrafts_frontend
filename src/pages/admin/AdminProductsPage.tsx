import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  Package,
  Layers,
  MapPin,
  User,
  X,
} from 'lucide-react';
import { api } from '@/services/api';

type TabStatus = 'PENDING' | 'ALL' | 'PUBLISHED' | 'DRAFT' | 'REJECTED';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    ALL: 0,
    PENDING: 0,
    PUBLISHED: 0,
    DRAFT: 0,
    REJECTED: 0,
  });
  const [currentTab, setCurrentTab] = useState<TabStatus>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [rejectingProduct, setRejectingProduct] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/products', {
        params: {
          status: currentTab,
          q: searchQuery || undefined,
          limit: '50',
        },
      });

      setProducts(res.data?.data?.products || []);
      if (res.data?.data?.statusCounts) {
        setStatusCounts(res.data.data.statusCounts);
      }
    } catch (err) {
      console.error('Failed to load admin products:', err);
      // Fallback to public endpoint if needed
      try {
        const fallbackRes = await api.get('/products', { params: { limit: '50' } });
        setProducts(fallbackRes.data?.data?.products || []);
      } catch (fallbackErr) {
        console.error('Fallback failed:', fallbackErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts();
  };

  const handleUpdateStatus = async (productId: string, status: string, adminNotes?: string) => {
    try {
      setIsUpdating(true);
      await api.patch(`/admin/products/${productId}/status`, { status, adminNotes });
      toast.success(
        status === 'PUBLISHED'
          ? '🎉 Creation approved and published to ODCRAFTS store!'
          : `Product status updated to ${status}`
      );
      setRejectingProduct(null);
      setRejectionReason('');
      if (selectedProduct?._id === productId) {
        setSelectedProduct(null);
      }
      loadProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update product status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Craft Approvals & Catalog — ODCRAFTS Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
              Product Approvals & Catalog
            </h1>
            <p className="text-xs text-warm-gray mt-1">
              Review artisan submissions, verify authentic Odia craft origin, and approve listings for the live marketplace.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-amber-50 border border-amber-200/80 px-3 py-2 text-center">
              <span className="block text-xs font-bold text-amber-800">
                {statusCounts.PENDING || 0}
              </span>
              <span className="text-[10px] text-amber-700 font-medium">Pending Review</span>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-2 text-center">
              <span className="block text-xs font-bold text-emerald-800">
                {statusCounts.PUBLISHED || 0}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Live on Store</span>
            </div>
          </div>
        </div>

        {/* Tab Selector & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-warm-gray/15 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setCurrentTab('PENDING')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'PENDING'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-charcoal border border-warm-gray/20 hover:bg-ivory'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Pending Review</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  currentTab === 'PENDING' ? 'bg-amber-800/60 text-white' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {statusCounts.PENDING || 0}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('ALL')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'ALL'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white text-charcoal border border-warm-gray/20 hover:bg-ivory'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>All Products</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  currentTab === 'ALL' ? 'bg-primary-dark/60 text-white' : 'bg-warm-gray/15 text-charcoal'
                }`}
              >
                {statusCounts.ALL || 0}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('PUBLISHED')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'PUBLISHED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-charcoal border border-warm-gray/20 hover:bg-ivory'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Published ({statusCounts.PUBLISHED || 0})</span>
            </button>

            <button
              onClick={() => setCurrentTab('REJECTED')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'REJECTED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-charcoal border border-warm-gray/20 hover:bg-ivory'
              }`}
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Rejected ({statusCounts.REJECTED || 0})</span>
            </button>

            <button
              onClick={() => setCurrentTab('DRAFT')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'DRAFT'
                  ? 'bg-charcoal text-white shadow-xs'
                  : 'bg-white text-charcoal border border-warm-gray/20 hover:bg-ivory'
              }`}
            >
              <span>Drafts ({statusCounts.DRAFT || 0})</span>
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, or district..."
              className="w-full rounded-xl border border-warm-gray/30 bg-white py-2 pl-9 pr-4 text-xs focus:border-primary focus:outline-hidden"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-warm-gray" />
          </form>
        </div>

        {/* Product Listing Table */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white border border-warm-gray/15" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center border border-warm-gray/15 shadow-xs">
            <Package className="h-12 w-12 text-warm-gray mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-charcoal">
              {currentTab === 'PENDING'
                ? 'No crafts pending administrative approval! 🎉'
                : 'No products found'}
            </h3>
            <p className="text-xs text-warm-gray mt-1 max-w-md mx-auto">
              {currentTab === 'PENDING'
                ? 'All artisan submissions have been reviewed and processed. Check "All Products" or "Published" to manage catalog items.'
                : 'Try adjusting your search query or selecting a different status filter.'}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-warm-gray/15 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-warm-gray/15 bg-ivory/50 text-warm-gray uppercase tracking-wider font-semibold">
                    <th className="py-3.5 px-4">Craft Creation</th>
                    <th className="py-3.5 px-4">Artisan & Origin</th>
                    <th className="py-3.5 px-4">Category / Craft</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-gray/10 text-charcoal">
                  {products.map((p) => {
                    const img = p.images?.find((i: any) => i.isPrimary)?.url || p.images?.[0]?.url;
                    const artisanName = p.sellerId?.userId?.name || p.sellerId?.businessName || 'Artisan';
                    const isPending = p.status === 'SUBMITTED' || p.status === 'DRAFT';
                    const isPublished = p.status === 'PUBLISHED';
                    const isRejected = p.status === 'REJECTED';

                    return (
                      <tr key={p._id} className="hover:bg-ivory/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                img ||
                                'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={p.name}
                              className="h-12 w-12 rounded-lg object-cover border border-warm-gray/20 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-charcoal line-clamp-1 max-w-xs">{p.name}</p>
                              <span className="text-[10px] font-mono text-warm-gray block">
                                SKU: {p.sku}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="font-semibold text-charcoal">{artisanName}</span>
                          </div>
                          <span className="text-[10px] text-warm-gray flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-secondary-dark" />
                            {p.district || p.sellerId?.district || 'Odisha'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-charcoal block">
                            {p.categoryId?.name || 'Handicrafts'}
                          </span>
                          <span className="text-[10px] text-warm-gray">{p.craftId?.name || 'Traditional'}</span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-charcoal">
                          ₹{p.sellingPrice?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold ${
                              p.stockQuantity > 0 ? 'text-accent' : 'text-error'
                            }`}
                          >
                            {p.stockQuantity} in stock
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isPending && (
                            <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Pending Approval
                            </span>
                          )}
                          {isPublished && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Live in Store
                            </span>
                          )}
                          {isRejected && (
                            <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold uppercase inline-flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Rejected
                            </span>
                          )}
                          {!isPending && !isPublished && !isRejected && (
                            <span className="rounded-full bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                              {p.status}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Inspect Details */}
                            <button
                              onClick={() => setSelectedProduct(p)}
                              className="rounded-lg border border-warm-gray/30 p-1.5 text-charcoal hover:bg-ivory hover:text-primary transition-colors"
                              title="Inspect Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Approve & Publish Button */}
                            {p.status !== 'PUBLISHED' && (
                              <button
                                onClick={() => handleUpdateStatus(p._id, 'PUBLISHED')}
                                disabled={isUpdating}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-xs inline-flex items-center gap-1 transition-all"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Approve
                              </button>
                            )}

                            {/* Reject Button */}
                            {isPending && (
                              <button
                                onClick={() => setRejectingProduct(p)}
                                disabled={isUpdating}
                                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-xs inline-flex items-center gap-1 transition-all"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            )}

                            {/* Unpublish */}
                            {isPublished && (
                              <button
                                onClick={() => handleUpdateStatus(p._id, 'DRAFT')}
                                disabled={isUpdating}
                                className="rounded-lg border border-warm-gray/30 px-2 py-1 text-[11px] font-bold text-charcoal hover:bg-ivory transition-colors"
                              >
                                Unpublish
                              </button>
                            )}
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

      {/* Product Detail Inspection Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-warm-gray/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-warm-gray/15 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-warm-gray">
                  SKU: {selectedProduct.sku}
                </span>
                <h2 className="font-serif text-xl font-bold text-charcoal">{selectedProduct.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg p-1 text-warm-gray hover:bg-ivory hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {selectedProduct.images?.map((img: any, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-warm-gray/20">
                  <img src={img.url} alt={selectedProduct.name} className="h-full w-full object-cover" />
                  {img.isPrimary && (
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-ivory/60 rounded-xl mb-4 text-xs">
              <div>
                <span className="text-warm-gray block text-[10px]">Selling Price</span>
                <span className="font-bold text-charcoal text-sm">
                  ₹{selectedProduct.sellingPrice?.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-warm-gray block text-[10px]">Base Price</span>
                <span className="font-bold text-charcoal text-sm">
                  ₹{selectedProduct.basePrice?.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-warm-gray block text-[10px]">Stock Available</span>
                <span className="font-bold text-accent text-sm">
                  {selectedProduct.stockQuantity} units
                </span>
              </div>
              <div>
                <span className="text-warm-gray block text-[10px]">District</span>
                <span className="font-bold text-charcoal text-sm">
                  {selectedProduct.district || 'Odisha'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Full Craft Description & Heritage Story
              </h4>
              <p className="text-xs text-charcoal/80 bg-warm-gray/5 p-3.5 rounded-xl whitespace-pre-wrap leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Actions in Modal */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-warm-gray/15">
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-xl border border-warm-gray/30 px-4 py-2 text-xs font-bold text-charcoal hover:bg-ivory"
              >
                Close
              </button>

              {selectedProduct.status !== 'PUBLISHED' && (
                <button
                  onClick={() => handleUpdateStatus(selectedProduct._id, 'PUBLISHED')}
                  disabled={isUpdating}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve & Publish to Store
                </button>
              )}

              {selectedProduct.status === 'PUBLISHED' && (
                <button
                  onClick={() => handleUpdateStatus(selectedProduct._id, 'DRAFT')}
                  disabled={isUpdating}
                  className="rounded-xl border border-warm-gray/30 px-4 py-2 text-xs font-bold text-charcoal hover:bg-ivory"
                >
                  Unpublish to Draft
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {rejectingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-warm-gray/20">
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Reject Craft Listing: {rejectingProduct.name}
            </h3>
            <p className="text-xs text-warm-gray mt-1">
              Please state why this listing was not approved so the artisan can make necessary updates.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please provide clearer photos of the weave texture and specify traditional dye materials..."
              rows={3}
              className="mt-3 w-full rounded-xl border border-warm-gray/30 p-2.5 text-xs focus:border-rose-600 focus:outline-hidden"
            />

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setRejectingProduct(null)}
                className="rounded-xl border border-warm-gray/30 px-3 py-1.5 text-xs font-bold text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(rejectingProduct._id, 'REJECTED', rejectionReason)
                }
                disabled={isUpdating}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs inline-flex items-center gap-1"
              >
                <XCircle className="h-3.5 w-3.5" />
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
