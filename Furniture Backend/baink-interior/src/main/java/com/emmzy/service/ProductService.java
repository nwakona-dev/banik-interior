
package com.emmzy.service;

import com.emmzy.payload.ProductRequest;
import com.emmzy.payload.ProductResponse;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    List<ProductResponse> getAllProducts();

    List<ProductResponse> getPublishedProducts();

    ProductResponse getProductById(Long id);

    List<ProductResponse> searchProductsByName(String name);

    List<ProductResponse> getProductsByCategory(String category);

    List<ProductResponse> getFeaturedProducts();

    List<ProductResponse> getProductsByPriceRange(
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    ProductResponse updatePublishedStatus(Long id, boolean published);
}
