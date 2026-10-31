
package com.emmzy.controller;

import com.emmzy.payload.ProductRequest;
import com.emmzy.payload.ProductResponse;
import com.emmzy.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Get all published products for the public website.
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getPublishedProducts() {
        return ResponseEntity.ok(
                productService.getPublishedProducts()
        );
    }

    // Get a single published product by ID.
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getPublishedProductById(
            @PathVariable Long id
    ) {
        ProductResponse product = productService.getProductById(id);

        if (!product.isPublished()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(product);
    }

    // Search published products by name.
    // Example: /api/products/search?name=sofa
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchPublishedProducts(
            @RequestParam String name
    ) {
        if (name.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                productService.searchProductsByName(name.trim())
        );
    }

    // Get published products by category.
    // Example: /api/products/category/SITTING
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(
            @PathVariable String category
    ) {
        return ResponseEntity.ok(
                productService.getProductsByCategory(category)
        );
    }

    // Get featured products for the homepage.
    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts() {
        return ResponseEntity.ok(
                productService.getFeaturedProducts()
        );
    }

    // Filter published products by price.
    // Example: /api/products/price-range?minPrice=1000000&maxPrice=10000000
    @GetMapping("/price-range")
    public ResponseEntity<List<ProductResponse>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice
    ) {
        return ResponseEntity.ok(
                productService.getProductsByPriceRange(
                        minPrice,
                        maxPrice
                )
        );
    }

    // Create a product.
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request
    ) {
        ProductResponse createdProduct =
                productService.createProduct(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdProduct);
    }

    // Update a product.
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(
                productService.updateProduct(id, request)
        );
    }

    // Publish or unpublish a product.
    @PatchMapping("/{id}/published")
    public ResponseEntity<ProductResponse> updatePublishedStatus(
            @PathVariable Long id,
            @RequestParam boolean published
    ) {
        return ResponseEntity.ok(
                productService.updatePublishedStatus(id, published)
        );
    }

    // Delete a product.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id
    ) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
