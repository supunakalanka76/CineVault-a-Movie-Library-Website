"use strict";


// CineVault - Contact Form Validation

const contactForm = document.querySelector("#contact-form");

const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const commentsInput = document.querySelector("#comments");

const formMessage = document.querySelector("#form-message");



// Validation Patterns

const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phonePattern =
    /^[0-9+\-\s()]{7,20}$/;



// Error Helpers

function showError(input, message) {

    const formGroup =
        input.closest(".form-group");

    const errorElement =
        formGroup.querySelector(".form-error");

    formGroup.classList.add("is-invalid");
    formGroup.classList.remove("is-valid");

    input.setAttribute(
        "aria-invalid",
        "true"
    );

    if (errorElement) {
        errorElement.textContent = message;

        if (errorElement.id) {
            input.setAttribute(
                "aria-describedby",
                errorElement.id
            );
        }
    }
}


function showSuccess(input) {

    const formGroup =
        input.closest(".form-group");

    const errorElement =
        formGroup.querySelector(".form-error");

    formGroup.classList.remove("is-invalid");
    formGroup.classList.add("is-valid");

    input.setAttribute(
        "aria-invalid",
        "false"
    );

    input.removeAttribute(
        "aria-describedby"
    );

    if (errorElement) {
        errorElement.textContent = "";
    }
}



// First Name

function validateFirstName() {

    const value =
        firstNameInput.value.trim();

    if (!value) {

        showError(
            firstNameInput,
            "First name is required."
        );

        return false;
    }

    if (value.length < 2) {

        showError(
            firstNameInput,
            "First name must contain at least 2 characters."
        );

        return false;
    }

    if (value.length > 50) {

        showError(
            firstNameInput,
            "First name must not exceed 50 characters."
        );

        return false;
    }

    showSuccess(firstNameInput);

    return true;
}



// Last Name

function validateLastName() {

    const value =
        lastNameInput.value.trim();

    if (!value) {

        showError(
            lastNameInput,
            "Last name is required."
        );

        return false;
    }

    if (value.length < 2) {

        showError(
            lastNameInput,
            "Last name must contain at least 2 characters."
        );

        return false;
    }

    if (value.length > 50) {

        showError(
            lastNameInput,
            "Last name must not exceed 50 characters."
        );

        return false;
    }

    showSuccess(lastNameInput);

    return true;
}


// Email

function validateEmail() {

    const value =
        emailInput.value.trim();

    if (!value) {

        showError(
            emailInput,
            "Email address is required."
        );

        return false;
    }

    if (!emailPattern.test(value)) {

        showError(
            emailInput,
            "Please enter a valid email address."
        );

        return false;
    }

    showSuccess(emailInput);

    return true;
}


// Phone

function validatePhone() {

    const value =
        phoneInput.value.trim();

    /*
     * Phone is optional.
     * An empty phone field is therefore valid.
     */

    if (!value) {

        showSuccess(phoneInput);

        return true;
    }

    if (!phonePattern.test(value)) {

        showError(
            phoneInput,
            "Please enter a valid phone number."
        );

        return false;
    }

    showSuccess(phoneInput);

    return true;
}


// Comments

function validateComments() {

    const value =
        commentsInput.value.trim();

    if (!value) {

        showError(
            commentsInput,
            "Comments are required."
        );

        return false;
    }

    if (value.length < 10) {

        showError(
            commentsInput,
            "Comments must contain at least 10 characters."
        );

        return false;
    }

    if (value.length > 1000) {

        showError(
            commentsInput,
            "Comments must not exceed 1000 characters."
        );

        return false;
    }

    showSuccess(commentsInput);

    return true;
}


// Validate Complete Form

function validateForm() {

    const validations = [
        {
            input: firstNameInput,
            valid: validateFirstName()
        },
        {
            input: lastNameInput,
            valid: validateLastName()
        },
        {
            input: emailInput,
            valid: validateEmail()
        },
        {
            input: phoneInput,
            valid: validatePhone()
        },
        {
            input: commentsInput,
            valid: validateComments()
        }
    ];

    const firstInvalid =
        validations.find(
            (field) => !field.valid
        );

    if (firstInvalid) {

        firstInvalid.input.focus();

        return false;
    }

    return true;
}


// Server Validation Errors

