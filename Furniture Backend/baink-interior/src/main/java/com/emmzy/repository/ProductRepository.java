
package com.emmzy.repository;

import com.emmzy.model.Product;
import com.emmzy.payload.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Get all published products, newest first
    List<Product> findByPublishedTrueOrderByCreatedAtDesc();

    // Get products by publication status
    List<Product> findByPublishedOrderByCreatedAtDesc(boolean published);

    // Search products by name
    List<Product> findByNameContainingIgnoreCase(String name);

    // Find a product by its exact name
    Optional<Product> findByNameIgnoreCase(String name);

    // Check whether a product name already exists
    boolean existsByNameIgnoreCase(String name);

    // Search published products by name
    List<Product> findByPublishedTrueAndNameContainingIgnoreCase(
            String name
    );

    // Find products by category
    List<Product> findByCategory(ProductCategory category);

    // Get published products in a category
    List<Product> findByCategoryAndPublishedTrueOrderByCreatedAtDesc(
            ProductCategory category
    );

    // Get all featured and published products
    List<Product> findByFeaturedTrueAndPublishedTrueOrderByCreatedAtDesc();

    // Get products that are in stock
    List<Product> findByStockQuantityGreaterThanAndPublishedTrue(
            Integer stockQuantity
    );

    // Find products within a price range
    List<Product> findByPriceBetweenAndPublishedTrueOrderByPriceAsc(
            java.math.BigDecimal minPrice,
            java.math.BigDecimal maxPrice
    );

    // Find a product by its primary image URL
    Optional<Product> findByImageUrl(String imageUrl);
}
