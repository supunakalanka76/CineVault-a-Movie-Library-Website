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


// Submit Validation

contactForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        formMessage.textContent = "";
        formMessage.className =
            "form-message";

        const isValid =
            validateForm();

        if (!isValid) {

            formMessage.textContent =
                "Please correct the highlighted fields.";

            formMessage.classList.add(
                "form-message--error"
            );

            return;
        }

        /*
         * Step 9:
         * Valid data will be sent to contact.php here.
         */

        formMessage.textContent =
            "Form validation successful.";

        formMessage.classList.add(
            "form-message--success"
        );
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