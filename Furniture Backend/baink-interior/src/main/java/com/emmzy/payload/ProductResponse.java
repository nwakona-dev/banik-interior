
package com.emmzy.payload;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private ProductCategory category;

    private String imageUrl;

    private String additionalImages;

    private Integer stockQuantity;

    private boolean featured;

    private boolean published;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
