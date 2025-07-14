package com.example.authify.io;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest {

    @NotBlank(message = "Name should not be empty.")
    private String name;

    @Email(message = "Enter valid email address.")
    @NotNull(message = "Email should not be empty.")
    private String email;

    @Size(min = 8, message = "Password must have at least 8 characters.")
    private String password;

}
