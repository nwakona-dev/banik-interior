
package com.emmzy.service;

import com.emmzy.mapper.ProductMapper;
import com.emmzy.model.Product;
import com.emmzy.payload.ProductCategory;
import com.emmzy.payload.ProductRequest;
import com.emmzy.payload.ProductResponse;
import com.emmzy.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products (including unpublished products).
    // Restrict access to this operation in your controller/security config.
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    // Get only published products for the public furniture website.
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getPublishedProducts() {
        return productRepository.findByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    // Get a single product by ID.
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = findProductById(id);
        return ProductMapper.toResponse(product);
    }

    // Search published products by name.
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProductsByName(String name) {
        if (name == null || name.isBlank()) {
            return getPublishedProducts();
        }

        return productRepository
                .findByPublishedTrueAndNameContainingIgnoreCase(name.trim())
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    // Get published products by category.
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(String category) {
        if (category == null || category.isBlank()) {
            return getPublishedProducts();
        }

        ProductCategory productCategory;

        try {
            productCategory = ProductCategory.valueOf(
                    category.trim().toUpperCase()
            );
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Invalid product category. Use SITTING, BEDROOM, DINING, or OTHERS."
            );
        }

        return productRepository
                .findByCategoryAndPublishedTrueOrderByCreatedAtDesc(productCategory)
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    // Get featured published products for the homepage.
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository
                .findByFeaturedTrueAndPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    // Get published products within a price range.
    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByPriceRange(
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {
        if (minPrice == null || maxPrice == null) {
            throw new IllegalArgumentException(
                    "Minimum and maximum prices are required."
            );
        }

        if (minPrice.compareTo(BigDecimal.ZERO) < 0
                || maxPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Prices cannot be negative."
            );
        }

        if (minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException(
                    "Minimum price cannot exceed maximum price."
            );
        }

        return productRepository
                .findByPriceBetweenAndPublishedTrueOrderByPriceAsc(
                        minPrice,
                        maxPrice
                )
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    // Create a new product.
    @Override
    public ProductResponse createProduct(ProductRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Product request must not be null."
            );
        }

        if (productRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new IllegalArgumentException(
                    "A product with this name already exists."
            );
        }

        Product product = ProductMapper.toEntity(request);
        Product savedProduct = productRepository.save(product);

        return ProductMapper.toResponse(savedProduct);
    }

    // Update an existing product.
    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Product request must not be null."
            );
        }

        Product existingProduct = findProductById(id);

        boolean nameBelongsToAnotherProduct =
                productRepository.findByNameIgnoreCase(request.getName().trim())
                        .filter(product -> !product.getId().equals(id))
                        .isPresent();

        if (nameBelongsToAnotherProduct) {
            throw new IllegalArgumentException(
                    "Another product already uses this name."
            );
        }

        ProductMapper.updateEntity(existingProduct, request);

        Product updatedProduct = productRepository.save(existingProduct);

        return ProductMapper.toResponse(updatedProduct);
    }

    // Delete a product.
    @Override
    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }

    // Publish or unpublish a product.
    @Override
    public ProductResponse updatePublishedStatus(Long id, boolean published) {
        Product product = findProductById(id);

        product.setPublished(published);

        Product updatedProduct = productRepository.save(product);

        return ProductMapper.toResponse(updatedProduct);
    }

    // Shared helper for finding products.
    private Product findProductById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException(
                    "Product ID must not be null."
            );
        }

        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Product not found with ID: " + id
                ));
    }
}
