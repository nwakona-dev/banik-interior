
package com.emmzy.mapper;

import com.emmzy.model.Product;
import com.emmzy.payload.ProductCategory;
import com.emmzy.payload.ProductRequest;
import com.emmzy.payload.ProductResponse;

public final class ProductMapper {

    private ProductMapper() {
        // Utility class; prevent instantiation.
    }

    public static Product toEntity(ProductRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Product request must not be null."
            );
        }

        Product product = new Product();
        updateEntity(product, request);

        return product;
    }

    public static void updateEntity(
            Product product,
            ProductRequest request
    ) {
        if (product == null) {
            throw new IllegalArgumentException(
                    "Product entity must not be null."
            );
        }

        if (request == null) {
            throw new IllegalArgumentException(
                    "Product request must not be null."
            );
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());

        product.setCategory(
                request.getCategory() != null
                        ? request.getCategory()
                        : ProductCategory.OTHERS
        );

        product.setImageUrl(request.getImageUrl());
        product.setAdditionalImages(request.getAdditionalImages());

        product.setStockQuantity(
                request.getStockQuantity() != null
                        ? request.getStockQuantity()
                        : 0
        );

        product.setFeatured(request.isFeatured());
        product.setPublished(request.isPublished());
    }

    public static ProductResponse toResponse(Product product) {
        if (product == null) {
            throw new IllegalArgumentException(
                    "Product entity must not be null."
            );
        }

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setCategory(product.getCategory());
        response.setImageUrl(product.getImageUrl());
        response.setAdditionalImages(product.getAdditionalImages());
        response.setStockQuantity(product.getStockQuantity());
        response.setFeatured(product.isFeatured());
        response.setPublished(product.isPublished());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        return response;
    }
}
