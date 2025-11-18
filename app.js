const form = document.getElementById("smart-form");
const errorSummary = document.getElementById("error-summary");

// Restore draft on load
window.addEventListener("DOMContentLoaded", () => {
    const draft = JSON.parse(localStorage.getItem("smartFormDraft"));
    if (!draft) return;

    Object.entries(draft).forEach(([key, value]) => {
        const field = document.querySelector(`[name="${key}"]`);
        if (field) field.value = value;
    });

    console.log("Restored Draft");
});

// Autosave on input
form.addEventListener("input", () => {
    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem("smartFormDraft", JSON.stringify(data));
    console.log("Saved Draft");
});

// Validation function
function validateField(field) {
    const errorEl = document.getElementById(`${field.id}-error`);

    if (field.validity.valid) {
        errorEl.textContent = "";
        field.setAttribute("aria-invalid", "false");
        return null;
    }

    field.setAttribute("aria-invalid", "true");

    if (field.validity.valueMissing) {
        errorEl.textContent = "This field is required.";
    } else if (field.validity.typeMismatch) {
        errorEl.textContent = "Enter a valid value.";
    } else {
        errorEl.textContent = "Invalid input.";
    }

    return { field, message: errorEl.textContent };
}

// Submit
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const errors = [];
    const fields = [...form.querySelectorAll("input, textarea")];

    fields.forEach(f => {
        const result = validateField(f);
        if (result) errors.push(result);
    });

    if (errors.length) {
        errorSummary.style.display = "block";
        errorSummary.innerHTML = `
            <strong>Please fix the following errors:</strong>
            <ul>${errors.map(e => `<li>${e.message}</li>`).join("")}</ul>
        `;

        errors[0].field.focus();
        return;
    }

    errorSummary.style.display = "none";
    localStorage.removeItem("smartFormDraft");

    alert("Form submitted successfully (mock submission).");
});

// Phone normalisation on blur
document.getElementById("phone").addEventListener("blur", (e) => {
    let val = e.target.value;

    // Remove all non-numeric characters
    val = val.replace(/\D/g, "");

    // Convert Finnish numbers: 0401234567 → +358401234567
    if (val.startsWith("0")) {
        val = "+358" + val.substring(1);
    } else if (!val.startsWith("+")) {
        val = "+" + val;
    }

    e.target.value = val;
});
