/* ==============================
   MOBILE NAVIGATION
   ============================== */

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {

        mainNav.classList.toggle("active");

        if (mainNav.classList.contains("active")) {
            menuToggle.textContent = "✕";
        } else {
            menuToggle.textContent = "☰";
        }

    });

    const navLinks = mainNav.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mainNav.classList.remove("active");
            menuToggle.textContent = "☰";

        });

    });

}


/* ==============================
   GALLERY LIGHTBOX
   ============================== */

const galleryImages = document.querySelectorAll(".gallery-item img");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");

const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

let currentImageIndex = 0;


/* OPEN LIGHTBOX */

galleryImages.forEach(function (image, index) {

    image.addEventListener("click", function () {

        currentImageIndex = index;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

    });

});


/* CLOSE LIGHTBOX */

function closeLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove("active");

    document.body.style.overflow = "";

}


if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
}


/* PREVIOUS IMAGE */

function showPreviousImage() {

    if (!galleryImages.length) return;

    currentImageIndex--;

    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }

    lightboxImage.src =
        galleryImages[currentImageIndex].src;

    lightboxImage.alt =
        galleryImages[currentImageIndex].alt;

}


if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPreviousImage);
}


/* NEXT IMAGE */

function showNextImage() {

    if (!galleryImages.length) return;

    currentImageIndex++;

    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    lightboxImage.src =
        galleryImages[currentImageIndex].src;

    lightboxImage.alt =
        galleryImages[currentImageIndex].alt;

}


if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextImage);
}


/* CLICK OUTSIDE IMAGE TO CLOSE */

if (lightbox) {

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

}


/* KEYBOARD CONTROLS */

document.addEventListener("keydown", function (event) {

    if (!lightbox || !lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }

});


/* ==============================
   ENROLMENT / JOB APPLICATION
   SWITCHER
   ============================== */

document.addEventListener("DOMContentLoaded", function () {

    const applicationType =
        document.getElementById("application-type");

    const enrolmentFields =
        document.getElementById("enrolment-fields");

    const jobFields =
        document.getElementById("job-fields");

    if (!applicationType || !enrolmentFields || !jobFields) {
        return;
    }


    const childName =
        document.getElementById("child-name");

    const childAge =
        document.getElementById("child-age");

    const grade =
        document.getElementById("grade");

    const subject =
        document.getElementById("subject");

    const jobPosition =
        document.getElementById("job-position");

    const experience =
        document.getElementById("experience");

    const cv =
        document.getElementById("cv");


    /* Initially hide both */

    enrolmentFields.style.display = "none";
    jobFields.style.display = "none";


    /* Remove requirements initially */

    if (childName) childName.required = false;
    if (childAge) childAge.required = false;
    if (grade) grade.required = false;
    if (subject) subject.required = false;

    if (jobPosition) jobPosition.required = false;
    if (experience) experience.required = false;


    /* ==============================
       SELECTION CHANGED
       ============================== */

    applicationType.addEventListener("change", function () {


        /* ==============================
           CHILD ENROLMENT
           ============================== */

        if (this.value === "Child Enrolment") {

            enrolmentFields.style.display = "block";
            jobFields.style.display = "none";


            /* Child fields required */

            if (childName) childName.required = true;
            if (childAge) childAge.required = true;
            if (grade) grade.required = true;
            if (subject) subject.required = true;


            /* Job fields not required */

            if (jobPosition) jobPosition.required = false;
            if (experience) experience.required = false;


            /* Clear job fields */

            if (jobPosition) jobPosition.value = "";
            if (experience) experience.value = "";
            if (cv) cv.value = "";


        }


        /* ==============================
           JOB APPLICATION
           ============================== */

        else if (this.value === "Job Application") {

            enrolmentFields.style.display = "none";
            jobFields.style.display = "block";


            /* Job fields required */

            if (jobPosition) jobPosition.required = true;
            if (experience) experience.required = true;


            /* Child fields not required */

            if (childName) childName.required = false;
            if (childAge) childAge.required = false;
            if (grade) grade.required = false;
            if (subject) subject.required = false;


            /* Clear child fields */

            if (childName) childName.value = "";
            if (childAge) childAge.value = "";
            if (grade) grade.value = "";
            if (subject) subject.value = "";


        }


        /* ==============================
           NOTHING SELECTED
           ============================== */

        else {

            enrolmentFields.style.display = "none";
            jobFields.style.display = "none";


            if (childName) childName.required = false;
            if (childAge) childAge.required = false;
            if (grade) grade.required = false;
            if (subject) subject.required = false;

            if (jobPosition) jobPosition.required = false;
            if (experience) experience.required = false;

        }

    });

});


/* ==============================
   CV FILE NAME
   ============================== */

const cvInput = document.getElementById("cv");
const cvFileName = document.getElementById("cv-file-name");

if (cvInput && cvFileName) {

    cvInput.addEventListener("change", function () {

        if (this.files.length > 0) {

            cvFileName.textContent =
                "Selected: " + this.files[0].name;

        } else {

            cvFileName.textContent = 
                "No file selected";

        }

    });

}

/* ==============================
   JOB APPLICATION QUICK LINK
============================== */

function selectJobApplication() {

    const applicationType =
        document.getElementById("application-type");

    if (applicationType) {

        applicationType.value = "Job Application";

        applicationType.dispatchEvent(
            new Event("change")
        );

    }

}

