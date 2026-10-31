
import { apiRequest } from "./apiClient";

const PUBLIC_PRODUCTS_URL = "/api/products";
const ADMIN_PRODUCTS_URL = "/api/admin/products";
const ADMIN_IMAGE_UPLOAD_URL = "/api/admin/products/images";

/**
 * Get all published furniture products.
 */
export function getPublishedProducts() {
  return apiRequest(PUBLIC_PRODUCTS_URL);
}

/**
 * Get a published product by ID.
 */
export function getProductById(id) {
  return apiRequest(`${PUBLIC_PRODUCTS_URL}/${id}`);
}

/**
 * Search published products by name.
 */
export function searchProducts(name) {
  return apiRequest(
    `${PUBLIC_PRODUCTS_URL}/search?name=${encodeURIComponent(name)}`
  );
}

/**
 * Get products by category.
 */
export function getProductsByCategory(category) {
  return apiRequest(
    `${PUBLIC_PRODUCTS_URL}/category/${encodeURIComponent(category)}`
  );
}

/**
 * Get featured furniture products.
 */
export function getFeaturedProducts() {
  return apiRequest(`${PUBLIC_PRODUCTS_URL}/featured`);
}

/**
 * Filter products by price range.
 */
export function getProductsByPriceRange(minPrice, maxPrice) {
  const params = new URLSearchParams({
    minPrice: String(minPrice),
    maxPrice: String(maxPrice),
  });

  return apiRequest(
    `${PUBLIC_PRODUCTS_URL}/price-range?${params.toString()}`
  );
}

/**
 * Get all products for the admin dashboard.
 */
export function getAllProducts() {
  return apiRequest(ADMIN_PRODUCTS_URL);
}

/**
 * Get an admin product by ID.
 */
export function getAdminProductById(id) {
  return apiRequest(`${ADMIN_PRODUCTS_URL}/${id}`);
}

/**
 * Create a furniture product.
 */
export function createProduct(product) {
  return apiRequest(ADMIN_PRODUCTS_URL, {
    method: "POST",
    body: product,
  });
}

/**
 * Update an existing furniture product.
 */
export function updateProduct(id, product) {
  return apiRequest(`${ADMIN_PRODUCTS_URL}/${id}`, {
    method: "PUT",
    body: product,
  });
}

/**
 * Publish or unpublish a product.
 */
export function updatePublishedStatus(id, published) {
  const params = new URLSearchParams({
    published: String(published),
  });

  return apiRequest(
    `${ADMIN_PRODUCTS_URL}/${id}/publish?${params.toString()}`,
    {
      method: "PATCH",
    }
  );
}

/**
 * Delete a furniture product.
 */
export function deleteProduct(id) {
  return apiRequest(`${ADMIN_PRODUCTS_URL}/${id}`, {
    method: "DELETE",
  });
}

/**
 * Upload an image selected from File Explorer.
 *
 * Requires a matching POST /api/admin/products/images
 * endpoint in the Spring Boot backend.
 */
export function uploadProductImage(file) {
  const body = new FormData();
  body.append("file", file);

  return apiRequest(ADMIN_IMAGE_UPLOAD_URL, {
    method: "POST",
    body,
  });
}
