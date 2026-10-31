
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  X,
  Image as ImageIcon,
} from "lucide-react";

import {
  createProduct,
  getAdminProductById,
  updateProduct,
  uploadProductImage,
} from "../../services/productService";

import "../../styles/admin.css";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  category: "OTHERS",
  imageUrl: "",
  stockQuantity: 0,
  featured: false,
  published: false,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const CATEGORIES = [
  { value: "SITTING", label: "Sitting Room" },
  { value: "BEDROOM", label: "Bedroom" },
  { value: "DINING", label: "Dining" },
  { value: "OTHERS", label: "Others" },
];

const getImageUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") {
    return "";
  }

  const url = imageUrl.trim();

  if (!url) return "";

  if (/^(https?:\/\/|blob:|data:)/i.test(url)) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
};

const uploadImage = async (file) => {
  const result = await uploadProductImage(file);

  const imageUrl =
    typeof result === "string" ? result : result?.imageUrl;

  if (!imageUrl) {
    throw new Error(
      `The upload for "${file.name}" did not return an image URL.`
    );
  }

  return imageUrl;
};

const validateImage = (file) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "The image must be a JPG, PNG, or WebP file.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "The image must not exceed 5 MB.";
  }

  return "";
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");

  const [form, setForm] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeExistingImage, setRemoveExistingImage] =
    useState(false);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageLoadError, setImageLoadError] = useState(false);

  // Load existing product when editing.
  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const product = await getAdminProductById(id);

        if (!active) return;

        setForm({
          name: product.name ?? "",
          description: product.description ?? "",
          price:
            product.price === null ||
            product.price === undefined
              ? ""
              : String(product.price),
          category: CATEGORIES.some(
            (category) => category.value === product.category
          )
            ? product.category
            : "OTHERS",
          imageUrl: product.imageUrl ?? "",
          stockQuantity: product.stockQuantity ?? 0,
          featured: Boolean(product.featured),
          published: Boolean(product.published),
        });

        setImageFile(null);
        setImagePreview(product.imageUrl ?? "");
        setRemoveExistingImage(false);
        setImageLoadError(false);
      } catch (err) {
        if (active) {
          setError(
            err.message || "Could not load this product."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  // Release temporary preview URLs.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const clearMainPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Select the single product image.
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const validationError = validateImage(file);

    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }

    clearMainPreview();

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setImageFile(file);
    setImagePreview(previewUrl);
    setImageLoadError(false);
    setRemoveExistingImage(false);
  };

  const handleRemoveImage = () => {
    clearMainPreview();

    setImageFile(null);
    setImagePreview("");
    setImageLoadError(false);
    setRemoveExistingImage(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const price = Number(form.price);
    const stockQuantity = Number(form.stockQuantity);

    if (!form.name.trim() || !form.description.trim()) {
      setError("Product name and description are required.");
      return;
    }

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setError("Enter a valid product price.");
      return;
    }

    if (
      form.stockQuantity === "" ||
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      setError(
        "Stock quantity must be a whole number of zero or more."
      );
      return;
    }

    if (
      !CATEGORIES.some(
        (category) => category.value === form.category
      )
    ) {
      setError("Choose a valid product category.");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      // Upload a replacement image when selected.
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      } else if (removeExistingImage) {
        imageUrl = "";
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        imageUrl,
        stockQuantity,
        featured: form.featured,
        published: form.published,
      };

      if (isEditing) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/products", {
        replace: true,
        state: {
          message: isEditing
            ? "Product updated successfully."
            : "Product created successfully.",
        },
      });
    } catch (err) {
      setError(
        err.message || "Could not save the product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel admin-empty-state">
        Loading product...
      </div>
    );
  }

  const resolvedImageUrl = getImageUrl(imagePreview);

  return (
    <section className="admin-product-editor">
      <div className="admin-welcome-row">
        <div>
          <p className="admin-eyebrow">BANIK INTERIOR</p>

          <h2>
            {isEditing ? "Edit product" : "Add a new product"}
          </h2>

          <p className="admin-muted">
            Manage your furniture collection, pricing, inventory,
            and product visibility.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="admin-secondary-button"
        >
          <ArrowLeft size={17} />
          Back to products
        </Link>
      </div>

      {error && (
        <div
          className="admin-alert admin-alert-error"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        className="admin-panel admin-product-form"
        onSubmit={handleSubmit}
      >
        {/* Product information */}
        <div className="admin-form-section">
          <h3>Product information</h3>

          <p>
            Enter the details customers will see in your store.
          </p>

          <div className="admin-form-field">
            <label htmlFor="name">Product name *</label>

            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={150}
              required
              placeholder="e.g. The Ember Sofa"
            />

            <span className="admin-field-hint">
              {form.name.length}/150 characters
            </span>
          </div>

          <div className="admin-form-field">
            <label htmlFor="description">Description *</label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={2000}
              rows={5}
              required
              placeholder="Describe the materials, design, comfort, and craftsmanship..."
            />

            <span className="admin-field-hint">
              {form.description.length}/2000 characters
            </span>
          </div>

          <div className="admin-form-field">
            <label htmlFor="category">Category *</label>

            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="price">Price (₦) *</label>

            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="890000"
            />

            {form.price !== "" &&
              Number.isFinite(Number(form.price)) &&
              Number(form.price) >= 0 && (
                <span className="admin-field-hint">
                  {Number(form.price).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
          </div>

          <div className="admin-form-field">
            <label htmlFor="stockQuantity">
              Stock quantity *
            </label>

            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              step="1"
              value={form.stockQuantity}
              onChange={handleChange}
              required
              placeholder="10"
            />

            <span className="admin-field-hint">
              Number of units currently available.
            </span>
          </div>
        </div>

        {/* Single product image */}
        <div className="admin-form-section">
          <h3>Product image</h3>

          <p>
            Upload one high-quality image to showcase your furniture.
          </p>

          <div className="admin-form-field">
            <label htmlFor="productImage">
              Main product image
            </label>

            <input
              ref={fileInputRef}
              id="productImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              hidden
            />

            {imagePreview && !removeExistingImage ? (
              <div className="admin-image-upload">
                <div className="admin-image-preview">
                  {!imageLoadError ? (
                    <img
                      key={resolvedImageUrl}
                      src={resolvedImageUrl}
                      alt={`${form.name || "Furniture"} preview`}
                      onLoad={() => setImageLoadError(false)}
                      onError={() => setImageLoadError(true)}
                    />
                  ) : (
                    <div className="admin-image-placeholder">
                      <ImageIcon size={32} />
                      <strong>Image could not be loaded</strong>
                      <span>
                        Choose another image or check the saved URL.
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="admin-image-remove"
                    onClick={handleRemoveImage}
                    aria-label="Remove product image"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="admin-image-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud size={16} />
                    Replace image
                  </button>

                  <span className="admin-field-hint">
                    {imageFile
                      ? imageFile.name
                      : "Current product image"}
                  </span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="admin-image-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={32} />
                <strong>Choose a product image</strong>
                <span>Click to browse your files</span>
                <small>JPG, PNG or WebP · Maximum 5 MB</small>
              </button>
            )}
          </div>
        </div>

        {/* Store visibility */}
        <div className="admin-form-section">
          <h3>Store visibility</h3>

          <p>
            Choose how this product appears in your furniture store.
          </p>

          <div className="admin-publish-option">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              <span>
                <strong>Featured product</strong>
                <small>
                  Highlight this product in your featured collection.
                </small>
              </span>
            </label>
          </div>

          <div className="admin-publish-option">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="published"
                checked={form.published}
                onChange={handleChange}
              />

              <span>
                <strong>Publish product</strong>
                <small>
                  Make this product available on the public store.
                </small>
              </span>
            </label>
          </div>
        </div>

        {/* Form actions */}
        <div className="admin-form-footer">
          <Link
            to="/admin/products"
            className="admin-secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={submitting}
          >
            <Save size={17} />

            {submitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create product"}
          </button>
        </div>
      </form>
    </section>
  );
}
