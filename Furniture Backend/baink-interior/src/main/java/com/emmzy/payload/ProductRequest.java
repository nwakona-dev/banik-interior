package com.emmzy.payload;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 150, message = "Product name cannot exceed 150 characters")
    private String name;

    @NotBlank(message = "Product description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Product price is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Product price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Product category is required")
    private ProductCategory category = ProductCategory.OTHERS;

    @Size(max = 255, message = "Image URL cannot exceed 255 characters")
    private String imageUrl;

    @Size(max = 500, message = "Additional images cannot exceed 500 characters")
    private String additionalImages;

    @NotNull(message = "Stock quantity is required")
    @jakarta.validation.constraints.Min(
            value = 0,
            message = "Stock quantity cannot be negative"
    )
    private Integer stockQuantity = 0;

    private boolean featured = false;

    private boolean published = false;
}
