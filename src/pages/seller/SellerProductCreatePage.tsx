import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Package, Upload, ArrowRight, Loader2, Image as ImageIcon, CheckCircle2, X, Cloud } from 'lucide-react';
import { api } from '@/services/api';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  shortDescription: z.string().max(300).optional(),
  description: z.string().min(10, 'Full story / process description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  craftId: z.string().min(1, 'Craft type is required'),
  district: z.string().min(2, 'District is required'),
  basePrice: z.coerce.number().min(1, 'Base price must be at least ₹1'),
  sellingPrice: z.coerce.number().min(1, 'Selling price must be at least ₹1'),
  stockQuantity: z.coerce.number().min(1, 'Stock quantity must be at least 1'),
  imageUrl: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function SellerProductCreatePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [crafts, setCrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cloudinary image upload states
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      district: 'Bargarh',
      stockQuantity: 1,
    },
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cRes, crRes] = await Promise.all([
          api.get('/categories'),
          api.get('/crafts'),
        ]);
        setCategories(cRes.data?.data?.categories || []);
        setCrafts(crRes.data?.data?.crafts || []);
      } catch {
        // ignore
      }
    }
    loadMeta();
  }, []);

  // Handle image upload to Cloudinary
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WebP, AVIF)');
      return;
    }

    // Local instant preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const cloudUrl = res.data?.data?.url || res.data?.data?.files?.[0]?.url;
      if (cloudUrl) {
        setUploadedImageUrl(cloudUrl);
        setValue('imageUrl', cloudUrl);
        toast.success('Image successfully uploaded to Cloudinary!');
      } else {
        throw new Error('No URL returned from upload server');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image to Cloudinary');
      setImagePreview('');
      setUploadedImageUrl('');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setUploadedImageUrl('');
    setValue('imageUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      const finalImageUrl =
        uploadedImageUrl ||
        data.imageUrl ||
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80';

      const payload: any = {
        ...data,
        images: [
          {
            url: finalImageUrl,
            isPrimary: true,
            sortOrder: 0,
          },
        ],
      };

      await api.post('/products', payload);
      toast.success('Creation submitted for administrative review!');
      navigate('/seller/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit creation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>List New Handcrafted Creation — ODCRAFTS Artisan</title>
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Publish a Handcrafted Creation</h1>
          <p className="text-xs text-warm-gray mt-1">
            Fill in the authentic story, materials, and pricing for your handwoven or cast craft
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl bg-white p-6 md:p-8 border border-warm-gray/15 shadow-xs">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Creation Name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. Sambalpuri Cotton Ikat Saree with Shankha Motif"
              className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
            />
            {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Category</label>
              <select {...register('categoryId')} className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm bg-white">
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-error">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Traditional Craft</label>
              <select {...register('craftId')} className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm bg-white">
                <option value="">Select Craft Technique</option>
                {crafts.map((cr) => (
                  <option key={cr._id} value={cr._id}>{cr.name}</option>
                ))}
              </select>
              {errors.craftId && <p className="mt-1 text-xs text-error">{errors.craftId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">District</label>
              <input
                {...register('district')}
                type="text"
                placeholder="e.g. Bargarh"
                className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Selling Price (₹)</label>
              <input
                {...register('sellingPrice')}
                type="number"
                placeholder="4500"
                className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
              />
              {errors.sellingPrice && <p className="mt-1 text-xs text-error">{errors.sellingPrice.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">Base Price / MRP (₹)</label>
              <input
                {...register('basePrice')}
                type="number"
                placeholder="5500"
                className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Stock Quantity</label>
            <input
              {...register('stockQuantity')}
              type="number"
              className="w-full max-w-[140px] rounded-lg border border-warm-gray/30 p-2.5 text-sm"
            />
          </div>

          {/* ─── Cloudinary Image Uploader ─── */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Product Image (Upload to Cloudinary)
            </label>

            <div className="space-y-3">
              {/* Dropzone / Upload Box */}
              {!imagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-warm-gray/30 bg-ivory/30 p-6 text-center cursor-pointer transition-all hover:border-primary hover:bg-ivory"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    {isUploadingImage ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Cloud className="h-6 w-6" />
                    )}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-charcoal">
                    {isUploadingImage ? 'Uploading to Cloudinary...' : 'Click or drag image to upload'}
                  </p>
                  <p className="mt-1 text-xs text-warm-gray">
                    Supports high-resolution JPEG, PNG, WebP up to 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Uploaded Preview Card */
                <div className="relative flex items-center gap-4 rounded-xl border border-warm-gray/20 bg-ivory/50 p-3">
                  <img
                    src={imagePreview}
                    alt="Upload Preview"
                    className="h-20 w-20 rounded-lg object-cover border border-warm-gray/20 shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          <span className="text-primary">Uploading to Cloudinary...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Ready for Creation Payload</span>
                        </>
                      )}
                    </div>
                    {uploadedImageUrl && (
                      <p className="mt-1 font-mono text-[11px] text-warm-gray truncate max-w-md">
                        {uploadedImageUrl}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1 text-warm-gray hover:text-error transition-colors rounded-full hover:bg-white"
                    title="Remove Image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Or specify manual URL fallback */}
              <div className="pt-1">
                <span className="text-[11px] text-warm-gray">
                  Or enter external image URL if already hosted:
                </span>
                <input
                  {...register('imageUrl')}
                  type="url"
                  placeholder="https://res.cloudinary.com/... or https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-lg border border-warm-gray/30 p-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">Craft Process & Story</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Describe the weaving technique, natural dye extraction, and cultural lore of this piece..."
              className="w-full rounded-lg border border-warm-gray/30 p-2.5 text-sm"
            />
            {errors.description && <p className="mt-1 text-xs text-error">{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading || isUploadingImage}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-xs font-bold text-white shadow-md hover:bg-primary-light transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </>
  );
}