function handleServerErrors(errors) {

    const fieldMap = {
        firstName: firstNameInput,
        lastName: lastNameInput,
        email: emailInput,
        phone: phoneInput,
        comments: commentsInput
    };

    let firstInvalidInput = null;

    Object.entries(errors).forEach(
        ([fieldName, message]) => {

            const input = fieldMap[fieldName];

            if (!input) {
                return;
            }

            showError(input, message);

            if (!firstInvalidInput) {
                firstInvalidInput = input;
            }
        }
    );

    if (firstInvalidInput) {
        firstInvalidInput.focus();
    }
}


// Submit Form

contactForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        formMessage.textContent = "";
        formMessage.className =
            "form-message";

        // Run frontend validation first
        const isValid = validateForm();

        if (!isValid) {

            formMessage.textContent =
                "Please correct the highlighted fields.";

            formMessage.classList.add(
                "form-message--error"
            );

            return;
        }


        // Prepare Form Data

        const formData = {
            firstName:
                firstNameInput.value.trim(),

            lastName:
                lastNameInput.value.trim(),

            email:
                emailInput.value.trim(),

            phone:
                phoneInput.value.trim(),

            comments:
                commentsInput.value.trim()
        };


        const submitButton =
            contactForm.querySelector(
                ".contact-form__submit"
            );


        // Loading State

        submitButton.disabled = true;
        submitButton.textContent =
            "Submitting...";


        
        // Send Data to PHP

        try {

            const response = await fetch(
                "api/contact.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(formData)
                }
            );


            let result;

            try {

                result =
                    await response.json();

            } catch {

                throw new Error(
                    "The server returned an invalid response."
                );
            }


            
            // PHP Validation Errors

            if (
                response.status === 422 &&
                result.errors
            ) {

                handleServerErrors(
                    result.errors
                );

                formMessage.textContent =
                    result.message ||
                    "Please correct the highlighted fields.";

                formMessage.classList.add(
                    "form-message--error"
                );

                return;
            }

            // Other Backend Errors

            if (
                !response.ok ||
                !result.success
            ) {

                throw new Error(
                    result.message ||
                    "Unable to submit the form."
                );
            }

            // Successful Submission

            contactForm.reset();


            // Remove green/red field states
            contactForm
                .querySelectorAll(
                    ".form-group"
                )
                .forEach((group) => {

                    group.classList.remove(
                        "is-valid",
                        "is-invalid"
                    );
                });


            // Reset accessibility attributes
            contactForm
                .querySelectorAll(
                    "input, textarea"
                )
                .forEach((input) => {

                    input.removeAttribute(
                        "aria-invalid"
                    );

                    input.removeAttribute(
                        "aria-describedby"
                    );
                });


            // Clear old field error messages
            contactForm
                .querySelectorAll(
                    ".form-error"
                )
                .forEach((error) => {

                    error.textContent = "";
                });


            // Show backend success message
            formMessage.textContent =
                result.message;

            formMessage.classList.add(
                "form-message--success"
            );


        } catch (error) {

            console.error(
                "Contact form submission failed:",
                error
            );

            formMessage.textContent =
                error.message ||
                "Something went wrong. Please try again.";

            formMessage.classList.add(
                "form-message--error"
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "Submit";
        }
    }
);




// Real-time Validation

firstNameInput.addEventListener(
    "blur",
    validateFirstName
);

lastNameInput.addEventListener(
    "blur",
    validateLastName
);

emailInput.addEventListener(
    "blur",
    validateEmail
);

phoneInput.addEventListener(
    "blur",
    validatePhone
);

commentsInput.addEventListener(
    "blur",
    validateComments
);


// Clear Error While Correcting Input

[
    firstNameInput,
    lastNameInput,
    emailInput,
    phoneInput,
    commentsInput
].forEach((input) => {

    input.addEventListener(
        "input",
        () => {

            const formGroup =
                input.closest(".form-group");

            /*
             * Only revalidate a field if the
             * user has already triggered an error.
             */

            if (
                formGroup.classList.contains(
                    "is-invalid"
                )
            ) {

                switch (input.id) {

                    case "first-name":
                        validateFirstName();
                        break;

                    case "last-name":
                        validateLastName();
                        break;

                    case "email":
                        validateEmail();
                        break;

                    case "phone":
                        validatePhone();
                        break;

                    case "comments":
                        validateComments();
                        break;
                }
            }
        }
    );
});